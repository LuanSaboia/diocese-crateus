import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { type Paroquia } from "@/types"

interface ParoquiaInfoCardProps {
  paroquia: Paroquia & { horarios_missas?: any; horarios_confissoes?: any }
}

export function ParoquiaInfoCard({ paroquia }: ParoquiaInfoCardProps) {
  // Trata campo do banco (horarios_missa) e legado (horarios_missas)
  const horarios = paroquia.horarios_missa || paroquia.horarios_missas

  function renderHorarios(data: any) {
    if (!data) return "Consulte a secretaria paroquial para os horários de missa."
    if (typeof data === "string") return data
    if (typeof data === "object") {
      return Object.entries(data)
        .map(([dia, horas]) => `${dia}: ${Array.isArray(horas) ? horas.join(", ") : horas}`)
        .join("\n")
    }
    return String(data)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Contato e Localização */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
        <CardHeader className="pb-3 border-b border-[#f4f4f5] dark:border-[#27272a]">
          <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
          {paroquia.endereco && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#09090b] dark:text-[#fafafa]">Endereço</p>
                <p>{paroquia.endereco} - {paroquia.cidade}</p>
              </div>
            </div>
          )}

          {paroquia.telefone && (
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#09090b] dark:text-[#fafafa]">Telefone / WhatsApp</p>
                <p>{paroquia.telefone}</p>
              </div>
            </div>
          )}

          {paroquia.email && (
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#09090b] dark:text-[#fafafa]">E-mail</p>
                <p>{paroquia.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Horários */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
        <CardHeader className="pb-3 border-b border-[#f4f4f5] dark:border-[#27272a]">
          <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">
            Horários das Celebrações & Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#09090b] dark:text-[#fafafa]">Missas</p>
              <p className="whitespace-pre-line">{renderHorarios(horarios)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#09090b] dark:text-[#fafafa]">Confissões & Atendimento</p>
              <p className="whitespace-pre-line">{paroquia.horarios_confissoes || "Segunda a Sexta-feira em horário comercial."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}