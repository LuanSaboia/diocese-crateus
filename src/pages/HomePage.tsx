import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function HomePage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .eq('publicado', true)
        .order('data_publicacao', { ascending: false })
        .limit(4)
      
      if (data) setNoticias(data)
      setLoading(false)
    }
    fetchNoticias()
  }, [])

  if (loading) return <div className="p-10 text-center">Carregando portal...</div>

  const principal = noticias[0]
  const secundarias = noticias.slice(1)

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6">
      {/* MANCHETE PRINCIPAL (ESTILO BLOG) */}
      {principal && (
        <Link to={`/noticias/${principal.slug}`} className="group">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all">
            <div className="md:w-3/5 aspect-video overflow-hidden">
              <img 
                src={principal.imagem_capa_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-2/5 p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4 bg-blue-600 hover:bg-blue-700">Notícia em Destaque</Badge>
              <h1 className="text-3xl font-bold leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {principal.titulo}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6">
                {principal.subtitulo}
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="w-4 h-4" />
                {new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* GRID DE NOTÍCIAS SECUNDÁRIAS */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Mais lidas da semana</h2>
          <Link to="/noticias" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-semibold">
            Ver todo o arquivo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secundarias.map((item) => (
            <Link key={item.id} to={`/noticias/${item.slug}`} className="group">
              <Card className="h-full border-none shadow-none bg-transparent">
                <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 border border-zinc-100 dark:border-zinc-800">
                  <img src={item.imagem_capa_url} className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full" />
                </div>
                <CardHeader className="p-0 space-y-2">
                  <CardTitle className="text-xl leading-snug group-hover:text-blue-600 transition-colors">
                    {item.titulo}
                  </CardTitle>
                  <p className="text-zinc-500 text-sm line-clamp-2">{item.subtitulo}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}