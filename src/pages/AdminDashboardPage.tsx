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
  Search,
  CalendarDays // Ícone para a Agenda
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
    congregacoes: 0,
    eventos: 0 // Nova estatística
  })

  useEffect(() => {
    async function loadData() {
      const [nStats, p, c, rg, nList, ev] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('paroquias').select('*', { count: 'exact', head: true }),
        supabase.from('clero').select('*', { count: 'exact', head: true }),
        supabase.from('congregacoes').select('*', { count: 'exact', head: true }),
        supabase.from('noticias').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('eventos').select('*', { count: 'exact', head: true }) // Busca contagem de eventos
      ])

      setStats({
        noticias: nStats.count || 0,
        paroquias: p.count || 0,
        clero: c.count || 0,
        congregacoes: rg.count || 0,
        eventos: ev.count || 0
      })

      if (nList.data) setNoticias(nList.data)
    }

    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      const { error } = await supabase.from('noticias').delete().eq('id', id)
      if (!error) {
        setNoticias(noticias.filter(n => n.id !== id))
      }
    }
  }

  const noticiasFiltradas = noticias.filter(n =>
    n.titulo.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic text-primary">Painel Administrativo</h1>
          <p className="text-zinc-500">Gestão de conteúdos da Diocese de Crateús.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> Ver Site
          </Button>
          <Button onClick={() => navigate('/admin/noticias/nova')} className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4" /> Nova Notícia
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Notícias", value: stats.noticias, icon: FileText, color: "text-blue-600" },
          { label: "Paróquias", value: stats.paroquias, icon: Church, color: "text-emerald-600" },
          { label: "Clero", value: stats.clero, icon: Users, color: "text-amber-600" },
          { label: "Congregações", value: stats.congregacoes, icon: Landmark, color: "text-purple-600" },
          { label: "Agenda", value: stats.eventos, icon: CalendarDays, color: "text-rose-600" }, // Novo card de stats
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações Rápidas de Gestão */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 rounded-2xl background-color:white hover:border-primary hover:text-primary transition-all"
          onClick={() => navigate('/admin/noticias')}
        >
          <FileText className="w-6 h-6" />
          <span>Gerenciar Notícias</span>
        </Button> */}

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 rounded-2xl border-rose-100 hover:border-rose-500 hover:text-rose-500 transition-all text-rose-600"
          onClick={() => navigate('/admin/agenda')}
        >
          <CalendarDays className="w-6 h-6" />
          <span>Agenda Pastoral</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 rounded-2xl hover:border-emerald-500 hover:text-emerald-500 transition-all"
          onClick={() => navigate('/admin/paroquias')}
        >
          <Church className="w-6 h-6" />
          <span>Paróquias</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 rounded-2xl hover:border-amber-500 hover:text-amber-500 transition-all"
          onClick={() => navigate('/admin/clero')}
        >
          <Users className="w-6 h-6" />
          <span>Clero</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 rounded-2xl hover:border-purple-500 hover:text-purple-500 transition-all shadow-sm"
          onClick={() => navigate('/admin/religiosas')} // Aqui volta o botão das Religiosas
        >
          <Landmark className="w-6 h-6" />
          <span className="text-xs font-bold uppercase">Religiosas</span>
        </Button>
      </div>

      {/* Lista de Notícias Recentes (Mantida conforme o original) */}
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="border-b border-zinc-50 dark:border-zinc-800 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold italic">Notícias Recentes</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Pesquisar..."
              className="pl-8"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                {noticiasFiltradas.map((n) => (
                  <tr key={n.id} className="hover:bg-zinc-50/50 transition-colors">
                    <th className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-[400px] truncate">
                      {n.titulo}
                    </th>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(n.data_publicacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/editar/${n.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50"
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
        </CardContent>
      </Card>
    </div>
  )
}