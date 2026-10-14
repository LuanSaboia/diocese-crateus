import { Link } from "react-router-dom"
import { Newspaper, Building2, UserCheck, Calendar, HeartHandshake, FileText, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const ADMIN_MODULOS = [
  {
    titulo: "Notícias & Comunicados",
    descricao: "Publicar, editar e categorizar matérias da chancelaria e portal.",
    icone: Newspaper,
    href: "/admin/noticias",
    cor: "text-blue-600 dark:text-blue-400"
  },
  {
    titulo: "Paróquias e Áreas",
    descricao: "Gerenciar informações, horários e fotos das comunidades.",
    icone: Building2,
    href: "/admin/paroquias",
    cor: "text-amber-600 dark:text-amber-400"
  },
  {
    titulo: "Clero Diocesano",
    descricao: "Atualizar diretório de presbíteros, diáconos e atribuições.",
    icone: UserCheck,
    href: "/admin/clero",
    cor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    titulo: "Agenda Diocesana",
    descricao: "Cadastrar eventos, assembleias e compromissos episcopais.",
    icone: Calendar,
    href: "/admin/agenda",
    cor: "text-purple-600 dark:text-purple-400"
  },
  {
    titulo: "Vida Consagrada",
    descricao: "Gerenciar congregações, institutos e casas de formação.",
    icone: HeartHandshake,
    href: "/admin/religiosas",
    cor: "text-rose-600 dark:text-rose-400"
  },
  {
    titulo: "Área do Pastor",
    descricao: "Gerenciar informações do pastor.",
    icone: FileText,
    href: "/admin/palavra-do-pastor",
    cor: "text-indigo-600 dark:text-indigo-400"
  }
]

export function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* CABEÇALHO DO PAINEL */}
      <div className="space-y-1 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
          Painel de Gestão Diocesano
        </h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Selecione o módulo abaixo para gerenciar os conteúdos do portal da Diocese de Crateús.
        </p>
      </div>

      {/* GRID DE MÓDULOS DE GESTÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADMIN_MODULOS.map((modulo, idx) => {
          const Icone = modulo.icone

          return (
            <Link key={idx} to={modulo.href} className="group block">
              <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm hover:border-[#2563eb] hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center border border-[#e4e4e7] dark:border-[#27272a]">
                    <Icone className={`w-5 h-5 ${modulo.cor}`} />
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors">
                      {modulo.titulo}
                    </CardTitle>
                    <CardDescription className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                      {modulo.descricao}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-semibold text-[#2563eb]">
                  <span>Acessar módulo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

    </div>
  )
}