import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import supabase from "@/lib/supabase"

export function NoticiaDetailPage() {
  const { slug } = useParams()
  const [noticia, setNoticia] = useState<any>(null)

  useEffect(() => {
    async function getNoticia() {
      const { data } = await supabase
        .from('noticias')
        .select('*, categorias(nome)')
        .eq('slug', slug)
        .single()
      if (data) setNoticia(data)
    }
    getNoticia()
  }, [slug])

  if (!noticia) return null

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
          {noticia.categorias?.nome || "Notícias"}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
          {noticia.titulo}
        </h1>
        <p className="text-xl text-zinc-500 mb-8 italic">
          {noticia.subtitulo}
        </p>
        <div className="text-sm text-zinc-400">
          Publicado em {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}
        </div>
      </header>

      <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
        <img src={noticia.imagem_capa_url} className="w-full h-full object-cover" />
      </div>

      {/* CONTEÚDO DA NOTÍCIA */}
      <div 
        className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none 
        prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
      />
    </article>
  )
}