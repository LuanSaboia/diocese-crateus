import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { CleroCard } from "@/components/CleroCard"

export function CleroPage() {
  const [membros, setMembros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClero() {
      
      const { data, error } = await supabase
        .from('clero')
        .select(`
          *,
          paroquias (
            nome
          )
        `)
        .order('ordem_exibicao', { ascending: true })

      if (error) console.error("Erro:", error)
      else setMembros(data)
      setLoading(false)
    }

    fetchClero()
  }, [])

  if (loading) return <div className="p-10 text-center text-zinc-500">Carregando clero...</div>

  return (
    <div className="container mx-auto py-10 space-y-10">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Nosso Clero</h1>
        <p className="text-zinc-500 mt-3 text-lg">
          Conheça os bispos, padres e diáconos que servem ao povo de Deus na Diocese de Crateús.
        </p>
      </header>

      {/* SEÇÃO DO BISPO */}
      <section className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800/30">
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Bispo Diocesano</h2>
        {membros.filter(m => m.cargo === 'Bispo Diocesano').map(bispo => (
          <div key={bispo.id} className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-64 shrink-0 rounded-2xl overflow-hidden shadow-xl">
              <img src={bispo.imagem_url} className="w-full h-full object-cover" alt={bispo.nome} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">{bispo.nome}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {bispo.biografia || "Terceiro bispo da Diocese de Crateús, nomeado pelo Papa Francisco."}
              </p>
              <div className="text-sm text-blue-600 font-semibold">
                Ordenação Episcopal: {
                  bispo.data_ordenacao
                    ? new Date(bispo.data_ordenacao + 'T00:00:00').toLocaleDateString('pt-BR')
                    : "Data não informada"
                }
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* RESTANTE DO CLERO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {membros.filter(m => m.cargo !== 'Bispo Diocesano').map((membro) => (
          <CleroCard
            key={membro.id}
            id={membro.id} 
            nome={membro.nome}
            cargo={membro.cargo}
            imagemUrl={membro.imagem_url}
            paroquiaNome={membro.paroquias?.nome}
            dataOrdenacao={membro.data_ordenacao}
          />
        ))}
      </section>
    </div>
  )
}