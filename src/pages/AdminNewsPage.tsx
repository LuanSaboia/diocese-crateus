import { useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label" // Se não tiver, pode usar um <label> comum
import { Loader2 } from "lucide-react"

export function AdminNewsPage() {
  const [noticia, setNoticia] = useState({ 
    titulo: "", 
    subtitulo: "", 
    conteudo: "", 
    slug: "", 
    imagem_capa_url: "" 
  })
  const [uploading, setUploading] = useState(false)

  // Função para fazer o upload da imagem
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('noticias')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('noticias').getPublicUrl(filePath)
      
      // Atualiza o estado da notícia com a URL pública da imagem
      setNoticia({ ...noticia, imagem_capa_url: data.publicUrl })
      alert("Imagem enviada com sucesso!")
    } catch (error: any) {
      alert("Erro no upload: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!noticia.imagem_capa_url) {
      alert("Por favor, faça o upload de uma imagem primeiro.")
      return
    }

    const { error } = await supabase.from('noticias').insert([{
      ...noticia,
      publicado: true,
      data_publicacao: new Date().toISOString()
    }])
    
    if (error) alert("Erro ao publicar: " + error.message)
    else alert("Notícia publicada com sucesso!")
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Nova Publicação</h1>
      
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input placeholder="Título da Notícia" onChange={e => setNoticia({...noticia, titulo: e.target.value})} />
        </div>

        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input placeholder="Subtítulo / Resumo" onChange={e => setNoticia({...noticia, subtitulo: e.target.value})} />
        </div>

        {/* ÁREA DE UPLOAD */}
        <div className="space-y-2 p-4 border-2 border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
          <Label>Imagem de Capa</Label>
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              disabled={uploading}
              className="cursor-pointer"
            />
            {uploading && <Loader2 className="animate-spin text-primary" />}
          </div>
          {noticia.imagem_capa_url && (
            <p className="text-xs text-green-600 font-medium">✓ Imagem carregada!</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Slug (URL amigável)</Label>
          <Input placeholder="ex: festa-padroeira-2024" onChange={e => setNoticia({...noticia, slug: e.target.value})} />
        </div>
        
        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Textarea 
            placeholder="Escreva aqui o conteúdo da notícia..." 
            className="min-h-[300px]"
            onChange={e => setNoticia({...noticia, conteudo: e.target.value})}
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={uploading}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        >
          {uploading ? "Aguardando Upload..." : "Publicar Notícia"}
        </Button>
      </div>
    </div>
  )
}