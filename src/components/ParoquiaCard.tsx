import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"

interface ParoquiaProps {
  nome: string;
  cidade: string;
  endereco: string;
  imagem: string;
  horarioMissa: string;
}

export function ParoquiaCard({ nome, cidade, endereco, imagem, horarioMissa }: ParoquiaProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800">
      <div className="aspect-[16/9] overflow-hidden">
        <img src={imagem} alt={nome} className="w-full h-full object-cover transition-transform hover:scale-105" />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-1 text-blue-600 text-xs font-bold uppercase mb-1">
          <MapPin className="w-3 h-3" /> {cidade}
        </div>
        <h3 className="text-xl font-bold leading-tight">{nome}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-sm text-zinc-500 line-clamp-2">{endereco}</p>
        
        <div className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-md text-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Próxima Missa: {horarioMissa}</span>
        </div>
      </CardContent>
    </Card>
  )
}