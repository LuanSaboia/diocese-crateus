import { usePalavraPastor, type PalavraPastorItem } from "@/hooks/usePalavraPastor"
import { PlayCircle, FileText, Calendar, Quote } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export function PalavraPastorPage() {
  const { itens, loading, error, tab, setTab, getEmbedUrl } = usePalavraPastor()

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
          Mensagens, vídeos e orientações pastorais de Dom Ailton Menegussi para a nossa Diocese.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* FILTRO POR ABAS */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="todos" className="text-xs font-semibold">
                Todos
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs font-semibold gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" /> Vídeos
              </TabsTrigger>
              <TabsTrigger value="nota" className="text-xs font-semibold gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Notas
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* LISTAGEM DE CARDS */}
        {itens.length === 0 ? (
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
  const dataFormatada = new Date(item.data_publicacao).toLocaleDateString('pt-BR')

  return (
    <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm hover:border-[#2563eb] transition-all flex flex-col justify-between">
      <div>
        {item.tipo === 'video' && item.url_youtube ? (
          <div className="aspect-video w-full bg-[#000000]">
            <iframe 
              className="w-full h-full" 
              src={getEmbedUrl(item.url_youtube)} 
              title={item.titulo} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center p-6 border-b border-[#e4e4e7] dark:border-[#27272a]">
            <FileText className="w-12 h-12 text-[#2563eb] opacity-40" />
          </div>
        )}

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2563eb]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dataFormatada}</span>
          </div>

          <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
            {item.titulo}
          </h3>

          {item.tipo === 'nota' && item.conteudo_nota && (
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
              {item.conteudo_nota.replace(/<[^>]*>?/gm, '')}
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  )
}