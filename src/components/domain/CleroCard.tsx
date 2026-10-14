import { Link } from "react-router-dom"
import { User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { type Clero } from "@/types"

interface CleroCardProps {
  membro: Clero
}

export function CleroCard({ membro }: CleroCardProps) {
  const foto = membro.imagem_url || membro.foto_url

  return (
    <Link to={`/clero/${membro.id}`} className="group block h-full">
      <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] overflow-hidden rounded-xl flex flex-col shadow-sm hover:shadow-md transition-all">
        
        {/* Retrato do Sacerdote */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a]">
          {foto ? (
            <img 
              src={foto} 
              alt={membro.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a1a1aa]">
              <User className="w-12 h-12" />
            </div>
          )}
          
          {membro.cargo && (
            <Badge className="absolute top-3 right-3 text-[10px] font-semibold bg-[#09090b] text-[#ffffff] dark:bg-[#fafafa] dark:text-[#09090b] border-none">
              {membro.cargo}
            </Badge>
          )}
        </div>

        <CardHeader className="p-4 pb-2 space-y-1">
          <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors leading-snug">
            {membro.nome}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] line-clamp-2">
            {membro.biografia || "Sacerdote da Diocese de Crateús."}
          </p>

          <div className="pt-3 border-t border-[#f4f4f5] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb]">
            <span>Ver perfil</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}