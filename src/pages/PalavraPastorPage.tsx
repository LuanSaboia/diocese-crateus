import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { PlayCircle, FileText, Calendar, Quote } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PalavraPastorPage() {
  const [itens, setItens] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('palavra_pastor').select('*').order('data_publicacao', { ascending: false })
      if (data) setItens(data)
    }
    load()
  }, [])

  // Função para transformar link do Youtube em Embed
  const getEmbedUrl = (url: string) => {
    const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
    return `https://www.youtube.com/embed/${id}`
  }

  return (
    <div className="bg-[#fafaf9] min-h-screen pb-20">
      {/* Header Estilo Editorial */}
      <div className="bg-primary text-white py-20 px-4 text-center space-y-4">
        <Quote className="w-12 h-12 mx-auto opacity-20" />
        <h1 className="text-5xl font-serif italic font-bold">Palavra do Pastor</h1>
        <p className="max-w-xl mx-auto text-zinc-300 font-light">
          Mensagens, vídeos e notas pastorais de Dom Ailton Menegussi para a nossa Diocese.
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-[-40px] px-4">
        <Tabs defaultValue="todos" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white shadow-xl rounded-full p-1 border h-14">
              <TabsTrigger value="todos" className="rounded-full px-8">Todos</TabsTrigger>
              <TabsTrigger value="video" className="rounded-full px-8 gap-2"><PlayCircle className="w-4 h-4"/> Vídeos</TabsTrigger>
              <TabsTrigger value="nota" className="rounded-full px-8 gap-2"><FileText className="w-4 h-4"/> Notas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="todos" className="grid grid-cols-1 md:grid-cols-2 gap-8 outline-none">
            {itens.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 group">
                {item.tipo === 'video' ? (
                  <div className="aspect-video">
                    <iframe 
                      className="w-full h-full" 
                      src={getEmbedUrl(item.url_youtube)} 
                      title={item.titulo} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-zinc-100 flex items-center justify-center p-8">
                    <FileText className="w-16 h-16 text-primary opacity-20 group-hover:scale-110 transition-transform" />
                  </div>
                )}
                
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                  </div>
                  <h3 className="text-2xl font-bold italic text-zinc-900 group-hover:text-primary transition-colors">
                    {item.titulo}
                  </h3>
                  {item.tipo === 'nota' && (
                    <div className="text-zinc-500 line-clamp-3 font-light text-sm italic" dangerouslySetInnerHTML={{__html: item.conteudo_nota}} />
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          {/* Outros TabsContent seguiriam a mesma lógica filtrada */}
        </Tabs>
      </div>
    </div>
  )
}