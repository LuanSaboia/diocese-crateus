import { usePalavraPastor, type PalavraPastorItem } from "@/hooks/usePalavraPastor"
import { PlayCircle, FileText, Calendar, Quote, Volume2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PalavraPastorPage() {
  const { itens, destaque, loading, error, tab, setTab, getEmbedUrl } = usePalavraPastor()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando mensagens pastorais...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center text-red-600 text-xs">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16 space-y-8">
      
      {/* CABEÇALHO */}
      <div className="border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] py-12 px-4 text-center space-y-3">
        <Quote className="w-10 h-10 mx-auto text-[#2563eb] opacity-30" />
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Palavra do Pastor
        </h1>
        <p className="max-w-lg mx-auto text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          Mensagens, vídeos, áudios e orientações pastorais de Dom Ailton Menegussi para a nossa Diocese.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* FILTRO POR ABAS (TODOS, VÍDEOS, ÁUDIOS, NOTAS) */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-lg bg-[#f4f4f5] dark:bg-[#27272a] p-1 rounded-xl">
              <TabsTrigger value="todos" className="text-xs font-semibold">
                Todos
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs font-semibold gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" /> Vídeos
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-xs font-semibold gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Áudios
              </TabsTrigger>
              <TabsTrigger value="nota" className="text-xs font-semibold gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Notas
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* MENSAGEM DE DESTAQUE (ÚLTIMO COMUNICADO DO BISPO) */}
        {destaque && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-[#fafafa]">
                Última Orientação Pastoral
              </span>
            </div>

            <Card className="border-2 border-[#2563eb]/20 bg-[#ffffff] dark:bg-[#18181b] rounded-2xl overflow-hidden shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
                
                {/* Mídia em Destaque */}
                <div className="md:col-span-7 bg-[#09090b]">
                  {destaque.tipo === "video" && destaque.url_youtube ? (
                    <div className="aspect-video w-full">
                      <iframe
                        className="w-full h-full"
                        src={getEmbedUrl(destaque.url_youtube)}
                        title={destaque.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : destaque.tipo === "audio" && destaque.url_audio ? (
                    <div className="p-8 aspect-video flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-4">
                      <Volume2 className="w-12 h-12 text-blue-400 animate-pulse" />
                      <p className="text-xs font-semibold text-blue-200 text-center">Áudio Pastoral</p>
                      <audio controls className="w-full max-w-md">
                        <source src={destaque.url_audio} type="audio/mpeg" />
                        Seu navegador não suporta áudio HTML5.
                      </audio>
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center p-8">
                      <FileText className="w-16 h-16 text-[#2563eb] opacity-40" />
                    </div>
                  )}
                </div>

                {/* Conteúdo em Destaque */}
                <div className="md:col-span-5 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#2563eb] text-white border-none text-[10px]">
                      {destaque.tipo === "video" ? "Vídeo" : destaque.tipo === "audio" ? "Áudio" : "Nota Oficial"}
                    </Badge>
                    <span className="text-xs text-[#71717a] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(destaque.data_publicacao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
                    {destaque.titulo}
                  </h2>

                  {destaque.conteudo_nota && (
                    <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed line-clamp-4">
                      {destaque.conteudo_nota.replace(/<[^>]*>?/gm, "")}
                    </p>
                  )}
                </div>

              </div>
            </Card>
          </section>
        )}

        {/* LISTAGEM DOS DEMAIS CARDS */}
        {itens.length === 0 && !destaque ? (
          <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
            <FileText className="w-8 h-8 text-[#a1a1aa] mx-auto" />
            <p className="text-xs font-medium text-[#71717a]">
              Nenhuma publicação encontrada para esta categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itens.map((item) => (
              <PalavraPastorCard key={item.id} item={item} getEmbedUrl={getEmbedUrl} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function PalavraPastorCard({
  item,
  getEmbedUrl
}: {
  item: PalavraPastorItem
  getEmbedUrl: (url?: string | null) => string
}) {
  const dataFormatada = new Date(item.data_publicacao).toLocaleDateString("pt-BR")

  return (
    <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm hover:border-[#2563eb] transition-all flex flex-col justify-between">
      <div>
        {item.tipo === "video" && item.url_youtube ? (
          <div className="aspect-video w-full bg-[#000000]">
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(item.url_youtube)}
              title={item.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : item.tipo === "audio" && item.url_audio ? (
          <div className="p-6 bg-slate-900 text-white flex flex-col items-center justify-center space-y-3 aspect-video">
            <Volume2 className="w-8 h-8 text-blue-400" />
            <audio controls className="w-full">
              <source src={item.url_audio} type="audio/mpeg" />
            </audio>
          </div>
        ) : (
          <div className="aspect-video bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center p-6 border-b border-[#e4e4e7] dark:border-[#27272a]">
            <FileText className="w-12 h-12 text-[#2563eb] opacity-40" />
          </div>
        )}

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-[#2563eb]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dataFormatada}</span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#71717a]">
              {item.tipo}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
            {item.titulo}
          </h3>

          {item.tipo === "nota" && item.conteudo_nota && (
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
              {item.conteudo_nota.replace(/<[^>]*>?/gm, "")}
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  )
}