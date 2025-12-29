import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Newspaper, Church } from "lucide-react"
import supabase from "@/lib/supabase"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<{ noticias: any[], paroquias: any[] }>({ noticias: [], paroquias: [] })
  const navigate = useNavigate()

  // Atalho de teclado (Ctrl+K ou Cmd+K) igual ao Ruah
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

  const handleSearch = async (query: string) => {
    if (query.length < 2) return

    const { data: news } = await supabase
      .from('noticias')
      .select('titulo, slug')
      .ilike('titulo', `%${query}%`)
      .limit(5)

    const { data: parishes } = await supabase
      .from('paroquias')
      .select('nome, slug')
      .ilike('nome', `%${query}%`)
      .limit(5)

    setResults({ noticias: news || [], paroquias: parishes || [] })
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 border rounded-md hover:bg-zinc-50 transition-all w-full max-w-[200px]"
      >
        <Search className="w-4 h-4" />
        <span>Buscar...</span>
        <kbd className="ml-auto font-sans text-xs border bg-zinc-100 px-1 rounded">K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para pesquisar..." onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {results.noticias.length > 0 && (
            <CommandGroup heading="Notícias">
              {results.noticias.map((n) => (
                <CommandItem key={n.slug} onSelect={() => { navigate(`/noticias/${n.slug}`); setOpen(false); }}>
                  <Newspaper className="mr-2 h-4 w-4" /> {n.titulo}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.paroquias.length > 0 && (
            <CommandGroup heading="Paróquias">
              {results.paroquias.map((p) => (
                <CommandItem key={p.slug} onSelect={() => { navigate(`/paroquias/${p.slug}`); setOpen(false); }}>
                  <Church className="mr-2 h-4 w-4" /> {p.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}