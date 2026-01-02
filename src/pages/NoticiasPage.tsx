import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { NewsCard } from "@/components/NewsCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [filtro, setFiltro] = useState("todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Busca Notícias e Categorias em paralelo
      const [nRes, cRes] = await Promise.all([
        supabase
          .from('noticias')
          .select('*, categorias(nome, cor, slug)')
          .eq('publicado', true)
          .order('data_publicacao', { ascending: false }),
        supabase
          .from('categorias')
          .select('*')
          .order('nome')
      ])
      
      if (nRes.data) setNoticias(nRes.data)
      if (cRes.data) setCategorias(cRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const noticiasFiltradas = filtro === "todos" 
    ? noticias 
    : noticias.filter(n => n.categorias?.slug === filtro)

  if (loading) return <div className="p-20 text-center italic text-primary">Carregando Voz da Diocese...</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold italic text-primary">A Voz da Diocese</h1>
        <p className="text-zinc-500 mt-2 font-light">Fique por dentro de tudo o que acontece em nossa igreja.</p>
      </div>

      {/* Filtro de Categorias */}
      <div className="mb-12 flex justify-center">
        <Tabs defaultValue="todos" onValueChange={setFiltro} className="w-full max-w-2xl">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 h-auto p-1 flex-wrap justify-center gap-1 border border-zinc-200 dark:border-zinc-800">
            <TabsTrigger value="todos" className="px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Todas</TabsTrigger>
            {categorias.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.slug}
                className="px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {cat.nome}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {noticiasFiltradas.length > 0 ? (
          noticiasFiltradas.map((item) => (
            <NewsCard 
              key={item.id}
              title={item.titulo}
              excerpt={item.subtitulo}
              date={new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
              category={item.categorias} // Passa o objeto completo da categoria
              image={item.imagem_capa_url}
              onClick={() => window.location.href = `/noticias/${item.slug}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-zinc-400 italic">
            Nenhuma notícia encontrada nesta categoria.
          </div>
        )}
      </div>
    </div>
  )
}