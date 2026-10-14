import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Noticia } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Newspaper } from "lucide-react"

export function NoticiaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNoticia() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('noticias')
          .select('*, categorias(nome)')
          .eq('slug', slug)
          .single()

        if (error) throw error
        setNoticia(data as Noticia)
      } catch (err) {
        console.error("Erro ao carregar notícia:", err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadNoticia()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando matéria...
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <Newspaper className="w-12 h-12 text-[#a1a1aa] mx-auto" />
        <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Notícia não encontrada
        </h2>
        <p className="text-xs text-[#71717a]">
          A matéria que você está procurando não existe ou foi removida.
        </p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/noticias">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Notícias
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Botão Voltar */}
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/noticias">
          <ArrowLeft className="w-4 h-4" /> Voltar para Notícias
        </Link>
      </Button>

      {/* Cabeçalho da Matéria */}
      <header className="space-y-4">
        {noticia.categorias && (
          <Badge variant="outline" className="text-xs font-semibold text-[#2563eb] border-[#2563eb]/20">
            {(noticia.categorias as any).nome}
          </Badge>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] leading-tight">
          {noticia.titulo}
        </h1>

        {noticia.subtitulo && (
          <p className="text-base text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
            {noticia.subtitulo}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-[#71717a] border-y border-[#e4e4e7] dark:border-[#27272a] py-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2563eb]" />
            <span>
              {new Date(noticia.data_publicacao || noticia.created_at || '').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Imagem de Capa */}
      {noticia.imagem_capa_url && (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] border border-[#e4e4e7] dark:border-[#27272a]">
          <img
            src={noticia.imagem_capa_url}
            alt={noticia.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Conteúdo Renderizado (suporta o HTML formatado pelo RichTextEditor) */}
      <div 
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-[#09090b] dark:text-[#fafafa] leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
      />

    </article>
  )
}