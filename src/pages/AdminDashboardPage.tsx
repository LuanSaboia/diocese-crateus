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
  Trash2, 
  Edit,
  ArrowRight
} from "lucide-react"

export function AdminDashboardPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [counts, setCounts] = useState({ noticias: 0, paroquias: 0, clero: 0 })
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      const { error } = await supabase.from('noticias').delete().eq('id', id)
      if (!error) setNoticias(noticias.filter(n => n.id !== id))
    }
  }

  useEffect(() => {
    async function fetchStats() {
      // Busca contagens para os cards do topo
      const [n, p, c] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('paroquias').select('*', { count: 'exact', head: true }),
        supabase.from('clero').select('*', { count: 'exact', head: true })
      ])
      
      setCounts({
        noticias: n.count || 0,
        paroquias: p.count || 0,
        clero: c.count || 0
      })

      // Busca as notícias recentes para a tabela inicial
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('data_publicacao', { ascending: false })
      
      if (data) setNoticias(data)
    }
    fetchStats()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>

      {/* HUB DE NAVEGAÇÃO (Fica sempre no topo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => navigate("/admin/dashboard")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase text-zinc-500">Notícias</CardTitle>
            <FileText className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.noticias}</div>
            <p className="text-xs text-zinc-400 mt-1">Gerenciar publicações e blog</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full justify-between group-hover:bg-blue-50">
              Acessar <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-500 transition-colors cursor-pointer group" onClick={() => navigate("/admin/paroquias")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase text-zinc-500">Paróquias</CardTitle>
            <Church className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.paroquias}</div>
            <p className="text-xs text-zinc-400 mt-1">Horários, fotos e endereços</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full justify-between group-hover:bg-orange-50">
              Acessar <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-green-500 transition-colors cursor-pointer group" onClick={() => navigate("/admin/clero")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase text-zinc-500">Clero</CardTitle>
            <Users className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.clero}</div>
            <p className="text-xs text-zinc-400 mt-1">Padres, Diáconos e Bispo</p>
            <Button variant="ghost" size="sm" className="mt-4 w-full justify-between group-hover:bg-green-50">
              Acessar <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* TABELA DE CONTEÚDO (Exemplo Notícias) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Notícias</CardTitle>
          <Button onClick={() => navigate("/admin/publicar")} size="sm" className="bg-blue-600">
            <PlusCircle className="w-4 h-4 mr-2" /> Nova Notícia
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
              <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {noticias.map((n) => (
                  <tr key={n.id} className="bg-white border-b dark:bg-zinc-950 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <th className="px-6 py-4 font-medium text-zinc-900 dark:text-white truncate max-w-[300px]">
                      {n.titulo}
                    </th>
                    <td className="px-6 py-4">
                      {new Date(n.data_publicacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600"
                        onClick={() => navigate(`/admin/editar/${n.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(n.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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