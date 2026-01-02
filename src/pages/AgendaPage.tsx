import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { MapPin, Clock, } from "lucide-react"

export function AgendaPage() {
  const [eventos, setEventos] = useState<any[]>([])

  useEffect(() => {
    async function fetchAgenda() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .order('data_evento', { ascending: true })
      if (data) setEventos(data)
    }
    fetchAgenda()
  }, [])

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold italic text-primary">Agenda Diocesana</h1>
        <p className="text-zinc-500 mt-2">Acompanhe a caminhada da nossa igreja particular.</p>
      </div>

      <div className="space-y-8">
        {eventos.map(ev => (
          <div key={ev.id} className="group flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-50 dark:border-zinc-800 hover:shadow-xl transition-all">
            <div className="bg-primary text-white p-4 rounded-2xl text-center md:min-w-[100px] h-fit">
              <span className="block text-4xl font-black">{new Date(ev.data_evento).getDate() + 1}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{new Date(ev.data_evento).toLocaleDateString('pt-BR', { month: 'long' })}</span>
            </div>
            
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold italic group-hover:text-primary transition-colors">{ev.titulo}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400 font-bold uppercase tracking-tighter">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-secondary" /> {ev.local}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-secondary" /> {ev.hora_evento?.slice(0,5)}h</span>
              </div>
              <p className="text-zinc-500 leading-relaxed font-light">{ev.descricao}</p>
            </div>
          </div>
        ))}

        {eventos.length === 0 && (
          <div className="text-center py-20 text-zinc-400 italic">
            Não há eventos marcados para os próximos dias.
          </div>
        )}
      </div>
    </div>
  )
}