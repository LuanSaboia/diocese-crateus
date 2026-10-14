import { Link } from "react-router-dom"
import { User, Building2, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Clero } from "@/types"

interface CleroPerfilCardProps {
  membro: Clero & { paroquia?: any; paroquias?: any }
}

export function CleroPerfilCard({ membro }: CleroPerfilCardProps) {
  const foto = membro.imagem_url || membro.foto_url
  const paroquiaInfo = membro.paroquia || membro.paroquias

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      
      {/* Coluna da Foto */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <div className="aspect-[4/5] bg-[#f4f4f5] dark:bg-[#27272a] relative overflow-hidden">
          {foto ? (
            <img 
              src={foto} 
              alt={membro.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a1a1aa]">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>
      </Card>

      {/* Coluna de Informações e Biografia */}
      <div className="md:col-span-2 space-y-6">
        <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
          <CardHeader className="pb-3 border-b border-[#f4f4f5] dark:border-[#27272a]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-xl font-bold text-[#09090b] dark:text-[#fafafa]">
                Informações Sacerdotais
              </CardTitle>
              {membro.cargo && (
                <Badge className="bg-[#09090b] text-[#ffffff] dark:bg-[#fafafa] dark:text-[#09090b] text-xs font-semibold">
                  {membro.cargo}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4 text-xs text-[#71717a] dark:text-[#a1a1aa]">
            {paroquiaInfo && (
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#09090b] dark:text-[#fafafa]">Paróquia de Atuação</p>
                  <Link 
                    to={`/paroquias/${paroquiaInfo.slug}`}
                    className="text-[#2563eb] hover:underline font-medium"
                  >
                    {paroquiaInfo.nome}
                  </Link>
                  {paroquiaInfo.cidade && (
                    <p className="text-[11px] text-[#71717a]">{paroquiaInfo.cidade} - CE</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#09090b] dark:text-[#fafafa]">Igreja Particular</p>
                <p>Diocese de Crateús</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biografia */}
        <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
          <CardHeader className="pb-3 border-b border-[#f4f4f5] dark:border-[#27272a]">
            <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">
              Biografia & Trajetória
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
            {membro.biografia ? (
              <p className="whitespace-pre-line">{membro.biografia}</p>
            ) : (
              <p className="italic">Nenhuma biografia cadastrada até o momento.</p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}