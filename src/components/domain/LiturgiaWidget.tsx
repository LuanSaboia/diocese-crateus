import { useLiturgia } from "@/hooks/useLiturgia"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"

export function LiturgiaWidget() {
  const { dataLiturgia, celebracaoAtiva, setCelebracaoAtiva, loading, error } = useLiturgia()

  if (loading) {
    return (
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 text-center text-xs text-[#71717a]">
        Carregando liturgia do dia...
      </Card>
    )
  }

  if (error || !celebracaoAtiva || !dataLiturgia) {
    return (
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 text-center text-xs text-red-500">
        Não foi possível carregar a liturgia diária.
      </Card>
    )
  }

  // Mapeamento de cores litúrgicas para o Tailwind
  const mapCor: Record<string, { bg: string; text: string; border: string }> = {
    Verde: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600" },
    Branco: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500" },
    Vermelho: { bg: "bg-red-600", text: "text-red-600", border: "border-red-600" },
    Roxo: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-600" },
    Rosa: { bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500" },
  }

  const corStyle = mapCor[celebracaoAtiva.cor] || { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600" }

  // Resgata o Evangelho da celebração ativa
  const itemEvangelho = celebracaoAtiva.leituras.find((l) => l.tipo === "evangelho")
  const opcaoEvangelho = itemEvangelho?.opcoes[0]

  return (
    <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#18181b] rounded-2xl shadow-sm overflow-hidden space-y-4">
      
      {/* CABEÇALHO */}
      <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#f4f4f5] dark:border-[#27272a]">
        <div className="flex items-center gap-2">
          <BookOpen className={`w-4 h-4 ${corStyle.text}`} />
          <CardTitle className="text-sm font-bold text-[#09090b] dark:text-[#fafafa]">
            Liturgia Diária • {dataLiturgia.data}
          </CardTitle>
        </div>

        <Badge variant="outline" className={`text-[10px] font-bold uppercase ${corStyle.text} ${corStyle.border}`}>
          {celebracaoAtiva.cor}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        
        {/* SELETOR DE MEMÓRIAS / CELEBRAÇÕES (Ex: São João Paulo II) */}
        {dataLiturgia.celebracoes.length > 1 && (
          <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-[#e4e4e7] dark:border-[#27272a]">
            <p className="text-[11px] font-semibold text-[#71717a] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Memórias & Celebrações do dia:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dataLiturgia.celebracoes.map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={c.id === celebracaoAtiva.id ? "default" : "outline"}
                  onClick={() => setCelebracaoAtiva(c)}
                  className={`text-[11px] h-7 px-2.5 rounded-lg font-medium transition-all ${
                    c.id === celebracaoAtiva.id ? "bg-[#2563eb] text-white" : "text-[#71717a]"
                  }`}
                >
                  {c.liturgia} {c.principal && "(Principal)"}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* TÍTULO DA CELEBRAÇÃO ATIVA */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa]">
            {celebracaoAtiva.liturgia}
          </h3>
        </div>

        {/* EVANGELHO DO DIA */}
        {opcaoEvangelho && (
          <div className="space-y-2 border-l-2 border-[#2563eb] pl-3 py-1">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#2563eb] tracking-wider">
                Evangelho ({opcaoEvangelho.referencia})
              </span>
              <h4 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa] leading-snug">
                {opcaoEvangelho.titulo}
              </h4>
            </div>

            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] italic line-clamp-4 leading-relaxed">
              "{opcaoEvangelho.texto}"
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}