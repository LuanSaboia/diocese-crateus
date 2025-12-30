import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Church, Trash2, Edit } from "lucide-react"

export function AdminParoquiasPage() {
  const [paroquias, setParoquias] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchParoquias()
  }, [])

  async function fetchParoquias() {
    const { data } = await supabase.from('paroquias').select('*').order('nome')
    if (data) setParoquias(data)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta paróquia? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase.from('paroquias').delete().eq('id', id)
      if (!error) setParoquias(paroquias.filter(p => p.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Church /> Gestão de Paróquias</h1>
        <Button onClick={() => navigate("/admin/paroquias/nova")} className="bg-orange-600 hover:bg-orange-700">
          <PlusCircle className="w-4 h-4 mr-2" /> Nova Paróquia
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Cidade</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paroquias.map((p) => (
                <tr key={p.id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-bold">{p.nome}</td>
                  <td className="px-6 py-4 text-zinc-500">{p.cidade}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 rounded-full bg-zinc-100 text-[10px] font-bold uppercase">{p.area}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigate(`/admin/paroquias/editar/${p.id}`)}>
                      <Edit className="w-4 h-4 text-orange-600" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}