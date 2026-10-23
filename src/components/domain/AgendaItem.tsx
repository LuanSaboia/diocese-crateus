import type { Evento } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Video, CalendarPlus, Download, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

interface AgendaItemProps {
  evento: Evento
}

export function AgendaItem({ evento }: AgendaItemProps) {
  // Trata e monta o objeto Date seguro combinando data_evento e hora_evento
  const dataString = evento.data_evento || (evento as any).data_inicio || ""
  const horaString = evento.hora_evento || "00:00"
  
  // Cria a data válida
  const dataISO = dataString.includes("T") 
    ? dataString 
    : `${dataString}T${horaString.length === 5 ? `${horaString}:00` : horaString}`
  
  const dataObj = new Date(dataISO)
  const isDataValida = !isNaN(dataObj.getTime())

  // Gerar Link do Google Agenda
  const gerarLinkGoogleCalendar = () => {
    if (!isDataValida) return "#"

    const start = dataObj.toISOString().replace(/-|:|\.\d\d\d/g, "")
    // Adiciona 1 hora de duração padrão para o evento
    const end = new Date(dataObj.getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "")
    const details = encodeURIComponent(evento.descricao || evento.titulo)
    const location = encodeURIComponent(evento.local_presencial || evento.local || "Diocese de Crateús")
    const text = encodeURIComponent(evento.titulo)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
  }

  // Download do arquivo .ICS para celulares
  const handleDownloadICS = () => {
    if (!isDataValida) return

    const start = dataObj.toISOString().replace(/-|:|\.\d\d\d/g, "")
    const end = new Date(dataObj.getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "")

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Diocese de Crateus//Agenda Diocesana//PT-BR",
      "BEGIN:VEVENT",
      `SUMMARY:${evento.titulo}`,
      `DESCRIPTION:${evento.descricao || ""}`,
      `LOCATION:${evento.local_presencial || evento.local || ""}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${evento.titulo.toLowerCase().replace(/\s+/g, "_")}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Exibição amigável de data e hora
  const dia = isDataValida ? dataObj.getUTCDate() : "--"
  const mes = isDataValida ? dataObj.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '') : "--"
  const horaFormatada = evento.hora_evento ? evento.hora_evento.slice(0, 5) : (isDataValida ? dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "")

  return (
    <div className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] rounded-xl p-4 shadow-sm space-y-3 transition-all hover:border-[#a1a1aa]">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f4f4f5] dark:border-[#27272a] pb-3">
        
        {/* Bloco de Data e Título no Estilo Original */}
        <div className="flex items-center gap-3.5">
          <div className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-lg p-2 min-w-[50px] text-center shrink-0">
            <span className="block text-lg font-bold leading-none text-[#09090b] dark:text-[#fafafa]">
              {dia}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a]">
              {mes}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-[#09090b] dark:text-[#fafafa]">
                {evento.titulo}
              </h3>

              {/* Badges Opcionais de Modalidade */}
              {evento.tipo_modalidade === 'virtual' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] gap-1">
                  <Video className="w-3 h-3" /> Virtual
                </Badge>
              )}
              {evento.tipo_modalidade === 'hibrido' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] gap-1">
                  <Video className="w-3 h-3" /> Híbrido
                </Badge>
              )}
            </div>

            {horaFormatada && (
              <p className="text-xs text-[#71717a]">
                Horário: {horaFormatada}h
              </p>
            )}
          </div>
        </div>

        {/* Link para Notícia se existir */}
        {evento.noticia_id && (
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1 h-7 text-[#2563eb] hover:text-[#1d4ed8]">
            <Link to={`/noticias/${evento.noticia_id}`}>
              Ver Notícia <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        )}
      </div>

      {/* Descrição e Local */}
      <div className="text-xs text-[#71717a] dark:text-[#a1a1aa] space-y-1.5">
        {evento.descricao && <p>{evento.descricao}</p>}

        {(evento.local_presencial || evento.local) && (
          <div className="flex items-center gap-1.5 text-[#71717a]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{evento.local_presencial || evento.local}</span>
          </div>
        )}
      </div>

      {/* Ações e Links */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#f4f4f5] dark:border-[#27272a]">
        {evento.link_virtual && (
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 gap-1.5">
            <a href={evento.link_virtual} target="_blank" rel="noopener noreferrer">
              <Video className="w-3.5 h-3.5" /> Entrar no Google Meet
            </a>
          </Button>
        )}

        <Button asChild variant="outline" size="sm" className="text-xs h-7 gap-1.5 border-[#e4e4e7]">
          <a href={gerarLinkGoogleCalendar()} target="_blank" rel="noopener noreferrer">
            <CalendarPlus className="w-3.5 h-3.5 text-[#2563eb]" /> Salvar no Google Agenda
          </a>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleDownloadICS} className="text-xs h-7 gap-1.5 text-[#71717a]">
          <Download className="w-3.5 h-3.5" /> Baixar (.ics)
        </Button>
      </div>
    </div>
  )
}