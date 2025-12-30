import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Image as ImageIcon, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/RichTextEditor"

export function AdminNewsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loadingData, setLoadingData] = useState(!!id)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [noticia, setNoticia] = useState({
    titulo: "",
    subtitulo: "",
    conteudo: "",
    slug: "",
    imagem_capa_url: "",
    data_publicacao: ""
  })

  const [galeria, setGaleria] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      async function loadData() {
        const { data: news } = await supabase.from('noticias').select('*').eq('id', id).single()
        if (news) setNoticia(news)

        const { data: photos } = await supabase.from('fotos_noticias').select('url').eq('noticia_id', id)
        if (photos) setGaleria(photos.map(p => p.url))

        setLoadingData(false)
      }
      loadData()
    }
  }, [id])

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  useEffect(() => {
    if (!id) setNoticia(prev => ({ ...prev, slug: generateSlug(prev.titulo) }))
  }, [noticia.titulo, id])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    try {
      setUploading(true)
      const files = event.target.files
      if (!files || files.length === 0) return

      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error } = await supabase.storage.from('noticias').upload(fileName, file)
        if (error) throw error

        const { data } = supabase.storage.from('noticias').getPublicUrl(fileName)
        uploadedUrls.push(data.publicUrl)
      }

      if (isGallery) {
        setGaleria(prev => [...prev, ...uploadedUrls])
      } else {
        setNoticia(prev => ({ ...prev, imagem_capa_url: uploadedUrls[0] }))
      }
    } catch (error: any) {
      alert("Erro no upload: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!noticia.titulo || !noticia.imagem_capa_url) {
      alert("Título e Imagem de Capa são obrigatórios.")
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...noticia,
        publicado: true,
        data_publicacao: noticia.data_publicacao || new Date().toISOString()
      }

      // 1. Salva ou atualiza a notícia
      const { data: newsData, error: newsError } = id
        ? await supabase.from('noticias').update(payload).eq('id', id).select().single()
        : await supabase.from('noticias').insert([payload]).select().single()

      if (newsError) throw newsError

      // 2. Sincroniza a galeria de fotos
      // Primeiro removemos as referências antigas para evitar duplicados na edição
      if (id) {
        await supabase.from('fotos_noticias').delete().eq('noticia_id', id)
      }

      // Se houver fotos na galeria, inserimos na nova tabela
      if (galeria.length > 0) {
        const photosPayload = galeria.map(url => ({
          noticia_id: newsData.id,
          url
        }))
        const { error: photoError } = await supabase.from('fotos_noticias').insert(photosPayload)
        if (photoError) console.error("Erro ao salvar galeria:", photoError)
      }

      alert(id ? "Notícia atualizada!" : "Notícia publicada!")
      navigate("/admin/dashboard")
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) return <div className="p-20 text-center flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 px-4">
      <h1 className="text-3xl font-bold">{id ? "Editar Notícia" : "Nova Publicação"}</h1>

      <div className="grid gap-8 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
        {/* Título e Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold">Título</Label>
            <Input value={noticia.titulo} onChange={e => setNoticia({ ...noticia, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-zinc-400">Slug (Link)</Label>
            <Input value={noticia.slug} readOnly className="bg-zinc-50 cursor-not-allowed" />
          </div>
        </div>

        {/* Imagem de Capa */}
        <div className="space-y-3">
          <Label className="font-bold text-blue-600">Imagem de Capa (Principal)</Label>
          <Tabs defaultValue={noticia.imagem_capa_url ? "url" : "upload"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">Link URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="border-2 border-dashed p-6 rounded-lg text-center">
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} disabled={uploading} />
            </TabsContent>
            <TabsContent value="url">
              <Input value={noticia.imagem_capa_url} onChange={e => setNoticia({ ...noticia, imagem_capa_url: e.target.value })} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Galeria de Fotos */}
        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border-2 border-dashed">
          <Label className="font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Galeria de Fotos (Opcional)</Label>
          <Input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, true)} disabled={uploading} />

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
            {galeria.map((url, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={url} className="w-full h-full object-cover rounded-md border" />
                <button
                  onClick={() => setGaleria(galeria.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Conteúdo</Label>
          <RichTextEditor content={noticia.conteudo} onChange={(html) => setNoticia({ ...noticia, conteudo: html })} />
        </div>

        <Button onClick={handleSave} disabled={uploading || saving} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white font-bold">
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
          {id ? "Salvar Alterações" : "Publicar Notícia"}
        </Button>
      </div>
    </div>
  )
}