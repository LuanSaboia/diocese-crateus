import { Link } from "react-router-dom"
import { useGaleria } from "@/hooks/useGaleria"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ArrowRight, Plus, Images } from "lucide-react"

export function GaleriaWidget() {
  const { albuns, loading } = useGaleria()

  // Exibe apenas os 2 últimos álbuns na Home
  const albunsDestaque = albuns.slice(0, 2)

  if (loading) return null

  // Se não houver nenhum álbum cadastrado ainda no Supabase, exibe um card convidativo para a área
  if (albuns.length === 0) {
    return (
      <div className="bg-[#0284c7] dark:bg-[#0369a1] text-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <h3 className="text-lg font-bold tracking-tight uppercase">
              Cobertura Fotográfica
            </h3>
          </div>
        </div>

        <div className="text-center py-6 space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Images className="w-8 h-8 text-sky-200 mx-auto" />
          <p className="text-xs text-sky-100 font-medium">
            Em breve: confira aqui as galerias de fotos dos principais eventos da nossa Diocese.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0284c7] dark:bg-[#0369a1] text-white p-6 rounded-2xl shadow-sm space-y-6">
      
      {/* CABEÇALHO DA SEÇÃO DA HOME */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-white text-[#0284c7] font-bold text-xs uppercase px-3 py-0.5 border-none">
            Fotos
          </Badge>
          <h3 className="text-lg font-bold tracking-tight uppercase">
            Galerias & Eventos
          </h3>
        </div>

        <Link
          to="/galeria"
          className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-1.5 transition-colors"
          title="Ver todas as galerias"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* GRID DE CAPAS DOS ÁLBUNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {albunsDestaque.map((item) => (
          <Link key={item.id} to={`/galeria/${item.id}`} className="group block">
            <Card className="border-none bg-black/20 hover:bg-black/30 transition-all overflow-hidden rounded-xl h-full flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                <img
                  src={item.capa_url}
                  alt={item.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] border-none gap-1">
                  <Camera className="w-3 h-3" /> {item.total_fotos || 0} fotos
                </Badge>
              </div>

              <CardHeader className="p-3">
                <CardTitle className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-200 transition-colors">
                  {item.titulo}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* LINK COMPLETO */}
      <div className="text-right pt-1">
        <Link
          to="/galeria"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase text-sky-100 hover:text-white transition-colors"
        >
          Acessar banco de fotos <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}