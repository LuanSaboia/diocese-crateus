import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Clero } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Calendar, Building2 } from "lucide-react"

export function CleroDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [membro, setMembro] = useState<Clero | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMembro() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('clero')
          .select('*, paroquias(nome)')
          .eq('id', id)
          .single()

        if (error) throw error
        setMembro(data as Clero)
      } catch (err) {
        console.error("Erro ao carregar membro do clero:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) loadMembro()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#71717a]">
        Carregando informações do clero...
      </div>
    )
  }

  if (!membro) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <User className="w-12 h-12 text-[#a1a1aa] mx-auto" />
        <h2 className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Membro do Clero não encontrado
        </h2>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link to="/clero">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Clero
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Botão Voltar */}
      <Button asChild variant="ghost" size="sm" className="text-xs gap-2">
        <Link to="/clero">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Clero
        </Link>
      </Button>

      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          
          {/* Foto do Clero (Ajustado para imagem_url) */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] shrink-0 border border-[#e4e4e7] dark:border-[#27272a] mx-auto sm:mx-0">
            {membro.imagem_url ? (
              <img src={membro.imagem_url} alt={membro.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-[#a1a1aa]" />
              </div>
            )}
          </div>

          {/* Dados Principais */}
          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div>
              <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider">
                {membro.cargo || "Sacerdote"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] dark:text-[#fafafa]">
                {membro.nome}
              </h1>
            </div>

            <div className="space-y-2 text-xs text-[#71717a] dark:text-[#a1a1aa]">
              {(membro as any).paroquias?.nome && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Building2 className="w-4 h-4 text-[#2563eb]" />
                  <span>{(membro as any).paroquias.nome}</span>
                </div>
              )}

              {membro.data_ordenacao && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                  <span>
                    Ordenado em: {new Date(membro.data_ordenacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Biografia / Histórico */}
            {membro.biografia && (
              <div className="pt-4 border-t border-[#e4e4e7] dark:border-[#27272a] space-y-1.5">
                <h3 className="text-xs font-bold text-[#09090b] dark:text-[#fafafa]">
                  Biografia & Histórico Pastoral
                </h3>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line">
                  {membro.biografia}
                </p>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  )
}