import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Link as LinkIcon, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/RichTextEditor"

export function AdminNewsPage() {
  const { id } = useParams() // Pega o ID da URL se for edição
  const navigate = useNavigate()
  const [loadingData, setLoadingData] = useState(!!id)
  const [noticia, setNoticia] = useState({
    titulo: "",
    subtitulo: "",
    conteudo: "",
    slug: "",
    imagem_capa_url: "",
    data_publicacao: ""
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 1. Carregar dados se for Edição
  useEffect(() => {
    if (id) {
      async function loadNoticia() {
        const { data } = await supabase
          .from('noticias')
          .select('*')
          .eq('id', id)
          .single()

        if (data) setNoticia(data)
        setLoadingData(false)
      }
      loadNoticia()
    }
  }, [id])

  // 2. Gerador de Slug
  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Atualiza o slug apenas se for uma NOVA notícia (para não quebrar links antigos na edição)
  useEffect(() => {
    if (!id) {
      setNoticia(prev => ({ ...prev, slug: generateSlug(prev.titulo) }))
    }
  }, [noticia.titulo, id])

  // 3. Upload de Imagem
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('imagens-noticias')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('imagens-noticias').getPublicUrl(fileName)
      setNoticia(prev => ({ ...prev, imagem_capa_url: data.publicUrl }))
    } catch (error: any) {
      alert("Erro no upload: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  // 4. Salvar (Insert ou Update)
  const handleSave = async () => {
    if (!noticia.titulo || !noticia.imagem_capa_url) {
      alert("Título e Imagem são obrigatórios.")
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...noticia,
        publicado: true,
        data_publicacao: noticia.data_publicacao || new Date().toISOString()
      }

      // Executa Update se houver ID, caso contrário Insert
      const { error } = id
        ? await supabase.from('noticias').update(payload).eq('id', id)
        : await supabase.from('noticias').insert([payload])

      if (error) {
        if (error.code === '23505') alert("Este link (slug) já existe. Tente mudar o título.")
        else throw error
      } else {
        // Retorno visual de sucesso
        alert(id ? "Notícia atualizada com sucesso!" : "Notícia publicada com sucesso!")

        // Redirecionamento automático para o Dashboard
        navigate("/admin/dashboard")
      }
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) return <div className="p-20 text-center flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Carregando dados...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">{id ? "Editar Notícia" : "Nova Publicação"}</h1>
          <p className="text-zinc-500 text-sm">Gerencie o conteúdo do portal.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>Cancelar</Button>
      </div>

      <div className="grid gap-8 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold">Título da Notícia</Label>
            <Input
              value={noticia.titulo}
              onChange={e => setNoticia({ ...noticia, titulo: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-zinc-400">Slug (URL)</Label>
            <Input
              value={noticia.slug}
              readOnly={!!id} // Na edição o slug fica bloqueado para não quebrar SEO
              className="bg-zinc-50 dark:bg-zinc-900 border-dashed cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-bold">Imagem de Capa</Label>
          <Tabs defaultValue={noticia.imagem_capa_url ? "url" : "upload"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" /> Upload</TabsTrigger>
              <TabsTrigger value="url" className="gap-2"><LinkIcon className="w-4 h-4" /> Link URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              {noticia.imagem_capa_url && !uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={noticia.imagem_capa_url} className="h-20 w-32 object-cover rounded-md border" />
                  <Button variant="outline" size="sm" onClick={() => setNoticia({ ...noticia, imagem_capa_url: "" })}>Trocar Imagem</Button>
                </div>
              ) : (
                <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="max-w-xs" />
              )}
            </TabsContent>

            <TabsContent value="url" className="p-4 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20">
              <Input
                placeholder="https://..."
                value={noticia.imagem_capa_url}
                onChange={e => setNoticia({ ...noticia, imagem_capa_url: e.target.value })}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Subtítulo / Resumo</Label>
          <Input value={noticia.subtitulo} onChange={e => setNoticia({ ...noticia, subtitulo: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Conteúdo da Matéria</Label>
          <RichTextEditor
            content={noticia.conteudo}
            onChange={(html) => setNoticia({ ...noticia, conteudo: html })}
          />
        </div>

        <Button onClick={handleSave} disabled={uploading || saving} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Salvando..." : id ? "Atualizar Notícia" : "Publicar Notícia"}
        </Button>
      </div>
    </div>
  )
}