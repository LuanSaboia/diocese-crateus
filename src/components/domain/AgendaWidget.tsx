import { Link } from "react-router-dom"
import { ArrowRight, MapPin, ExternalLink } from "lucide-react"
import type { Evento } from "@/types"

interface AgendaWidgetProps {
  eventos: Evento[]
}

export function AgendaWidget({ eventos }: AgendaWidgetProps) {
  return (
    <aside className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl p-6 border border-[#e4e4e7] dark:border-[#27272a] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#f4f4f5] dark:border-[#27272a]">
          <h3 className="text-xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Agenda Diocesana
          </h3>
          <Link to="/agenda" className="text-[#18181b] dark:text-[#fafafa] hover:text-[#2563eb] transition-colors" title="Ver agenda">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-4">
          {eventos.map((evento) => {
            const dataObj = new Date(evento.data_evento || (evento as any).data_inicio)
            const dia = !isNaN(dataObj.getTime()) ? dataObj.getUTCDate() : "--"
            const mes = !isNaN(dataObj.getTime()) 
              ? dataObj.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '')
              : "--"

            return (
              <div key={evento.id} className="group flex gap-3.5 items-start border-b border-[#f4f4f5] dark:border-[#27272a] pb-3.5 last:border-0">
                <div className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-lg p-2 min-w-[50px] text-center group-hover:bg-[#2563eb] group-hover:text-[#ffffff] transition-colors shrink-0">
                  <span className="block text-lg font-bold leading-none">
                    {dia}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] group-hover:text-[#ffffff]">
                    {mes}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-sm leading-snug text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors line-clamp-2">
                    {evento.titulo}
                  </h4>
                  {(evento.local || evento.local_presencial) && (
                    <div className="flex items-center gap-1 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{(evento.local_presencial || evento.local || '').split(' - ')[0]}</span>
                    </div>
                  )}

                  {evento.link_virtual && (
                    <a href={evento.link_virtual} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:underline">
                      Meet <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}

          {eventos.length === 0 && (
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs text-center py-8">
              Nenhum evento agendado nos próximos dias.
            </p>
          )}
        </div>
      </div>

      <Link 
        to="/agenda" 
        className="mt-6 w-full py-2.5 bg-[#f4f4f5] dark:bg-[#27272a] rounded-lg text-center text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-[#fafafa] hover:bg-[#2563eb] hover:text-[#ffffff] transition-all block"
      >
        Ver agenda completa
      </Link>
    </aside>
  )
}