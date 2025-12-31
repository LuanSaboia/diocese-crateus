import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Search, FileText, Church, Users, Loader2 } from "lucide-react"
import supabase from "@/lib/supabase" //

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

  // Lógica de busca
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ noticias: [], paroquias: [], clero: [] })
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        // Busca em paralelo nas 3 tabelas
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

      <CommandDialog open={open} onOpenChange={setOpen}>
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
          
          {!loading && query.length >= 2 && (
            <CommandEmpty>Nenhum resultado para "{query}".</CommandEmpty>
          )}

          {/* Resultados de Notícias */}
          {results.noticias.length > 0 && (
            <CommandGroup heading="Notícias">
              {results.noticias.map((n) => (
                <CommandItem key={n.id} onSelect={() => onSelect(`/noticias/${n.slug}`)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{n.titulo}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Resultados de Paróquias */}
          {results.paroquias.length > 0 && (
            <CommandGroup heading="Paróquias">
              {results.paroquias.map((p) => (
                <CommandItem key={p.id} onSelect={() => onSelect(`/paroquias/${p.slug}`)}>
                  <Church className="mr-2 h-4 w-4" />
                  <span>{p.nome}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Resultados do Clero */}
          {results.clero.length > 0 && (
            <CommandGroup heading="Clero">
              {results.clero.map((c) => (
                <CommandItem key={c.id} onSelect={() => onSelect(`/clero/${c.id}`)}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>{c.nome}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}