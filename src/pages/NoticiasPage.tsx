import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { NewsCard } from "@/components/NewsCard"

export function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .eq('publicado', true)
        .order('data_publicacao', { ascending: false })
      
      if (data) setNoticias(data)
      setLoading(false)
    }
    fetchNoticias()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="border-b pb-8 mb-10">
        <h1 className="text-4xl font-bold italic font-serif">A Voz da Diocese</h1>
        <p className="text-zinc-500 mt-2">Fique por dentro de tudo o que acontece em nossa igreja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {noticias.map((item) => (
          <NewsCard 
            key={item.id}
            title={item.titulo}
            excerpt={item.subtitulo}
            date={new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
            category="Diocese"
            image={item.imagem_capa_url}
            onClick={() => window.location.href = `/noticias/${item.slug}`}
          />
        ))}
      </div>
    </div>
  )
}