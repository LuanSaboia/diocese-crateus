import { useClero } from "@/hooks/useClero"
import { CleroCard } from "@/components/domain/CleroCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserCheck } from "lucide-react"

export function CleroPage() {
  const { 
    clero, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    selectedCargo, 
    setSelectedCargo 
  } = useClero()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando diretório do clero...
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

  const cargosFiltro = ["todos", "Pároco", "Vigário", "Diácono"]

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* CABEÇALHO */}
      <div className="space-y-2 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Clero Diocesano
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Conheça os presbíteros e diáconos a serviço da Igreja Particular de Crateús.
        </p>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        
        {/* Botões de Filtro por Cargo */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {cargosFiltro.map((cargo) => (
            <Button
              key={cargo}
              variant={selectedCargo === cargo ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCargo(cargo)}
              className="capitalize text-xs font-medium"
            >
              {cargo === "todos" ? "Todos os Clérigos" : cargo}
            </Button>
          ))}
        </div>

        {/* Campo de Busca por Nome */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* GRID DE CLÉRIGOS */}
      {clero.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
          <UserCheck className="w-8 h-8 text-[#a1a1aa] mx-auto" />
          <p className="text-sm font-medium text-[#71717a]">
            Nenhum membro do clero encontrado para a busca realizada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clero.map((membro) => (
            <CleroCard key={membro.id} membro={membro} />
          ))}
        </div>
      )}

    </div>
  )
}