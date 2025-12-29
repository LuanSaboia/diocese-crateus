import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { ParoquiaCard } from "@/components/ParoquiaCard"

export function ParoquiasPage() {
  const [paroquias, setParoquias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getParoquias() {
      // Busca todas as paróquias ordenadas por nome
      const { data, error } = await supabase
        .from('paroquias')
        .select('*')
        .order('nome', { ascending: true })

      if (error) {
        console.error("Erro ao buscar paróquias:", error)
      } else {
        setParoquias(data)
      }
      setLoading(false)
    }

    getParoquias()
  }, [])

  if (loading) {
    return <div className="p-10 text-center">Carregando paróquias...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Nossas Paróquias</h1>
        <p className="text-zinc-500 mt-2">Conheça as comunidades que formam a Diocese de Crateús.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paroquias.map((p) => (
          <ParoquiaCard
            key={p.id}
            nome={p.nome}
            cidade={p.cidade}
            endereco={p.endereco}
            imagem={p.imagem_url || "https://images.unsplash.com/photo-1548625361-6243071d7d9f"}
            // Aqui pegamos o primeiro horário de domingo como exemplo
            horarioMissa={p.horarios_missa?.domingo?.[0] ? `Dom às ${p.horarios_missa.domingo[0]}` : "Consulte a secretaria"}
          />
        ))}
      </div>
      
      {paroquias.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-lg border-2 border-dashed">
          <p className="text-zinc-400">Nenhuma paróquia encontrada no banco de dados.</p>
        </div>
      )}
    </div>
  )
}