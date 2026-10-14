import { useAgenda } from "@/hooks/useAgenda"
import { AgendaItem } from "@/components/domain/AgendaItem"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, CalendarX } from "lucide-react"

export function AgendaPage() {
  const { 
    eventos, 
    eventosPorMes, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    filterPeriodo, 
    setFilterPeriodo 
  } = useAgenda()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando agenda diocesana...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center text-red-600 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* CABEÇALHO */}
      <div className="space-y-2 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Agenda Diocesana
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Confira as próximas celebrações, assembleias, encontros e compromissos da Diocese.
        </p>
      </div>

      {/* CONTROLES E FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        
        {/* Toggle Próximos vs Todos */}
        <div className="flex items-center gap-1.5">
          <Button
            variant={filterPeriodo === "proximos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPeriodo("proximos")}
            className="text-xs font-medium"
          >
            Próximos Eventos
          </Button>
          <Button
            variant={filterPeriodo === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPeriodo("todos")}
            className="text-xs font-medium"
          >
            Todos os Eventos
          </Button>
        </div>

        {/* Campo de Pesquisa */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <Input
            type="text"
            placeholder="Buscar evento ou local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* LISTA DE EVENTOS AGRUPADOS POR MÊS */}
      {eventos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
          <CalendarX className="w-8 h-8 text-[#a1a1aa] mx-auto" />
          <p className="text-sm font-medium text-[#71717a]">
            Nenhum evento agendado para os critérios selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(eventosPorMes).map(([mesAno, items]) => (
            <section key={mesAno} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-[#fafafa] bg-[#f4f4f5] dark:bg-[#27272a] px-3 py-1 rounded-md">
                  {mesAno}
                </h2>
                <div className="h-px bg-[#e4e4e7] dark:bg-[#27272a] flex-1" />
              </div>

              <div className="space-y-3">
                {items.map((evento) => (
                  <AgendaItem key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  )
}