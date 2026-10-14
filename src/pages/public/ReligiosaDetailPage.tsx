import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { ReligiosaMembro } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, HeartHandshake } from "lucide-react"

export function ReligiosaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [religiosa, setReligiosa] = useState<ReligiosaMembro | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReligiosa() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("religiosas_membros")
          .select("*, congregacoes(id, nome, sigla)")
          .eq("id", id)
          .single()

        if (error) throw error
        setReligiosa(data as ReligiosaMembro)
      } catch (err) {
        console.error("Erro ao carregar dados da religiosa:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) loadReligiosa()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando dados da religiosa...
      </div>
    )
  }

  if (!religiosa) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <User className="w-12 h-12 text-[#a1a1aa] mx-auto" />
        <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Religiosa não encontrada
        </h2>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/religiosas">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Vida Consagrada
          </Link>
        </Button>
      </div>
    )
  }

  const congregacaoInfo = (religiosa as any).congregacoes

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Botão Voltar */}
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/religiosas">
          <ArrowLeft className="w-4 h-4" /> Voltar para Vida Consagrada
        </Link>
      </Button>

      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Foto da Religiosa */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] shrink-0 border border-[#e4e4e7] dark:border-[#27272a] mx-auto sm:mx-0 flex items-center justify-center">
            {religiosa.foto_url ? (
              <img src={religiosa.foto_url} alt={religiosa.nome} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-[#a1a1aa]" />
            )}
          </div>

          {/* Dados Principais */}
          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div>
              <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider block">
                {religiosa.cargo || "Religiosa / Consagrada"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] dark:text-[#fafafa]">
                {religiosa.nome}
              </h1>
            </div>

            {congregacaoInfo?.nome && (
              <div className="pt-2">
                <Link
                  to={`/congregacoes/${congregacaoInfo.id}`}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#2563eb] hover:underline bg-[#2563eb]/10 px-3 py-1.5 rounded-md"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {congregacaoInfo.nome} {congregacaoInfo.sigla ? `(${congregacaoInfo.sigla})` : ""}
                  </span>
                </Link>
              </div>
            )}

            {/* Biografia / Histórico */}
            {religiosa.biografia && (
              <div className="pt-4 border-t border-[#e4e4e7] dark:border-[#27272a] space-y-1.5">
                <h3 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa]">
                  Biografia & Trajetória
                </h3>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line">
                  {religiosa.biografia}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}