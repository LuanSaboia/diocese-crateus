import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Trash2, Edit } from "lucide-react"

export function AdminDashboardPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('data_publicacao', { ascending: false })
      
      if (data) setNoticias(data)
      setLoading(false)
    }
    fetchNoticias()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      const { error } = await supabase.from('noticias').delete().eq('id', id)
      if (!error) setNoticias(noticias.filter(n => n.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Link to="/admin/publicar">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="w-4 h-4" /> Nova Notícia
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <FileText className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noticias.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Conteúdo</CardTitle>
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
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600">
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