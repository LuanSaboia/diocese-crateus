import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Evento } from "@/types"

interface AgendaItemProps {
  evento: Evento
}

export function AgendaItem({ evento }: AgendaItemProps) {
  const dataObj = new Date(evento.data_evento)
  const dia = dataObj.getUTCDate()
  const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }).replace('.', '')
  const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

  return (
    <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm hover:border-[#2563eb] transition-all">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        {/* Bloco de Data Destacado */}
        <div className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-xl p-3 min-w-[70px] text-center shrink-0 border border-[#e4e4e7] dark:border-[#27272a]">
          <span className="block text-2xl font-bold text-[#09090b] dark:text-[#fafafa] leading-none">
            {dia}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb] mt-1 block">
            {diaSemana}
          </span>
        </div>

        {/* Detalhes do Evento */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
            {evento.titulo}
          </h3>

          {evento.descricao && (
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
              {evento.descricao}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717a] dark:text-[#a1a1aa] pt-1">
            {hora !== "00:00" && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{hora}</span>
              </div>
            )}

            {evento.local && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{evento.local}</span>
              </div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}