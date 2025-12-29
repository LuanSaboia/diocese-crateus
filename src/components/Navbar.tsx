import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
import { SearchCommand } from "./SearchCommand"

const paroquiasExemplo = [
  { nome: "Catedral Senhor do Bonfim", href: "/paroquias/bonfim" },
  { nome: "Paróquia Imaculada Conceição", href: "/paroquias/imaculada" },
  { nome: "Paróquia Santo Antônio", href: "/paroquias/santo-antonio" },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="font-bold text-xl tracking-tight">
          Diocese de <span className="text-blue-600">Crateús</span>
        </Link>

        <SearchCommand />

        {/* DESKTOP MENU (Hover) */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/noticias">
                  <Button variant="ghost">Notícias</Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Paróquias</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {paroquiasExemplo.map((paroquia) => (
                      <li key={paroquia.nome}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={paroquia.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 hover:text-accent-foreground focus:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <div className="text-sm font-medium leading-none">{paroquia.nome}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="mt-2 border-t pt-2 col-span-2">
                      <Link to="/paroquias" className="text-sm text-blue-600 hover:underline">Ver todas as paróquias →</Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/clero">
                  <Button variant="ghost">Clero</Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MOBILE MENU (Accordion) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader className="text-left">
                <SheetTitle className="text-blue-600">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Link to="/noticias" className="py-2 text-lg font-medium border-b">Notícias</Link>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="paroquias" className="border-b-0">
                    <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline">
                      Paróquias
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-4 border-l-2 border-blue-100">
                        {paroquiasExemplo.map((p) => (
                          <Link key={p.nome} to={p.href} className="py-2 text-zinc-600 dark:text-zinc-400">
                            {p.nome}
                          </Link>
                        ))}
                        <Link to="/paroquias" className="py-2 text-blue-600 font-semibold">Ver todas...</Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link to="/clero" className="py-2 text-lg font-medium border-b">Clero</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  )
}