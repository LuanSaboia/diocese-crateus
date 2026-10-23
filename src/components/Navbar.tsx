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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion"

export function Navbar() {
  const [areas, setAreas] = useState<Record<string, any[]>>({})
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [congregacoes, setCongregacoes] = useState<any[]>([])

  useEffect(() => {
    async function fetchCongregacoes() {
      const { data } = await supabase
        .from('congregacoes')
        .select('id, nome, sigla')
        .order('nome', { ascending: true })

      if (data) {
        setCongregacoes(data)
      }
    }
    fetchCongregacoes()
  }, [location])

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

        {/* LOGO E BUSCA DESKTOP */}
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
          <Link to="/liturgia">
            <Button variant="ghost" className="font-medium">Liturgia Diária</Button>
          </Link>

          <Link to="/noticias">
            <Button variant="ghost" className="font-medium">Notícias</Button>
          </Link>

          <div className="relative group">
            <Link to="/a-diocese">
              <Button variant="ghost" className="font-medium gap-1">
                A Diocese <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />
              </Button>
            </Link>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="w-56 bg-white dark:bg-zinc-950 border rounded-xl shadow-xl p-2 flex flex-col gap-1">
                <Link to="/a-diocese" className="text-sm py-2 px-3 rounded-md hover:bg-zinc-100 transition-all">Sobre a Diocese</Link>
                <Link to="/agenda" className="text-sm py-2 px-3 rounded-md hover:bg-zinc-100 transition-all">Agenda Diocesana</Link>
                <Link to="/palavra-do-pastor" className="text-sm py-2 px-3 rounded-md hover:bg-zinc-100 transition-all">Palavra do Pastor</Link>
                <Link to="/projetos" className="text-sm py-2 px-3 rounded-md hover:bg-zinc-100 transition-all">Projetos & Ações</Link>
                <Link to="/galeria" className="text-sm py-2 px-3 rounded-md hover:bg-zinc-100 transition-all">Galeria de Fotos</Link>
              </div>
            </div>
          </div>

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

          <div className="relative group">
            <Link to="/religiosas">
              <Button variant="ghost" className="font-medium gap-1">
                Congregações <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />
              </Button>
            </Link>
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
              <div className="w-[450px] bg-white dark:bg-zinc-950 border rounded-xl shadow-xl p-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                  Congregações e Fraternidades
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {congregacoes.map((c) => (
                    <Link
                      key={c.id}
                      to={`/religiosas/${c.id}`}
                      className="text-xs py-2 px-2 rounded-md hover:bg-zinc-100 hover:text-primary transition-all flex items-center gap-2"
                    >
                      <span className="bg-secondary/20 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0">
                        {c.sigla || "CONG"}
                      </span>
                      <span className="truncate">{c.nome}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/religiosas" className="text-[10px] font-bold text-zinc-400 hover:text-primary uppercase tracking-tight">
                    Ver todas as casas religiosas →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
                
                {/* CABEÇALHO DO MENU MOBILE */}
                <div className="p-4 border-b flex items-center gap-2">
                  <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m6L2KBLPVzCXW4Qn/diocese-logo-no-bk-personalizado-dOqZ2bQRjLfBZX2M.png" className="w-7 h-7 object-contain" alt="Logo" />
                  <span className="font-bold text-sm">Diocese de <span className="text-primary">Crateús</span></span>
                </div>

                {/* CORPO DO MENU COM BUSCA NO TOPO */}
                <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
                  
                  {/* CAMPO DE BUSCA COMPACTO NO TOPO */}
                  <div className="pb-2 border-b">
                    <SearchCommand />
                  </div>

                  {/* LINKS DIRETOS */}
                  <Link to="/" onClick={() => setIsOpen(false)} className="block text-base font-medium hover:text-primary transition-colors border-b pb-2 pt-1">
                    Início
                  </Link>

                  <Link to="/liturgia" onClick={() => setIsOpen(false)} className="block text-base font-medium hover:text-primary transition-colors border-b pb-2">
                    Liturgia Diária
                  </Link>

                  <Link to="/noticias" onClick={() => setIsOpen(false)} className="block text-base font-medium hover:text-primary transition-colors border-b pb-2">
                    Notícias
                  </Link>

                  {/* ACORDEÕES RECOLHÍVEIS PARA SUBMENUS */}
                  <Accordion type="single" collapsible className="w-full">

                    {/* ACORDEÃO 1: A DIOCESE */}
                    <AccordionItem value="a-diocese" className="border-b">
                      <AccordionTrigger className="text-base font-medium py-2 hover:no-underline flex w-full justify-between items-center">
                        A Diocese <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pt-2 pb-3 pl-3 border-l-2 border-primary/30 ml-1">
                          <Link to="/a-diocese" onClick={() => setIsOpen(false)} className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary py-1">Sobre a Diocese</Link>
                          <Link to="/agenda" onClick={() => setIsOpen(false)} className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary py-1">Agenda Diocesana</Link>
                          <Link to="/palavra-do-pastor" onClick={() => setIsOpen(false)} className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary py-1">Palavra do Pastor</Link>
                          <Link to="/projetos" onClick={() => setIsOpen(false)} className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary py-1">Projetos & Ações</Link>
                          <Link to="/galeria" onClick={() => setIsOpen(false)} className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary py-1">Galeria de Fotos</Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ACORDEÃO 2: PARÓQUIAS */}
                    <AccordionItem value="paroquias" className="border-b">
                      <AccordionTrigger className="text-base font-medium py-2 hover:no-underline flex w-full justify-between items-center">
                        Paróquias <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-3 pb-3">
                          <Link to="/paroquias" onClick={() => setIsOpen(false)} className="text-xs font-bold text-primary block">
                            Ver todas as paróquias →
                          </Link>
                          {Object.entries(areas).map(([nomeArea, paroquias]) => (
                            <div key={nomeArea} className="space-y-1.5">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${areaCores[nomeArea]}`}>{nomeArea}</p>
                              <div className="flex flex-col gap-1.5 pl-2 border-l-2 ml-1">
                                {paroquias.map(p => (
                                  <Link
                                    key={p.slug}
                                    to={`/paroquias/${p.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-primary truncate"
                                  >
                                    {p.nome.replace('Paróquia ', '')}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ACORDEÃO 3: RELIGIOSAS */}
                    <AccordionItem value="religiosas" className="border-b">
                      <AccordionTrigger className="text-base font-medium py-2 hover:no-underline flex w-full justify-between items-center">
                        Congregações <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-1.5 pt-2 pb-3 pl-2 border-l-2 ml-1">
                          <Link to="/religiosas" onClick={() => setIsOpen(false)} className="text-xs font-bold text-primary py-1">
                            Ver todas as congregações →
                          </Link>
                          {congregacoes.map((c) => (
                            <Link
                              key={c.id}
                              to={`/religiosas/${c.id}`}
                              onClick={() => setIsOpen(false)}
                              className="text-xs text-zinc-600 dark:text-zinc-400 py-1 truncate"
                            >
                              {c.nome}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Link to="/clero" onClick={() => setIsOpen(false)} className="block text-base font-medium hover:text-primary transition-colors border-b pb-2 pt-1">
                    Clero
                  </Link>

                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}