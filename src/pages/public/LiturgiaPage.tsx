import { useState } from "react"
import { useLiturgia } from "@/hooks/useLiturgia"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BookOpen, Calendar, ArrowLeft, Quote } from "lucide-react"
import { Link } from "react-router-dom"
import { formatarVersiculos } from "@/lib/formatters"

export function LiturgiaPage() {
    // Estado para armazenar a data selecionada pelo usuário
    const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())
    const { dataLiturgia, celebracaoAtiva, loading, error } = useLiturgia(dataSelecionada)
    const [leituraAbaAtiva, setLeituraAbaAtiva] = useState<string>("0")

    // Formata a data para a propriedade value do <input type="date"> (AAAA-MM-DD)
    const isoDataInput = dataSelecionada.toISOString().split("T")[0]

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            // Ajusta o fuso horário local para evitar regressão de dia
            const [ano, mes, dia] = e.target.value.split("-").map(Number)
            const novaData = new Date(ano, mes - 1, dia)
            setDataSelecionada(novaData)
            setLeituraAbaAtiva("0") // Reseta para a 1ª Leitura ao trocar de data
        }
    }

    // Mapeamento de Cores Litúrgicas no Estilo Canção Nova
    const mapCor: Record<
        string,
        { text: string; buttonActive: string; badgeBg: string }
    > = {
        Branco: {
            text: "text-zinc-800 dark:text-zinc-200",
            buttonActive: "bg-zinc-700 text-white dark:bg-zinc-200 dark:text-zinc-900 font-bold shadow-sm",
            badgeBg: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200"
        },
        Verde: {
            text: "text-emerald-700 dark:text-emerald-400",
            buttonActive: "bg-emerald-700 text-white font-bold shadow-sm",
            badgeBg: "bg-emerald-600 text-white border-none"
        },
        Vermelho: {
            text: "text-red-700 dark:text-red-400",
            buttonActive: "bg-red-600 text-white font-bold shadow-sm",
            badgeBg: "bg-red-600 text-white border-none"
        },
        Roxo: {
            text: "text-purple-700 dark:text-purple-400",
            buttonActive: "bg-purple-700 text-white font-bold shadow-sm",
            badgeBg: "bg-purple-700 text-white border-none"
        },
        Rosa: {
            text: "text-pink-700 dark:text-pink-400",
            buttonActive: "bg-pink-600 text-white font-bold shadow-sm",
            badgeBg: "bg-pink-600 text-white border-none"
        }
    }

    const corStyle = celebracaoAtiva ? mapCor[celebracaoAtiva.cor] || mapCor["Verde"] : mapCor["Verde"]

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">

            {/* BOTÃO VOLTAR */}
            <Button asChild variant="ghost" size="sm" className="text-xs gap-2 text-[#71717a]">
                <Link to="/">
                    <ArrowLeft className="w-4 h-4" /> Voltar para o Portal
                </Link>
            </Button>

            {/* CABEÇALHO DA LITURGIA */}
            <header className="space-y-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-5">

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* TAG DA COR LITÚRGICA */}
                    {celebracaoAtiva && (
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-[#71717a]">
                                ■ Cor Litúrgica:
                            </span>
                            <Badge className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 ${corStyle.badgeBg}`}>
                                {celebracaoAtiva.cor}
                            </Badge>
                        </div>
                    )}

                    {/* SELETOR DE DATA INTERATIVO */}
                    <div className="flex items-center gap-2 bg-[#f4f4f5] dark:bg-[#27272a] px-3 py-1.5 rounded-xl border border-[#e4e4e7] dark:border-[#3f3f46]">
                        <Calendar className="w-4 h-4 text-[#2563eb]" />
                        <label htmlFor="data-liturgia" className="text-xs font-bold text-[#09090b] dark:text-[#fafafa] cursor-pointer">
                            {dataLiturgia ? dataLiturgia.data : "Selecione a data"}
                        </label>
                        <input
                            id="data-liturgia"
                            type="date"
                            value={isoDataInput}
                            onChange={handleDataChange}
                            className="opacity-0 absolute w-8 h-8 cursor-pointer"
                        />
                    </div>
                </div>

                {/* ESTADO DE CARREGAMENTO */}
                {loading ? (
                    <div className="py-8 text-center text-xs text-[#71717a] flex items-center justify-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#2563eb] animate-pulse" />
                        <span>Buscando liturgia da data selecionada...</span>
                    </div>
                ) : error || !celebracaoAtiva || !dataLiturgia ? (
                    <div className="py-8 text-center text-xs text-red-500">
                        Não encontramos registros litúrgicos para a data selecionada.
                    </div>
                ) : (
                    /* TÍTULO DA CELEBRAÇÃO DA MEMÓRIA DO SANTO */
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] leading-tight">
                        {celebracaoAtiva.liturgia}
                    </h1>
                )}

            </header>

            {/* CONTEÚDO DAS LEITURAS EM ABAS */}
            {!loading && celebracaoAtiva && dataLiturgia && (
                <Tabs
                    value={leituraAbaAtiva}
                    onValueChange={setLeituraAbaAtiva}
                    className="w-full space-y-6"
                >
                    {/* BOTÕES DAS ABAS */}
                    <TabsList className="w-full grid grid-cols-3 sm:grid-cols-4 bg-[#f4f4f5] dark:bg-[#27272a] p-1 rounded-xl h-auto gap-1">
                        {celebracaoAtiva.leituras.map((leitura, index) => {
                            const indexStr = index.toString()
                            const isSelected = leituraAbaAtiva === indexStr

                            return (
                                <TabsTrigger
                                    key={index}
                                    value={indexStr}
                                    className={`text-xs py-2 rounded-lg font-semibold transition-all ${isSelected ? corStyle.buttonActive : "text-[#71717a] hover:text-[#09090b]"
                                        }`}
                                >
                                    {leitura.rotulo}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {/* PAINÉIS DE CADA LEITURA */}
                    {celebracaoAtiva.leituras.map((leitura, index) => {
                        const opcao = leitura.opcoes[0]
                        if (!opcao) return null

                        const isSalmo = leitura.tipo === "salmo"
                        const isEvangelho = leitura.tipo === "evangelho"

                        return (
                            <TabsContent key={index} value={index.toString()} className="focus-visible:outline-none">
                                <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-2xl shadow-sm">
                                    <CardContent className="p-6 sm:p-8 space-y-6">

                                        {/* TÍTULO DA LEITURA E REFERÊNCIA BÍBLICA */}
                                        <div className="space-y-1 border-b border-[#f4f4f5] dark:border-[#27272a] pb-4">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${corStyle.text}`}>
                                                {leitura.rotulo} {opcao.referencia && `(${opcao.referencia})`}
                                            </span>
                                            {opcao.titulo && (
                                                <h3 className="text-base font-bold text-[#09090b] dark:text-[#fafafa] pt-1">
                                                    {opcao.titulo}
                                                </h3>
                                            )}
                                        </div>

                                        {/* REFRÃO DO SALMO */}
                                        {isSalmo && opcao.refrao && (
                                            <div className="bg-zinc-50 dark:bg-zinc-900 border-l-4 border-zinc-500 p-4 rounded-r-xl flex items-start gap-3">
                                                <Quote className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                                                <p className="text-xs font-bold text-[#09090b] dark:text-[#fafafa] italic leading-relaxed">
                                                    R. {opcao.refrao}
                                                </p>
                                            </div>
                                        )}

                                        {/* TEXTO COM VERSÍCULOS SOBREESCRITOS (EX: ¹⁴eu dobro...) */}
                                        <div className="text-[#09090b] dark:text-[#fafafa] text-base leading-relaxed whitespace-pre-line font-serif space-y-4">
                                            {formatarVersiculos(opcao.texto)}
                                        </div>

                                        {/* CONCLUSÃO */}
                                        {!isSalmo && (
                                            <div className="pt-4 border-t border-[#f4f4f5] dark:border-[#27272a] text-xs text-[#71717a] font-semibold italic whitespace-pre-line">
                                                {isEvangelho
                                                    ? "— Palavra da Salvação.\n— Glória a vós, Senhor."
                                                    : "— Palavra do Senhor.\n— Graças a Deus."}
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )
                    })}
                </Tabs>
            )}
        </div>
    )
}