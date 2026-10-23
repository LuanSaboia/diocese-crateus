import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, FileText, Church, Users, Loader2 } from "lucide-react"
import supabase from "@/lib/supabase"

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    noticias: any[],
    paroquias: any[],
    clero: any[]
  }>({ noticias: [], paroquias: [], clero: [] })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ noticias: [], paroquias: [], clero: [] })
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const [n, p, c] = await Promise.all([
          supabase.from('noticias').select('id, titulo, slug').ilike('titulo', `%${query}%`).limit(5),
          supabase.from('paroquias').select('id, nome, slug').ilike('nome', `%${query}%`).limit(5),
          supabase.from('clero').select('id, nome').ilike('nome', `%${query}%`).limit(5)
        ])

        setResults({
          noticias: n.data || [],
          paroquias: p.data || [],
          clero: c.data || []
        })
      } catch (error) {
        console.error("Erro na busca:", error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  const onSelect = (path: string) => {
    setOpen(false)
    setQuery("")
    navigate(path)
  }

  const hasResults =
    results.noticias.length > 0 ||
    results.paroquias.length > 0 ||
    results.clero.length > 0

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center gap-2 rounded-full border bg-zinc-50 px-4 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Pesquisar na Diocese...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          {/* Aqui colocamos shouldFilter={false} diretamente no Command */}
          <Command shouldFilter={false} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput 
              placeholder="Digite para buscar notícias, paróquias ou padres..." 
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              {loading && (
                <div className="p-4 flex justify-center items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
                </div>
              )}
              
              {!loading && query.trim().length >= 2 && !hasResults && (
                <CommandEmpty>Nenhum resultado para "{query}".</CommandEmpty>
              )}

              {/* Resultados de Notícias */}
              {!loading && results.noticias.length > 0 && (
                <CommandGroup heading="Notícias">
                  {results.noticias.map((n) => (
                    <CommandItem
                      key={n.id}
                      value={`noticia-${n.id}`}
                      onSelect={() => onSelect(`/noticias/${n.slug}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{n.titulo}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Resultados de Paróquias */}
              {!loading && results.paroquias.length > 0 && (
                <CommandGroup heading="Paróquias">
                  {results.paroquias.map((p) => (
                    <CommandItem
                      key={p.id}
                      value={`paroquia-${p.id}`}
                      onSelect={() => onSelect(`/paroquias/${p.slug}`)}
                    >
                      <Church className="mr-2 h-4 w-4" />
                      <span>{p.nome}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Resultados do Clero */}
              {!loading && results.clero.length > 0 && (
                <CommandGroup heading="Clero">
                  {results.clero.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={`clero-${c.id}`}
                      onSelect={() => onSelect(`/clero/${c.id}`)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>{c.nome}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}