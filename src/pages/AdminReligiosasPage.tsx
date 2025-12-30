import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Home, Trash2, Edit, UserPlus } from "lucide-react"

export function AdminReligiosasPage() {
    const [lista, setLista] = useState<any[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchReligiosas()
    }, [])

    async function fetchReligiosas() {
        const { data } = await supabase.from('congregacoes').select('*').order('nome')
        if (data) setLista(data)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Remover esta congregação?")) {
            const { error } = await supabase.from('congregacoes').delete().eq('id', id)
            if (!error) setLista(lista.filter(item => item.id !== id))
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-6 px-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2"><Home /> Gestão de Congregações</h1>
                <Button onClick={() => navigate("/admin/religiosas/nova")} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-2" /> Nova Congregação
                </Button>
                <Button onClick={() => navigate("/admin/religiosas/membro/novo")} variant="outline" className="border-blue-600 text-blue-600">
                    <UserPlus className="w-4 h-4 mr-2" /> Cadastrar Irmã
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Localização</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <td className="px-6 py-4 font-bold">{item.nome}</td>
                                    <td className="px-6 py-4 text-zinc-500">{item.endereco}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => navigate(`/admin/religiosas/editar/${item.id}`)}>
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
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