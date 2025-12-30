import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import { MapPin, Phone, Users, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReligiosaDetailPage() {
  const { id } = useParams()
  const [casa, setCasa] = useState<any>(null)
  const [membros, setMembros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: casaData } = await supabase.from('congregacoes').select('*').eq('id', id).single()
      const { data: membrosData } = await supabase.from('religiosas_membros').select('*').eq('congregacao_id', id)
      
      setCasa(casaData)
      setMembros(membrosData || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="p-20 text-center">Carregando...</div>
  if (!casa) return <div className="p-20 text-center">Casa não encontrada.</div>

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* Header com Informações da Casa */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b py-12">
        <div className="container mx-auto px-4">
          <Link to="/religiosas">
            <Button variant="ghost" size="sm" className="mb-6"><ChevronLeft className="w-4 h-4 mr-2"/> Voltar</Button>
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-lg">
              <img src={casa.imagem_url} className="w-full h-full object-cover" alt={casa.nome} />
            </div>
            <div className="flex-1 space-y-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{casa.sigla}</span>
              <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 italic">{casa.nome}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-500">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600"/> {casa.endereco}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600"/> {casa.telefone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Mini Cards das Religiosas */}
      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 italic">
          <Users className="text-blue-600" /> Religiosas da Fraternidade
        </h2>
        
        {/* Scroll Horizontal para os Mini Cards */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {membros.map((irma) => (
            <Link key={irma.id} to={`/religiosa-perfil/${irma.id}`}>
              <div className="min-w-[280px] bg-white dark:bg-zinc-900 border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                  <img src={irma.foto_url || "/placeholder-sister.png"} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{irma.cargo || "Religiosa"}</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{irma.nome}</p>
                  <p className="text-[10px] text-zinc-400">Ver biografia →</p>
                </div>
              </div>
            </Link>
          ))}
          {membros.length === 0 && <p className="text-zinc-400 italic">Nenhuma religiosa cadastrada nesta casa.</p>}
        </div>
      </div>
    </div>
  )
}