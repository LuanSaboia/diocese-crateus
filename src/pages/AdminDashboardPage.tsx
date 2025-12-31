import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusCircle,
  FileText,
  Church,
  Users,
  Home,
  Landmark,
  UserPlus,
  Edit,
  Trash2,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [noticias, setNoticias] = useState<any[]>([])
  const [filtro, setFiltro] = useState("")
  const [stats, setStats] = useState({
    noticias: 0,
    paroquias: 0,
    clero: 0,
    congregacoes: 0
  })

  useEffect(() => {
    async function loadData() {
      const [nStats, p, c, rg, nList] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('paroquias').select('*', { count: 'exact', head: true }),
        supabase.from('clero').select('*', { count: 'exact', head: true }),
        supabase.from('congregacoes').select('*', { count: 'exact', head: true }),
        supabase.from('noticias').select('*').order('data_publicacao', { ascending: false })
      ])

      setStats({
        noticias: nStats.count || 0,
        paroquias: p.count || 0,
        clero: c.count || 0,
        congregacoes: rg.count || 0
      })

      if (nList.data) setNoticias(nList.data)
    }
    loadData()
  }, [])

  const scrollToNoticias = () => {
    const element = document.getElementById('secao-tabela-noticias');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      const { error } = await supabase.from('noticias').delete().eq('id', id)
      if (!error) setNoticias(noticias.filter(n => n.id !== id))
    }
  }

  const noticiasFiltradas = noticias.filter(n =>
    n.titulo.toLowerCase().includes(filtro.toLowerCase())
  )

  const menuItems = [
    { 
      title: "Notícias", 
      icon: <FileText className="w-5 h-5" />, 
      count: stats.noticias, 
      path: "#secao-tabela-noticias", 
      onListClick: scrollToNoticias,
      action: () => navigate("/admin/noticias/nova"),
      color: "text-blue-600"
    },
    { 
      title: "Paróquias", 
      icon: <Church className="w-5 h-5" />, 
      count: stats.paroquias, 
      path: "/admin/paroquias", 
      action: () => navigate("/admin/paroquias/nova"),
      color: "text-orange-600"
    },
    { 
      title: "Clero", 
      icon: <Users className="w-5 h-5" />, 
      count: stats.clero, 
      path: "/admin/clero", 
      action: () => navigate("/admin/clero/novo"),
      color: "text-zinc-600"
    },
    { 
      title: "Congregações", 
      icon: <Home className="w-5 h-5" />, 
      count: stats.congregacoes, 
      path: "/admin/religiosas", 
      action: () => navigate("/admin/religiosas/nova"),
      color: "text-purple-600"
    },
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <Button variant="outline" onClick={() => navigate("/admin/institucional")} className="w-full sm:w-auto">
          <Landmark className="w-4 h-4 mr-2" /> Editar Institucional
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {menuItems.map((item) => (
          <Card key={item.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground italic">{item.title}</CardTitle>
              <div className={item.color}>{item.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold mb-4">{item.count} cadastrados</div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs md:text-sm" onClick={item.onListClick || (() => navigate(item.path))}>
                  Ver Lista
                </Button>
                <Button size="sm" variant="outline" onClick={item.action}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-50 dark:bg-zinc-900 border-dashed border-2">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Membros da Fraternidade</h3>
              <p className="text-sm text-zinc-500 italic">Cadastre as irmãs individualmente para os mini-cards.</p>
            </div>
          </div>
          <Button onClick={() => navigate("/admin/religiosas/membro/novo")} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Religiosa
          </Button>
        </CardContent>
      </Card>

      <Card id="secao-tabela-noticias" className="shadow-sm scroll-mt-20 overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
              Gerenciar Notícias
            </CardTitle>
            
            <div className="relative w-full lg:flex-1 lg:max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Pesquisar notícias por título..."
                className="pl-10 w-full bg-white dark:bg-zinc-900"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <p className="text-xs text-zinc-500 shrink-0 italic">
              Exibindo {noticiasFiltradas.length} de {noticias.length}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-sm text-left">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 md:px-6 py-4">Título</th>
                    <th className="px-4 md:px-6 py-4">Data</th>
                    <th className="px-4 md:px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {noticiasFiltradas.map((n) => (
                    <tr key={n.id} className="bg-white border-b dark:bg-zinc-950 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <th className="px-4 md:px-6 py-4 font-medium text-zinc-900 dark:text-white max-w-[200px] sm:max-w-[400px] truncate">
                        {n.titulo}
                      </th>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-zinc-500">
                        {new Date(n.data_publicacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/admin/editar/${n.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(n.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}