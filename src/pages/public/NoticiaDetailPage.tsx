import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Noticia } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { BannerSlider } from "@/components/domain/BannerSlider" // <--- IMPORTANTE
import { ArrowLeft, Calendar, Newspaper, User, ArrowRight } from "lucide-react"

export function NoticiaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [relacionadas, setRelacionadas] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNoticiaData() {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('noticias')
          .select('*, categorias(nome, cor)')
          .eq('slug', slug)
          .single()

        if (error) throw error
        setNoticia(data as Noticia)

        if (data) {
          const { data: relData } = await supabase
            .from('noticias')
            .select('*, categorias(nome, cor)')
            .neq('id', data.id)
            .eq('publicado', true)
            .order('data_publicacao', { ascending: false })
            .limit(4)

          setRelacionadas((relData as Noticia[]) || [])
        }
      } catch (err) {
        console.error("Erro ao carregar notícia:", err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadNoticiaData()
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
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/noticias">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Notícias
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/noticias">
          <ArrowLeft className="w-4 h-4" /> Voltar para Notícias
        </Link>
      </Button>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* COLUNA ESQUERDA: CORPO DA NOTÍCIA */}
        <article className="lg:col-span-2 space-y-8">
          <header className="space-y-4">
            {noticia.categorias && (
              <Badge 
                className={`text-xs font-semibold border-none text-white ${
                  (noticia.categorias as any).cor || 'bg-[#2563eb]'
                }`}
              >
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
                  {new Date(noticia.data_publicacao || noticia.created_at || Date.now()).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </header>

          {noticia.imagem_capa_url && (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] border border-[#e4e4e7] dark:border-[#27272a] shadow-sm">
              <img
                src={noticia.imagem_capa_url}
                alt={noticia.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-[#09090b] dark:text-[#fafafa] leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: noticia.conteudo || "" }}
          />

          <div className="pt-6 border-t border-[#e4e4e7] dark:border-[#27272a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[#2563eb] border border-[#e4e4e7] dark:border-[#27272a]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#09090b] dark:text-[#fafafa]">
                Assessoria de Comunicação Diocesana
              </p>
              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                Diocese de Crateús • Pascom
              </p>
            </div>
          </div>
        </article>

        {/* COLUNA DIREITA: SIDEBAR COM O SLIDER DE BANNERS */}
        <aside className="space-y-8">
          
          {/* BLOCO 1: OUTRAS NOTÍCIAS */}
          <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl p-5 border border-[#e4e4e7] dark:border-[#27272a] shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#09090b] dark:text-[#fafafa] border-b border-[#f4f4f5] dark:border-[#27272a] pb-2">
              Outras Notícias
            </h3>

            <div className="space-y-3.5">
              {relacionadas.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/noticias/${item.slug || item.id}`} className="group block">
                  <div className="flex gap-3 items-start">
                    {item.imagem_capa_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#f4f4f5] border border-[#e4e4e7] dark:border-[#27272a]">
                        <img 
                          src={item.imagem_capa_url} 
                          alt={item.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors line-clamp-2 leading-snug">
                        {item.titulo}
                      </h4>
                      <span className="text-[10px] text-[#71717a]">
                        {new Date(item.data_publicacao || item.created_at || Date.now()).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link 
              to="/noticias" 
              className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 pt-2 uppercase tracking-wider text-[11px]"
            >
              Ver todas as matérias <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* BLOCO 2: SLIDER AUTOMÁTICO DE BANNERS (5 SEGUNDOS) */}
          <BannerSlider tempoTrocaMs={5000} />

        </aside>

      </div>

    </div>
  )
}