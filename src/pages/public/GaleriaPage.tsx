import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useGaleria, useAlbumDetail } from "@/hooks/useGaleria"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, ArrowLeft, Images, X } from "lucide-react"

export function GaleriaPage() {
  const { albumId } = useParams()

  if (albumId) {
    return <AlbumDetailPage albumId={albumId} />
  }

  return <GaleriaListPage />
}

function GaleriaListPage() {
  const { albuns, loading } = useGaleria()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando galerias de fotos...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* CABEÇALHO */}
      <div className="border-b border-[#e4e4e7] dark:border-[#27272a] pb-6 space-y-2">
        {/* <div className="flex items-center gap-2 text-[#2563eb]">
          <Camera className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Cobertura Pastoral</span>
        </div> */}
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Galerias de Fotos
        </h1>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
          Acompanhe os registros fotográficos das celebrações, festas de padroeiros e momentos marcantes da Diocese de Crateús.
        </p>
      </div>

      {albuns.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-2xl space-y-3">
          <Images className="w-10 h-10 text-[#a1a1aa] mx-auto" />
          <p className="text-xs font-medium text-[#71717a]">
            Nenhum álbum de fotos publicado no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albuns.map((item) => (
            <Link key={item.id} to={`/galeria/${item.id}`} className="group block">
              <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                  <img
                    src={item.capa_url}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] border-none gap-1">
                    <Camera className="w-3 h-3" /> {item.total_fotos || 0} fotos
                  </Badge>
                </div>

                <CardHeader className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#71717a]">
                    <Calendar className="w-3 h-3 text-[#2563eb]" />
                    <span>{new Date(item.data_evento).toLocaleDateString("pt-BR")}</span>
                  </div>

                  <CardTitle className="text-sm font-bold text-[#09090b] dark:text-[#fafafa] leading-snug line-clamp-2 group-hover:text-[#2563eb] transition-colors">
                    {item.titulo}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}

function AlbumDetailPage({ albumId }: { albumId: string }) {
  const { album, fotos, loading } = useAlbumDetail(albumId)
  const [fotoExpandida, setFotoExpandida] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando fotos do álbum...
      </div>
    )
  }

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <p className="text-xs text-[#71717a]">Álbum não encontrado.</p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/galeria"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar para as Galerias</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2 text-[#71717a]">
        <Link to="/galeria">
          <ArrowLeft className="w-4 h-4" /> Voltar para Galerias
        </Link>
      </Button>

      <div className="border-b border-[#e4e4e7] dark:border-[#27272a] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>{new Date(album.data_evento).toLocaleDateString("pt-BR")}</span>
          <span>•</span>
          <span>{fotos.length} fotos salvas</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          {album.titulo}
        </h1>

        {album.descricao && (
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed max-w-3xl">
            {album.descricao}
          </p>
        )}
      </div>

      {/* GRID DE FOTOS DO ÁLBUM */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {fotos.map((foto) => (
          <div
            key={foto.id}
            onClick={() => setFotoExpandida(foto.imagem_url)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 cursor-pointer border border-[#e4e4e7] dark:border-[#27272a]"
          >
            <img
              src={foto.imagem_url}
              alt={foto.legenda || album.titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL LIGHTBOX / EXPANSÃO DE FOTO */}
      {fotoExpandida && (
        <div
          onClick={() => setFotoExpandida(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setFotoExpandida(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fotoExpandida}
            alt="Foto expandida"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  )
}