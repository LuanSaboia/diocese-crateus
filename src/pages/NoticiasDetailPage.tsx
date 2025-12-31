import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function NoticiasDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [noticia, setNoticia] = useState<any>(null)
  const [galeria, setGaleria] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticia() {
      
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        console.error("Erro ao carregar notícia:", error)
        setLoading(false)
        return
      }

      setNoticia(data)

      const { data: fotos, error: errorFotos } = await supabase
        .from('fotos_noticias')
        .select('url')
        .eq('noticia_id', data.id)

      if (!errorFotos && fotos) {
        setGaleria(fotos)
      }

      setLoading(false)
    }

    fetchNoticia()
  }, [slug])

  if (loading) return <div className="p-20 text-center text-zinc-500">A carregar notícia...</div>
  if (!noticia) return <div className="p-20 text-center">Notícia não encontrada.</div>

  return (
    <article className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Cabeçalho e Botão Voltar */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" /> Partilhar
        </Button>
      </div>

      <header className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {noticia.titulo}
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 italic">
          {noticia.subtitulo}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium pt-2">
          <Calendar className="w-4 h-4" />
          {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </header>

      {/* Imagem de Capa */}
      <div className="aspect-video overflow-hidden rounded-3xl shadow-2xl">
        <img 
          src={noticia.imagem_capa_url} 
          alt={noticia.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo da Notícia (Rich Text) */}
      <div 
        className="prose prose-blue dark:prose-invert max-w-none lg:prose-lg mt-10"
        dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
      />

      {/* Secção de Galeria de Fotos */}
      {galeria.length > 0 && (
        <section className="pt-10 space-y-6">
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Galeria de Fotos</h2>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeria.map((foto, index) => (
              <div 
                key={index} 
                className="aspect-square overflow-hidden rounded-xl bg-zinc-100 hover:opacity-90 transition-opacity cursor-pointer shadow-sm border"
                onClick={() => window.open(foto.url, '_blank')}
              >
                <img 
                  src={foto.url} 
                  alt={`Foto ${index + 1} da notícia`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-10 border-t">
        <p className="text-sm text-zinc-400 text-center italic">
          © Diocese de Crateús - Todos os direitos reservados.
        </p>
      </footer>
    </article>
  )
}