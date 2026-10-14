import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Paroquia, Clero } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, Mail, Clock, Building2, User } from "lucide-react"

export function ParoquiaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [paroquia, setParoquia] = useState<Paroquia | null>(null)
  const [padres, setPadres] = useState<Clero[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadParoquiaEClero() {
      try {
        setLoading(true)

        // 1. Busca dados da Paróquia
        const { data: paroquiaData, error: pErr } = await supabase
          .from("paroquias")
          .select("*")
          .eq("slug", slug)
          .single()

        if (pErr) throw pErr
        setParoquia(paroquiaData as Paroquia)

        // 2. Busca os padres associados a esta paróquia
        if (paroquiaData?.id) {
          const { data: cleroData, error: cErr } = await supabase
            .from("clero")
            .select("*")
            .eq("paroquia_id", paroquiaData.id)
            .order("nome")

          if (!cErr && cleroData) {
            setPadres(cleroData as Clero[])
          }
        }
      } catch (err) {
        console.error("Erro ao carregar paróquia e clero:", err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadParoquiaEClero()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando dados da paróquia...
      </div>
    )
  }

  function renderHorariosMissa(horarios: any) {
    if (!horarios) return null

    if (typeof horarios === "string") {
      return <span className="whitespace-pre-line">{horarios}</span>
    }

    if (typeof horarios === "object") {
      const dicionarioDias: Record<string, string> = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado",
        domingo: "Domingo"
      }

      return (
        <div className="space-y-1.5 mt-1">
          {Object.entries(horarios).map(([dia, horas]) => {
            const diaNome = dicionarioDias[dia.toLowerCase()] || dia
            const listaHoras = Array.isArray(horas) ? horas.join(" e ") : String(horas)

            return (
              <div key={dia} className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#09090b] dark:text-[#fafafa] capitalize">
                  {diaNome}:
                </span>
                <span className="text-[#71717a] dark:text-[#a1a1aa]">
                  {listaHoras}
                </span>
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  if (!paroquia) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <Building2 className="w-12 h-12 text-[#a1a1aa] mx-auto" />
        <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Paróquia não encontrada
        </h2>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/paroquias">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Paróquias
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Botão Voltar */}
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/paroquias">
          <ArrowLeft className="w-4 h-4" /> Voltar para Paróquias
        </Link>
      </Button>

      {/* Capa */}
      {paroquia.imagem_url && (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] border border-[#e4e4e7] dark:border-[#27272a]">
          <img
            src={paroquia.imagem_url}
            alt={paroquia.nome}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Detalhes da Paróquia */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider">
              {paroquia.cidade ? `${paroquia.cidade} - CE` : "Diocese de Crateús"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] dark:text-[#fafafa]">
              {paroquia.nome}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#71717a] dark:text-[#a1a1aa]">
            {paroquia.endereco && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                <span>{paroquia.endereco}</span>
              </div>
            )}

            {paroquia.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span>{paroquia.telefone}</span>
              </div>
            )}

            {paroquia.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span>{paroquia.email}</span>
              </div>
            )}

            {paroquia.horarios_missa && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <Clock className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#09090b] dark:text-[#fafafa] block">
                    Horários das Missas:
                  </span>
                  {renderHorariosMissa(paroquia.horarios_missa)}
                </div>
              </div>
            )}
          </div>

          {/* Clero Responsável */}
          <div className="pt-6 border-t border-[#e4e4e7] dark:border-[#27272a] space-y-4">
            <h2 className="text-sm font-bold text-[#09090b] dark:text-[#fafafa]">
              Clero & Padres Responsáveis ({padres.length})
            </h2>

            {padres.length === 0 ? (
              <p className="text-xs text-[#71717a]">
                Nenhum sacerdote vinculado a esta paróquia no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {padres.map((padre) => (
                  <Link key={padre.id} to={`/clero/${padre.id}`}>
                    <div className="p-3 border border-[#e4e4e7] dark:border-[#27272a] rounded-lg bg-[#f4f4f5]/50 dark:bg-[#27272a]/50 hover:border-[#2563eb] transition-all flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e4e4e7] shrink-0 flex items-center justify-center">
                        {padre.imagem_url ? (
                          <img src={padre.imagem_url} alt={padre.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-[#a1a1aa]" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-semibold text-[#2563eb] uppercase block truncate">
                          {padre.cargo || "Sacerdote"}
                        </span>
                        <h3 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa] truncate">
                          {padre.nome}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}