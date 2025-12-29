import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "./SearchCommand"
import supabase from "@/lib/supabase"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [areas, setAreas] = useState<Record<string, any[]>>({})
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    async function fetchParoquias() {
      const { data } = await supabase
        .from('paroquias')
        .select('nome, cidade, area, slug')
        .order('nome', { ascending: true })

      if (data) {
        const grouped = data.reduce((acc, curr) => {
          const area = curr.area || "Outros"
          if (!acc[area]) acc[area] = []
          acc[area].push(curr)
          return acc
        }, {} as Record<string, any[]>)
        setAreas(grouped)
      }
    }
    fetchParoquias()
    setIsOpen(false) // Fecha o menu mobile ao mudar de página
  }, [location])

  const areaCores: Record<string, string> = {
    "Norte": "text-blue-500",
    "Centro": "text-orange-500",
    "Sul": "text-green-600"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/brasao.png" alt="Brasão" className="w-9 h-9 object-contain" />
            <span className="font-bold text-base lg:text-lg tracking-tight">
              Diocese de <span className="text-primary">Crateús</span>
            </span>
          </Link>
          <div className="hidden md:block w-full max-w-[200px] lg:max-w-[300px]">
            <SearchCommand />
          </div>
        </div>

        {/* DESKTOP NAV (Laptops e Monitores) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-4">
          <Link to="/noticias">
            <Button variant="ghost" className="text-sm font-medium">Notícias</Button>
          </Link>

          {/* Menu de Paróquias com Dropdown mais estável */}
          <div className="relative group">
  <Link to="/paroquias">
    <Button 
      variant="ghost" 
      className="text-sm font-medium gap-1 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"
    >
      Paróquias <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />
    </Button>
  </Link>

  {/* O "Menu" agora é uma div controlada pelo hover do grupo pai */}
  <div className="absolute right-0 top-full pt-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
    <div className="w-[600px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-6 grid grid-cols-3 gap-6">
      {Object.entries(areas).map(([nomeArea, paroquias]) => (
        <div key={nomeArea} className="space-y-3">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${areaCores[nomeArea] || "text-zinc-500"}`}>
            Área {nomeArea}
          </h4>
          <div className="flex flex-col gap-1">
            {paroquias.map((p) => (
              <Link 
                key={p.slug} 
                to={`/paroquias/${p.slug}`}
                className="text-xs py-1.5 px-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary transition-all line-clamp-1"
              >
                {p.nome.replace('Paróquia ', '')}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          <Link to="/clero">
            <Button variant="ghost" className="text-sm font-medium">Clero</Button>
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] pr-0">
              <SheetHeader className="px-6 text-left">
                <SheetTitle className="text-primary flex items-center gap-2">
                   Menu Diocese
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8 h-[calc(100vh-150px)] overflow-y-auto px-6">
                <Link to="/noticias" className="text-xl font-semibold py-2 border-b">Notícias</Link>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="paroquias" className="border-b">
                    <AccordionTrigger className="text-xl font-semibold py-4 hover:no-underline">
                      Paróquias
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-8 py-2">
                        {Object.entries(areas).map(([nomeArea, paroquias]) => (
                          <div key={nomeArea} className="space-y-3">
                            <p className={`text-xs font-black uppercase tracking-widest ${areaCores[nomeArea]}`}>
                              {nomeArea}
                            </p>
                            <div className="grid grid-cols-1 gap-3 pl-2">
                              {paroquias.map(p => (
                                <Link 
                                  key={p.slug} 
                                  to={`/paroquias/${p.slug}`} 
                                  className="text-base text-zinc-600 dark:text-zinc-400 active:text-primary"
                                >
                                  {p.nome}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link to="/clero" className="text-xl font-semibold py-4 border-b">Clero</Link>
                
                <div className="mt-4 pr-6">
                   <SearchCommand />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}