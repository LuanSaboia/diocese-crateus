import { useLiturgia } from "@/hooks/useLiturgia"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function SantoDoDiaWidget() {
    const { dataLiturgia, loading } = useLiturgia()

    if (loading || !dataLiturgia) return null

    // Busca uma celebração que represente a memória de um Santo (diferente do Tempo Comum genérico)
    const celebracaoSanto = dataLiturgia.celebracoes.find(
        (c) => !c.id.includes("tempo-comum")
    )

    // Se o dia não tiver uma memória específica de santo (ex: apenas Tempo Comum), não exibe o card ou mostra fallback
    if (!celebracaoSanto) return null

    return (
        <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">

                {/* TOPO / BADGE */}
                <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500 text-white border-none text-[10px] font-bold uppercase tracking-wider gap-1 px-2.5 py-0.5">
                        Santo do Dia
                    </Badge>
                    <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">
                        {dataLiturgia.data}
                    </span>
                </div>

                {/* NOME DO SANTO */}
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
                        {celebracaoSanto.liturgia}
                    </h3>
                </div>

                {/* ORAÇÃO DO SANTO (COLETA) */}
                {celebracaoSanto.oracoes?.coleta && (
                    <div className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-sm border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-amber-500 text-amber-500" /> Oração do Dia
                        </span>
                        <p className="text-xs text-[#09090b] dark:text-[#fafafa] italic leading-relaxed line-clamp-3">
                            "{celebracaoSanto.oracoes.coleta}"
                        </p>
                    </div>
                )}

                {/* BOTÃO PARA A LITURGIA COMPLETA */}
                <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1.5 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-amber-950/50">
                    <Link to="/liturgia">
                        Rezar com a Liturgia do Dia <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </Button>

            </CardContent>
        </Card>
    )
}