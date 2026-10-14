import { useNoticias } from "@/hooks/useNoticias"
import { NewsCard } from "@/components/domain/NewsCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Newspaper } from "lucide-react"

export function NoticiasPage() {
  const { 
    noticias, 
    categorias, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    selectedCategoria, 
    setSelectedCategoria 
  } = useNoticias()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#71717a] text-sm">
        Carregando mural de notícias...
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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* CABEÇALHO */}
      <div className="space-y-2 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Notícias e Comunicados
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Acompanhe os acontecimentos, notas da chancelaria e novidades da Diocese de Crateús.
        </p>
      </div>

      {/* CONTROLES DE FILTRO E BUSCA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        
        {/* Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={selectedCategoria === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategoria("todas")}
            className="text-xs font-medium"
          >
            Todas
          </Button>

          {categorias.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategoria === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategoria(cat.id)}
              className="text-xs font-medium shrink-0"
            >
              {cat.nome}
            </Button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <Input
            type="text"
            placeholder="Buscar por palavra-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* GRID DE NOTÍCIAS */}
      {noticias.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e4e4e7] dark:border-[#27272a] rounded-xl space-y-2">
          <Newspaper className="w-8 h-8 text-[#a1a1aa] mx-auto" />
          <p className="text-sm font-medium text-[#71717a]">
            Nenhuma notícia encontrada para a busca realizada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  )
}