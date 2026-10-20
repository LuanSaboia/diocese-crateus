import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Banner, Noticia } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight, Heart } from "lucide-react"

interface BannerSliderProps {
  tempoTrocaMs?: number
}

export function BannerSlider({ tempoTrocaMs = 5000 }: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [noticiasVinculadas, setNoticiasVinculadas] = useState<Record<string, Noticia>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data } = await supabase
          .from("banners")
          .select("*")
          .eq("ativo", true)
          .order("ordem", { ascending: true })

        if (data && data.length > 0) {
          setBanners(data as Banner[])

          // Extrai os identificadores das notícias (/noticias/slug-ou-id)
          const identificadores = data
            .map((b) => b.link_destino)
            .filter((link) => link && link.startsWith("/noticias/"))
            .map((link) => link.replace("/noticias/", ""))

          if (identificadores.length > 0) {
            // Busca notícias por slug
            const { data: nData } = await supabase
              .from("noticias")
              .select("id, titulo, subtitulo, slug, imagem_capa_url")
              .in("slug", identificadores)

            if (nData) {
              const mapNoticias: Record<string, Noticia> = {}
              nData.forEach((n: any) => {
                if (n.slug) mapNoticias[n.slug] = n
                if (n.id) mapNoticias[n.id] = n
              })
              setNoticiasVinculadas(mapNoticias)
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar banners:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, tempoTrocaMs)

    return () => clearInterval(timer)
  }, [banners.length, tempoTrocaMs])

  if (loading) return null

  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md space-y-4 text-center relative overflow-hidden h-[380px] flex flex-col justify-between">
        <div className="space-y-2 relative z-10 pt-4">
          <Badge className="bg-white/20 text-white border-none text-[10px]">
            Campanha Diocesana
          </Badge>
          <h4 className="text-xl font-bold leading-tight">
            Dízimo e Mãos Unidas pela Vocação
          </h4>
          <p className="text-xs text-blue-100 leading-relaxed">
            Ajude a manter as obras sociais, os seminaristas e a evangelização em nossa Diocese de Crateús.
          </p>
        </div>

        <Button asChild size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs gap-1.5 shadow-sm">
          <a href="https://diocesedecrateus.org.br" target="_blank" rel="noopener noreferrer">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Faça sua Contribuição <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]
  const isLinkInterno = currentBanner.link_destino.startsWith("/")

  const keyNoticia = isLinkInterno ? currentBanner.link_destino.replace("/noticias/", "") : ""
  const noticiaInfo = keyNoticia ? noticiasVinculadas[keyNoticia] : null

  // Trata string vazia ("") como inexistente para forçar a busca da capa da notícia
  const imagemBannerValida = currentBanner.imagem_url && currentBanner.imagem_url.trim() !== "" ? currentBanner.imagem_url : null
  const imagemExibicao = imagemBannerValida || noticiaInfo?.imagem_capa_url || ""

  const tituloExibicao = currentBanner.titulo || noticiaInfo?.titulo || "Destaque Diocesano"
  const subtituloExibicao = currentBanner.subtitulo || noticiaInfo?.subtitulo || ""

  return (
    <div className="relative group w-full overflow-hidden rounded-2xl shadow-md border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] h-[380px] flex flex-col">
      
      {/* EXIBIÇÃO COM FOTO */}
      {imagemExibicao ? (
        <div className="relative w-full h-[380px] overflow-hidden flex flex-col justify-end bg-zinc-950">
          <img
            src={imagemExibicao}
            alt={tituloExibicao}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative z-10 p-5 space-y-2.5">
            <Badge className="bg-blue-600 text-white border-none text-[10px] uppercase font-bold tracking-wider">
              {noticiaInfo ? "Matéria em Destaque" : "Campanha"}
            </Badge>

            <h4 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
              {tituloExibicao}
            </h4>

            {subtituloExibicao && (
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {subtituloExibicao}
              </p>
            )}

            {isLinkInterno ? (
              <Button asChild size="sm" className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-xs gap-1.5 shadow-md mt-2">
                <Link to={currentBanner.link_destino}>
                  {currentBanner.texto_botao || "Ler matéria"} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-xs gap-1.5 shadow-md mt-2">
                <a href={currentBanner.link_destino} target="_blank" rel="noopener noreferrer">
                  {currentBanner.texto_botao || "Acessar"} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* CARD GRADIENTE (Sem foto) */
        <div className={`bg-gradient-to-br ${currentBanner.cor_fundo || 'from-blue-600 to-indigo-700'} text-white p-6 space-y-4 text-center h-[380px] flex flex-col justify-between`}>
          <div className="space-y-3 pt-4">
            <Badge className="bg-white/20 text-white border-none text-[10px] uppercase font-bold tracking-wider">
              Destaque
            </Badge>

            <h4 className="text-xl font-bold leading-tight">
              {tituloExibicao}
            </h4>

            {subtituloExibicao && (
              <p className="text-xs text-blue-100 leading-relaxed line-clamp-3">
                {subtituloExibicao}
              </p>
            )}
          </div>

          {isLinkInterno ? (
            <Button asChild size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs gap-1.5">
              <Link to={currentBanner.link_destino}>
                {currentBanner.texto_botao || "Saiba mais"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs gap-1.5">
              <a href={currentBanner.link_destino} target="_blank" rel="noopener noreferrer">
                {currentBanner.texto_botao || "Acessar"} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* INDICADORES (DOTS) */}
      {banners.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1.5 z-20 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-5 bg-red-500"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
              title={`Ir para o banner ${idx + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  )
}