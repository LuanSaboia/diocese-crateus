import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Congregacao, ReligiosaMembro } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, HeartHandshake, User, MapPin, Phone } from "lucide-react"

export function CongregacaoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [congregacao, setCongregacao] = useState<Congregacao | null>(null)
  const [membros, setMembros] = useState<ReligiosaMembro[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [congRes, memRes] = await Promise.all([
          supabase.from("congregacoes").select("*").eq("id", id).single(),
          supabase.from("religiosas_membros").select("*").eq("congregacao_id", id).order("nome")
        ])

        if (congRes.error) throw congRes.error
        setCongregacao(congRes.data as Congregacao)
        setMembros((memRes.data as ReligiosaMembro[]) || [])
      } catch (err) {
        console.error("Erro ao carregar congregação:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando informações da congregação...
      </div>
    )
  }

  if (!congregacao) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <HeartHandshake className="w-12 h-12 text-[#a1a1aa] mx-auto" />
        <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Congregação não encontrada
        </h2>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/religiosas">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Vida Consagrada
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Botão Voltar */}
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/religiosas">
          <ArrowLeft className="w-4 h-4" /> Voltar para Vida Consagrada
        </Link>
      </Button>

      {/* Card da Congregação */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center border border-[#e4e4e7] dark:border-[#27272a]">
              <HeartHandshake className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa]">
                {congregacao.nome} {congregacao.sigla ? `(${congregacao.sigla})` : ""}
              </h1>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#71717a] dark:text-[#a1a1aa] pt-2">
            {congregacao.endereco && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563eb]" />
                <span>{congregacao.endereco}</span>
              </div>
            )}
            {congregacao.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563eb]" />
                <span>{congregacao.telefone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Religiosas / Irmãs Vinculadas */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#09090b] dark:text-[#fafafa]">
          Religiosas / Irmãs da Fraternidade ({membros.length})
        </h2>

        {membros.length === 0 ? (
          <p className="text-xs text-[#71717a]">Nenhuma religiosa cadastrada para esta congregação.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {membros.map((m) => (
              <Link key={m.id} to={`/religiosas/${m.id}`}>
                <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] hover:border-[#2563eb] transition-all rounded-xl overflow-hidden shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] shrink-0 border border-[#e4e4e7] dark:border-[#27272a] flex items-center justify-center">
                      {m.foto_url ? (
                        <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#a1a1aa]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa]">{m.nome}</h3>
                      <p className="text-[11px] text-[#71717a]">{m.cargo || "Membro da Congregação"}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}