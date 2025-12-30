import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"

interface ParoquiaProps {
  nome: string;
  cidade: string;
  endereco: string;
  imagem: string;
  horarios_missa?: Record<string, string[]>; // Alterado para aceitar o JSON
}

export function ParoquiaCard({ nome, cidade, endereco, imagem, horarios_missa }: ParoquiaProps) {

  const renderHorarioDomingo = () => {
    if (!horarios_missa || !horarios_missa.domingo) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {horarios_missa.domingo.map((h) => (
          <span
            key={h}
            className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold border border-blue-100 dark:border-blue-800"
          >
            {h}
          </span>
        ))}
      </div>
    );
  };

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

        <div className="pt-2 mt-auto border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Missas de Domingo</span>
          </div>
          {horarios_missa?.domingo ? (
            renderHorarioDomingo()
          ) : (
            <span className="text-[10px] text-zinc-400 italic">Consulte a secretaria</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}