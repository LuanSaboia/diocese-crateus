import { useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AdminNewsPage() {
  const [noticia, setNoticia] = useState({ titulo: "", subtitulo: "", conteudo: "", slug: "", imagem_url: "" })

  const handleSave = async () => {
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
      
      <div className="grid gap-4">
        <Input placeholder="Título da Notícia" onChange={e => setNoticia({...noticia, titulo: e.target.value})} />
        <Input placeholder="Subtítulo / Resumo" onChange={e => setNoticia({...noticia, subtitulo: e.target.value})} />
        <Input placeholder="URL da Imagem de Capa" onChange={e => setNoticia({...noticia, imagem_url: e.target.value})} />
        <Input placeholder="slug-da-noticia (ex: festa-padroeira-2024)" onChange={e => setNoticia({...noticia, slug: e.target.value})} />
        
        {/* Usando o componente de texto do projeto base */}
        <Textarea 
          placeholder="Escreva aqui o conteúdo da notícia..." 
          className="min-h-[300px]"
          onChange={e => setNoticia({...noticia, conteudo: e.target.value})}
        />
        
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Publicar Notícia</Button>
      </div>
    </div>
  )
}