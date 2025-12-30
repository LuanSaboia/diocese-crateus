import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { ChevronLeft, Quote } from "lucide-react"

export function ReligiosaPerfilPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [irma, setIrma] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('religiosas_membros').select('*, congregacoes(nome, sigla)').eq('id', id).single()
      setIrma(data)
    }
    load()
  }, [id])

  if (!irma) return null

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 mb-10 hover:text-blue-600 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar para a Fraternidade
      </button>

      <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-zinc-100 shadow-xl shrink-0">
            <img src={irma.foto_url} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2">
            <span className="text-blue-600 font-bold uppercase text-xs tracking-widest">{irma.congregacoes.nome}</span>
            <h1 className="text-4xl font-bold">{irma.nome}</h1>
            <p className="text-zinc-500 italic">{irma.cargo}</p>
          </div>
        </div>

        <div className="relative p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
          <Quote className="absolute -top-4 -left-4 w-12 h-12 text-blue-100 dark:text-zinc-800" />
          <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed">
            {irma.biografia || "Biografia em breve..."}
          </div>
        </div>
      </div>
    </div>
  )
}