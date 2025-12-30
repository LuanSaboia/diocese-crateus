import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "./SearchCommand"
import supabase from "@/lib/supabase"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

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
    setIsOpen(false)
  }, [location])

  const areaCores: Record<string, string> = {
    "Norte": "text-blue-500",
    "Centro": "text-orange-500",
    "Sul": "text-green-600"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO E BUSCA */}
        <div className="flex items-center gap-8 lg:gap-12 flex-1">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m6L2KBLPVzCXW4Qn/diocese-logo-no-bk-personalizado-dOqZ2bQRjLfBZX2M.png" alt="Brasão" className="w-9 h-9 object-contain" />
            <span className="font-bold text-lg hidden lg:inline-block whitespace-nowrap">
              Diocese de <span className="text-primary">Crateús</span>
            </span>
          </Link>
          <div className="hidden md:block w-full max-w-[350px]">
            <SearchCommand />
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link to="/noticias">
            <Button variant="ghost" className="font-medium">Notícias</Button>
          </Link>

          <div className="relative group">
            <Link to="/paroquias">
              <Button variant="ghost" className="font-medium gap-1">
                Paróquias <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />
              </Button>
            </Link>
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="w-[600px] bg-white dark:bg-zinc-950 border rounded-xl shadow-xl p-6 grid grid-cols-3 gap-6">
                {Object.entries(areas).map(([nomeArea, paroquias]) => (
                  <div key={nomeArea} className="space-y-3">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${areaCores[nomeArea] || "text-zinc-500"}`}>
                      Área {nomeArea}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {paroquias.map((p) => (
                        <Link key={p.slug} to={`/paroquias/${p.slug}`} className="text-xs py-1.5 px-2 rounded-md hover:bg-zinc-100 hover:text-primary transition-all">
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
            <Button variant="ghost" className="font-medium">Clero</Button>
          </Link>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              {/* Conteúdo do Menu Mobile igual ao anterior */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}