import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Plus, Trash2, Edit, X, Save, Search, UserPlus } from "lucide-react"

export function AdminReligiosaPage() {
    const [membros, setMembros] = useState<any[]>([])
    const [congregacoes, setCongregacoes] = useState<any[]>([])
    const [busca, setBusca] = useState("")
    const [editId, setEditId] = useState<string | null>(null)
    
    const [form, setForm] = useState({
        nome: "", cargo: "", congregacao_id: "", foto_url: "", biografia: ""
    })

    useEffect(() => { loadData() }, [])

    async function loadData() {
        const [mRes, cRes] = await Promise.all([
            supabase.from('religiosas_membros').select('*, congregacoes(nome)').order('nome'),
            supabase.from('congregacoes').select('id, nome').order('nome')
        ])
        if (mRes.data) setMembros(mRes.data)
        if (cRes.data) setCongregacoes(cRes.data)
    }

    const handleEdit = (m: any) => {
        setEditId(m.id)
        setForm({
            nome: m.nome,
            cargo: m.cargo || "",
            congregacao_id: m.congregacao_id,
            foto_url: m.foto_url || "",
            biografia: m.biografia || ""
        })
    }

    const resetForm = () => {
        setEditId(null)
        setForm({ nome: "", cargo: "", congregacao_id: "", foto_url: "", biografia: "" })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.congregacao_id) return alert("Selecione uma congregação!")

        const { error } = editId 
            ? await supabase.from('religiosas_membros').update(form).eq('id', editId)
            : await supabase.from('religiosas_membros').insert([form])
        
        if (!error) { resetForm(); loadData(); }
    }

    const membrosFiltrados = membros.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()))

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <h1 className="text-3xl font-bold italic text-primary flex items-center gap-2 mb-6">
                Religiosas (Membros)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* FORMULÁRIO LATERAL FIXO */}
                <aside className={`lg:col-span-1 border rounded-3xl flex flex-col bg-zinc-50 dark:bg-zinc-900 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] shadow-sm ${editId ? 'border-rose-500 shadow-md' : ''}`}>
                    <div className="p-6 border-b flex justify-between items-center bg-white dark:bg-zinc-950 rounded-t-3xl shrink-0">
                        <h3 className="font-bold flex items-center gap-2">
                            {editId ? <Edit className="w-4 h-4 text-rose-600" /> : <UserPlus className="w-4 h-4" />}
                            {editId ? 'Editar Irmã' : 'Cadastrar Irmã'}
                        </h3>
                        {editId && <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                        <div className="space-y-2">
                            <Label>Nome da Religiosa</Label>
                            <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Ir. Maria José" />
                        </div>

                        <div className="space-y-2">
                            <Label>Congregação</Label>
                            <Select value={form.congregacao_id} onValueChange={(v) => setForm({...form, congregacao_id: v})}>
                                <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione a casa..." /></SelectTrigger>
                                <SelectContent>
                                    {congregacoes.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Cargo/Função</Label>
                            <Input value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} placeholder="Ex: Superiora, Vice, etc" />
                        </div>

                        <div className="space-y-2">
                            <Label>URL da Foto</Label>
                            <Input value={form.foto_url} onChange={e => setForm({...form, foto_url: e.target.value})} />
                        </div>
                    </div>

                    <div className="p-6 border-t bg-white dark:bg-zinc-950 rounded-b-3xl shrink-0">
                        <Button onClick={handleSubmit} className={`w-full ${editId ? 'bg-rose-600' : 'bg-primary'}`}>
                            <Save className="w-4 h-4 mr-2" /> {editId ? 'Atualizar Dados' : 'Salvar Cadastro'}
                        </Button>
                    </div>
                </aside>

                {/* LISTAGEM À DIREITA */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <Input className="pl-10" placeholder="Buscar irmã pelo nome..." value={busca} onChange={e => setBusca(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {membrosFiltrados.map(m => (
                            <Card key={m.id} className={`border-none shadow-sm transition-all ${editId === m.id ? 'ring-2 ring-rose-500' : 'bg-white hover:shadow-md'}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={m.foto_url || "/src/assets/brasoes/default.svg"} className="w-12 h-12 rounded-full object-cover border bg-zinc-50" />
                                        <div>
                                            <h4 className="font-bold text-zinc-900">{m.nome}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                                                {m.congregacoes?.nome} {m.cargo && `• ${m.cargo}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(m)} className="text-blue-600"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}