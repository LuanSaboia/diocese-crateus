import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Users, Trash2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AdminCleroPage() {
    const [membros, setMembros] = useState<any[]>([])
    const navigate = useNavigate()
    const [termo, setTermo] = useState("");

    const cleroFiltrado = membros.filter(m =>
        m.nome.toLowerCase().includes(termo.toLowerCase()) ||
        m.cargo.toLowerCase().includes(termo.toLowerCase())
    );

    useEffect(() => {
        fetchClero()
    }, [])

    async function fetchClero() {
        const { data } = await supabase.from('clero').select('*').order('nome')
        if (data) setMembros(data)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Remover este membro do clero?")) {
            const { error } = await supabase.from('clero').delete().eq('id', id)
            if (!error) setMembros(membros.filter(m => m.id !== id))
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2"><Users /> Gestão do Clero</h1>
                <Button onClick={() => navigate("/admin/clero/novo")} className="bg-green-700">
                    <PlusCircle className="w-4 h-4 mr-2" /> Novo Membro
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                    placeholder="Buscar padre ou cargo..."
                    className="max-w-md mb-6"
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                />
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Cargo/Função</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cleroFiltrado.map((m) => (
                                <tr key={m.id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <td className="px-6 py-4 font-bold">{m.nome}</td>
                                    <td className="px-6 py-4 text-zinc-500">{m.cargo}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => navigate(`/admin/clero/editar/${m.id}`)}>
                                            <Edit className="w-4 h-4 text-green-600" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(m.id)}>
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