import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Church, Plus, Trash2, Edit, X, Save, Search, Clock } from "lucide-react"

export function AdminParoquiasPage() {
    const [paroquias, setParoquias] = useState<any[]>([])
    const [busca, setBusca] = useState("")
    const [editId, setEditId] = useState<string | null>(null)
    const DIAS_SEMANA = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]

    const [form, setForm] = useState({
        nome: "", cidade: "", endereco: "", area: "",
        imagem_url: "", horarios_missa: {} as any
    })

    useEffect(() => { fetchParoquias() }, [])

    async function fetchParoquias() {
        const { data } = await supabase.from('paroquias').select('*').order('nome')
        if (data) setParoquias(data)
    }

    const handleEdit = (p: any) => {
        setEditId(p.id)
        setForm({
            nome: p.nome, cidade: p.cidade, endereco: p.endereco,
            area: p.area, imagem_url: p.imagem_url, horarios_missa: p.horarios_missa || {}
        })
    }

    const resetForm = () => {
        setEditId(null)
        setForm({ nome: "", cidade: "", endereco: "", area: "", imagem_url: "", horarios_missa: {} })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const { error } = editId
            ? await supabase.from('paroquias').update(form).eq('id', editId)
            : await supabase.from('paroquias').insert([form])

        if (!error) { alert("Sucesso!"); resetForm(); fetchParoquias(); }
    }

    const paroquiasFiltradas = paroquias.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold italic text-primary flex items-center gap-2">
                    <Church /> Paróquias
                </h1>
            </div>

            {/* Grid principal ajustada */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* COLUNA DO FORMULÁRIO: Agora com "sticky" para acompanhar a rolagem */}
                <aside className={`lg:col-span-1 border rounded-3xl flex flex-col bg-zinc-50 dark:bg-zinc-900 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] ${editId ? 'border-orange-500 shadow-md' : ''}`}>
                    <div className="p-6 border-b flex justify-between items-center bg-white dark:bg-zinc-950 rounded-t-3xl shrink-0">
                        <h3 className="font-bold flex items-center gap-2">
                            {editId ? <Edit className="w-4 h-4 text-orange-600" /> : <Plus className="w-4 h-4" />}
                            {editId ? 'Editar Paróquia' : 'Nova Paróquia'}
                        </h3>
                        {editId && <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                    </div>

                    {/* ÁREA DE SCROLL DO FORMULÁRIO: Adicionado scroll interno para campos longos (como horários) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="space-y-2">
                            <Label>Nome da Paróquia</Label>
                            <Input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Cidade</Label><Input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Área</Label><Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2"><Label>URL da Imagem</Label><Input value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} /></div>

                        {/* Seção simplificada de horários para a lateral */}
                        <div className="space-y-4 pt-4 border-t">
                            <Label className="font-bold">Horários de Missa</Label>
                            {DIAS_SEMANA.map(dia => (
                                <div key={dia} className="space-y-1">
                                    <Label className="text-[10px] uppercase text-zinc-400">{dia}</Label>
                                    <Input
                                        placeholder="Ex: 08:00, 19:00"
                                        value={form.horarios_missa[dia]?.join(", ") || ""}
                                        onChange={e => setForm({
                                            ...form,
                                            horarios_missa: { ...form.horarios_missa, [dia]: e.target.value.split(",").map(h => h.trim()) }
                                        })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t bg-white dark:bg-zinc-950 rounded-b-3xl">
                        <Button onClick={handleSubmit} className={`w-full ${editId ? 'bg-orange-600' : 'bg-primary'}`}>
                            <Save className="w-4 h-4 mr-2" /> {editId ? 'Salvar Alterações' : 'Cadastrar Paróquia'}
                        </Button>
                    </div>
                </aside>

                {/* LISTAGEM À DIREITA */}
                <div className="lg:col-span-2 flex flex-col h-full space-y-4 overflow-hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <Input className="pl-10" placeholder="Pesquisar paróquia..." value={busca} onChange={e => setBusca(e.target.value)} />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {paroquiasFiltradas.map(p => (
                            <Card key={p.id} className={`border-none shadow-sm ${editId === p.id ? 'ring-2 ring-orange-500' : 'bg-white'}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Church className="w-10 h-10 text-zinc-200" />
                                        <div>
                                            <h4 className="font-bold">{p.nome}</h4>
                                            <p className="text-xs text-zinc-500 italic">{p.cidade} — {p.area}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="text-orange-600"><Edit className="w-4 h-4" /></Button>
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