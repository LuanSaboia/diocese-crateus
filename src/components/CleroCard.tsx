import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Church } from "lucide-react"

interface CleroProps {
  nome: string
  cargo: string
  paroquiaNome?: string
  imagemUrl?: string
  dataOrdenacao?: string
}

export function CleroCard({ nome, cargo, paroquiaNome, imagemUrl, dataOrdenacao }: CleroProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="aspect-[3/4] overflow-hidden bg-zinc-100">
        <img 
          src={imagemUrl || "https://images.unsplash.com/photo-1548625361-6243071d7d9f"} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <Badge variant="secondary" className="mb-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-50">
          {cargo}
        </Badge>
        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{nome}</h3>
        
        <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          {paroquiaNome && (
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-zinc-400" />
              <span>{paroquiaNome}</span>
            </div>
          )}
          {dataOrdenacao ? (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-zinc-400" />
              <span>Ord.: {new Date(dataOrdenacao).toLocaleDateString('pt-BR')}</span>
            </div>
          ) : (
            <div className="text-xs text-zinc-400 italic">Informações em breve</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}