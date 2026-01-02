import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export function HomePage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDados() {
      // Busca Notícias
      const { data: news } = await supabase
        .from('noticias')
        .select('*, categorias(nome, cor)')
        .eq('publicado', true)
        .order('data_publicacao', { ascending: false })
        .limit(4)

      if (news) setNoticias(news)

      // Busca Eventos
      const { data: ev } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
        .limit(4)

      if (ev) setEventos(ev)
      setLoading(false)
    }
    fetchDados()
  }, [])

  if (loading) return <div className="p-20 text-center italic text-primary">Carregando portal...</div>

  const principal = noticias[0]
  const secundarias = noticias.slice(1)

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 px-4">
      
      {/* SEÇÃO DE DESTAQUE: MANCHETE + AGENDA LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Lado Esquerdo: Manchete Principal (2 colunas no LG) */}
        <div className="lg:col-span-2">
          {principal && (
            <Link to={`/noticias/${principal.slug}`} className="group block h-full">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 h-full min-h-[400px] shadow-xl">
                <img 
                  src={principal.imagem_url || principal.imagem_capa_url} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                  alt={principal.titulo} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 md:p-12 space-y-4">
                  {principal.categorias && (
                    <Badge className={`${principal.categorias.cor} border-none text-white px-4 py-1`}>
                      {principal.categorias.nome}
                    </Badge>
                  )}
                  <h2 className="text-3xl md:text-5xl font-bold text-white italic leading-tight group-hover:text-secondary transition-colors">
                    {principal.titulo}
                  </h2>
                  <div className="flex items-center gap-4 text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-secondary" />
                    {new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Lado Direito: Widget de Agenda Vertical */}
        <aside className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold italic text-primary">Agenda</h3>
            <Link to="/agenda" className="text-secondary hover:underline">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="space-y-6 flex-1">
            {eventos.map((evento) => (
              <div key={evento.id} className="group flex gap-4 items-start border-b border-zinc-50 dark:border-zinc-800 pb-4 last:border-0">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-2 min-w-[55px] text-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="block text-xl font-black leading-none">
                    {new Date(evento.data_evento).getDate() + 1}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    {new Date(evento.data_evento).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {evento.titulo}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 italic">
                    <MapPin className="w-3 h-3 text-secondary" /> {evento.local?.split(' - ')[0]}
                  </div>
                </div>
              </div>
            ))}
            {eventos.length === 0 && (
              <p className="text-zinc-400 italic text-sm text-center py-10">Nenhum evento agendado.</p>
            )}
          </div>

          <Link to="/agenda" className="mt-6 w-full py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-center text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-zinc-500">
            Ver agenda completa
          </Link>
        </aside>
      </div>

      {/* MAIS NOTÍCIAS (Abaixo da manchete/agenda) */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h3 className="text-2xl font-bold italic text-primary">Últimas Notícias</h3>
          <Link to="/noticias" className="text-secondary hover:underline flex items-center gap-1 text-sm font-black uppercase tracking-tighter">
            Arquivo completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secundarias.map((item) => (
            <Link key={item.id} to={`/noticias/${item.slug}`} className="group">
              <Card className="h-full border-none shadow-none bg-transparent flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 shadow-sm">
                  <img src={item.imagem_url || item.imagem_capa_url} className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full" />
                  {item.categorias && (
                    <Badge className={`absolute top-3 left-3 border-none text-[10px] ${item.categorias.cor}`}>
                      {item.categorias.nome}
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-0 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-secondary" />
                    {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                  </div>
                  <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors italic">
                    {item.titulo}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}