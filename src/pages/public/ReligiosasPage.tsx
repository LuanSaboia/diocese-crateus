import { Link } from "react-router-dom"
import { useReligiosas, type Congregacao } from "@/hooks/useReligiosas"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, HeartHandshake, MapPin, Phone, Building2, ChevronRight } from "lucide-react"

export function ReligiosasPage() {
  const { congregacoes, loading, error, searchQuery, setSearchQuery } = useReligiosas()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando congregações e institutos religiosos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-red-600 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="space-y-2 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Vida Consagrada & Congregações
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Conheça os institutos religiosos, congregações e comunidades presentes na Diocese de Crateús.
        </p>
      </div>

      {/* CONTROLE DE BUSCA */}
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">
          {congregacoes.length} {congregacoes.length === 1 ? "Congregação registrada" : "Congregações registradas"}
        </p>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <Input
            type="text"
            placeholder="Buscar por nome, sigla ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* LISTAGEM EM GRID */}
      {congregacoes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
          <HeartHandshake className="w-8 h-8 text-[#a1a1aa] mx-auto" />
          <p className="text-sm font-medium text-[#71717a]">
            Nenhuma congregação encontrada para a busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {congregacoes.map((item) => (
            <Link key={item.id} to={`/congregacoes/${item.id}`} className="block h-full">
              <CongregacaoCard congregacao={item} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CongregacaoCard({ congregacao }: { congregacao: Congregacao }) {
  return (
    <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm hover:border-[#2563eb] transition-all flex flex-col justify-between group">
      <CardHeader className="p-5 pb-3 space-y-2 border-b border-[#f4f4f5] dark:border-[#27272a]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa] leading-snug group-hover:text-[#2563eb] transition-colors">
              {congregacao.nome}
            </CardTitle>
            {congregacao.cidade && (
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2563eb]" /> {congregacao.cidade} - CE
              </p>
            )}
          </div>

          {congregacao.sigla && (
            <Badge variant="outline" className="text-xs font-bold border-[#e4e4e7] shrink-0">
              {congregacao.sigla}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4 text-xs text-[#71717a] dark:text-[#a1a1aa] flex-1 flex flex-col justify-between">
        {congregacao.carisma ? (
          <div className="space-y-1">
            <span className="font-semibold text-[#09090b] dark:text-[#fafafa] uppercase text-[10px] tracking-wider block">
              Carisma & Missão
            </span>
            <p className="leading-relaxed line-clamp-3">
              {congregacao.carisma}
            </p>
          </div>
        ) : (
          <p className="text-xs italic text-[#a1a1aa]">Clique para ver mais informações e irmãs da fraternidade.</p>
        )}

        <div className="pt-3 border-t border-[#f4f4f5] dark:border-[#27272a] flex items-center justify-between text-[11px]">
          <div className="space-y-1">
            {congregacao.endereco && (
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                <span className="truncate max-w-[220px]">{congregacao.endereco}</span>
              </p>
            )}
            {congregacao.telefone && (
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                <span>{congregacao.telefone}</span>
              </p>
            )}
          </div>

          <span className="text-[#2563eb] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}