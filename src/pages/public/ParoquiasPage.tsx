import { useParoquias } from "@/hooks/useParoquias"
import { ParoquiaCard } from "@/components/domain/ParoquiaCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building2 } from "lucide-react"

export function ParoquiasPage() {
  const { 
    paroquiasPorArea, 
    paroquias,
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    selectedArea, 
    setSelectedArea 
  } = useParoquias()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando paróquias e áreas pastorais...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 text-center text-red-600 text-sm">
        {error}
      </div>
    )
  }

  const areasDisponiveis = ["todas", "Norte", "Centro", "Sul"]

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="space-y-2 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Paróquias e Áreas Pastorais
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Encontre informações, localizações e horários das comunidades da Diocese de Crateús.
        </p>
      </div>

      {/* CONTROLES DE FILTRO E BUSCA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        
        {/* Filtros por Área */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {areasDisponiveis.map((area) => (
            <Button
              key={area}
              variant={selectedArea === area ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedArea(area)}
              className="capitalize text-xs font-medium"
            >
              {area === "todas" ? "Todas as Áreas" : `Área ${area}`}
            </Button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <Input
            type="text"
            placeholder="Buscar por nome ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* LISTAGEM DE PARÓQUIAS AGRUPADAS OU BUSCADAS */}
      {paroquias.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
          <Building2 className="w-8 h-8 text-[#a1a1aa] mx-auto" />
          <p className="text-sm font-medium text-[#71717a]">
            Nenhuma paróquia encontrada para os critérios informados.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(paroquiasPorArea).map(([nomeArea, items]) => (
            <section key={nomeArea} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#09090b] dark:text-[#fafafa] uppercase tracking-wider text-xs bg-[#f4f4f5] dark:bg-[#27272a] px-3 py-1 rounded-md">
                  Área Pastoral {nomeArea}
                </h2>
                <div className="h-px bg-[#e4e4e7] dark:bg-[#27272a] flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((paroquia) => (
                  <ParoquiaCard key={paroquia.id} paroquia={paroquia} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  )
}