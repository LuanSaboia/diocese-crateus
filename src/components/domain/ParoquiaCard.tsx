import { Link } from "react-router-dom"
import { MapPin, Phone, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Paroquia } from "@/types"

interface ParoquiaCardProps {
  paroquia: Paroquia
}

// Estilos neutros para identificação visual das Áreas
const areaBadges: Record<string, string> = {
  Norte: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  Centro: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  Sul: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
}

export function ParoquiaCard({ paroquia }: ParoquiaCardProps) {
  return (
    <Link to={`/paroquias/${paroquia.slug}`} className="group block h-full">
      <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] overflow-hidden rounded-xl flex flex-col shadow-sm hover:shadow-md transition-all">
        
        {/* Imagem de Capa */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a]">
          {paroquia.imagem_url ? (
            <img 
              src={paroquia.imagem_url} 
              alt={paroquia.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a1a1aa] text-xs font-medium">
              Sem foto disponível
            </div>
          )}
          
          {paroquia.area && (
            <Badge className={`absolute top-3 right-3 text-[10px] font-semibold border ${areaBadges[paroquia.area] || "bg-[#f4f4f5] text-[#09090b]"}`}>
              Área {paroquia.area}
            </Badge>
          )}
        </div>

        <CardHeader className="p-4 pb-2 space-y-1">
          <CardTitle className="text-lg font-bold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors leading-snug">
            {paroquia.nome}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2563eb]" />
              <span className="truncate">{paroquia.cidade}</span>
            </div>

            {paroquia.telefone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0 text-[#71717a]" />
                <span>{paroquia.telefone}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#f4f4f5] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb]">
            <span>Ver detalhes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}