import { Link } from "react-router-dom"
import { useHomeData } from "@/hooks/useHomeData"
import { AgendaWidget } from "@/components/domain/AgendaWidget"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"

export function HomePage() {
  const { principal, secundarias, eventos, loading, error } = useHomeData()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando portal...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 text-center text-red-600 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 sm:px-6">
      
      {/* SEÇÃO DE DESTAQUE: MANCHETE + AGENDA LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Lado Esquerdo: Manchete Principal */}
        <div className="lg:col-span-2">
          {principal && (
            <Link to={`/noticias/${principal.slug}`} className="group block h-full">
              <div className="relative overflow-hidden rounded-2xl bg-[#09090b] h-full min-h-[380px] shadow-sm border border-[#e4e4e7] dark:border-[#27272a]">
                <img 
                  src={principal.imagem_url! || principal.imagem_capa_url!} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" 
                  alt={principal.titulo} 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/30 to-transparent" />
                
                <div className="absolute bottom-0 p-6 sm:p-8 space-y-3">
                  {principal.categorias && (
                    <Badge className={`${principal.categorias.cor || 'bg-[#2563eb]'} border-none text-[#ffffff] px-3 py-0.5 text-xs font-semibold`}>
                      {principal.categorias.nome}
                    </Badge>
                  )}
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ffffff] leading-tight group-hover:text-blue-300 transition-colors">
                    {principal.titulo}
                  </h2>

                  <div className="flex items-center gap-2 text-[#a1a1aa] text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Lado Direito: Agenda Vertical */}
        <AgendaWidget eventos={eventos} />
      </div>

      {/* SEÇÃO: ÚLTIMAS NOTÍCIAS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
          <h3 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa] tracking-tight">
            Últimas Notícias
          </h3>
          
          <Link 
            to="/noticias" 
            className="text-[#2563eb] hover:underline flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
          >
            Arquivo completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secundarias.map((item) => (
            <Link key={item.id} to={`/noticias/${item.slug}`} className="group">
              <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] overflow-hidden rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow">
                
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a]">
                  <img 
                    src={item.imagem_url! || item.imagem_capa_url!} 
                    className="group-hover:scale-105 transition-transform duration-500 object-cover w-full h-full" 
                    alt={item.titulo}
                  />
                  {item.categorias && (
                    <Badge className={`absolute top-3 left-3 border-none text-[10px] ${item.categorias.cor || 'bg-[#2563eb]'}`}>
                      {item.categorias.nome}
                    </Badge>
                  )}
                </div>

                <CardHeader className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <CardTitle className="text-base font-bold leading-snug text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors line-clamp-2">
                      {item.titulo}
                    </CardTitle>
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