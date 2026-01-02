import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, X, UserPlus, Save, Search } from "lucide-react"
import { RichTextEditor } from "@/components/RichTextEditor"

export function AdminCleroPage() {
    const [membros, setMembros] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [termo, setTermo] = useState("")
    const [editId, setEditId] = useState<string | null>(null)
    
    const [form, setForm] = useState({
        nome: "", cargo: "", data_ordenacao: "", imagem_url: "", biografia: ""
    })

    useEffect(() => {
        fetchClero()
    }, [])

    async function fetchClero() {
        const { data } = await supabase.from('clero').select('*').order('nome')
        if (data) setMembros(data)
        setLoading(false)
    }

    const handleEdit = (membro: any) => {
        setEditId(membro.id)
        setForm({
            nome: membro.nome,
            cargo: membro.cargo,
            data_ordenacao: membro.data_ordenacao || "",
            imagem_url: membro.imagem_url || "",
            biografia: membro.biografia || ""
        })
        // Removemos o scroll para o topo para manter o contexto, 
        // já que o formulário agora está sempre visível.
    }

    const resetForm = () => {
        setEditId(null)
        setForm({ nome: "", cargo: "", data_ordenacao: "", imagem_url: "", biografia: "" })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (editId) {
            const { error } = await supabase.from('clero').update(form).eq('id', editId)
            if (!error) { alert("Membro atualizado!"); resetForm(); fetchClero(); }
        } else {
            const { error } = await supabase.from('clero').insert([form])
            if (!error) { alert("Membro cadastrado!"); resetForm(); fetchClero(); }
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Remover este membro do clero?")) {
            await supabase.from('clero').delete().eq('id', id)
            fetchClero()
        }
    }

    const cleroFiltrado = membros.filter(m =>
        m.nome.toLowerCase().includes(termo.toLowerCase()) ||
        m.cargo.toLowerCase().includes(termo.toLowerCase())
    )

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <h1 className="text-3xl font-bold italic text-primary mb-6">Gestão do Clero</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* COLUNA DO FORMULÁRIO: FIXA COM SCROLL INTERNO */}
                <aside className={`lg:col-span-1 border rounded-3xl flex flex-col bg-zinc-50 dark:bg-zinc-900 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] shadow-sm transition-all ${editId ? 'border-amber-500 shadow-md' : ''}`}>
                    
                    {/* Cabeçalho do Form (Fixo) */}
                    <div className="p-6 border-b flex justify-between items-center bg-white dark:bg-zinc-950 rounded-t-3xl shrink-0">
                        <h3 className="font-bold flex items-center gap-2">
                            {editId ? <Edit className="w-4 h-4 text-amber-600" /> : <UserPlus className="w-4 h-4" />}
                            {editId ? 'Editar Membro' : 'Novo Membro'}
                        </h3>
                        {editId && (
                            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    
                    {/* Corpo do Form (Scrollável) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="space-y-2">
                            <Label>Nome Completo</Label>
                            <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                            <Label>Cargo / Função</Label>
                            <Input required value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} placeholder="Ex: Pároco, Vigário, Diácono" />
                        </div>

                        <div className="space-y-2">
                            <Label>URL da Foto</Label>
                            <Input value={form.imagem_url} onChange={e => setForm({...form, imagem_url: e.target.value})} placeholder="https://..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Biografia</Label>
                            {/* O editor de texto rico costuma ser alto, o scroll interno aqui é essencial */}
                            <RichTextEditor content={form.biografia} onChange={html => setForm({...form, biografia: html})} />
                        </div>
                    </div>

                    {/* Rodapé do Form (Fixo) */}
                    <div className="p-6 border-t bg-white dark:bg-zinc-950 rounded-b-3xl shrink-0">
                        <Button onClick={handleSubmit} className={`w-full ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/90'}`}>
                            <Save className="w-4 h-4 mr-2" /> {editId ? 'Salvar Alterações' : 'Cadastrar Membro'}
                        </Button>
                    </div>
                </aside>

                {/* COLUNA DA LISTAGEM (Scroll natural da página) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <Input className="pl-10" placeholder="Buscar no clero..." value={termo} onChange={e => setTermo(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {cleroFiltrado.map(m => (
                            <Card key={m.id} className={`overflow-hidden border-none shadow-sm transition-all ${editId === m.id ? 'ring-2 ring-amber-500' : 'bg-white hover:shadow-md'}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={m.imagem_url || "/src/assets/brasoes/default.svg"} 
                                            className="w-12 h-12 rounded-full object-cover bg-zinc-100 border" 
                                            alt={m.nome}
                                        />
                                        <div>
                                            <h4 className="font-bold text-zinc-900">{m.nome}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{m.cargo}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(m)} className="text-blue-600 hover:bg-blue-50">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        {cleroFiltrado.length === 0 && (
                            <div className="text-center py-20 text-zinc-400 italic bg-zinc-50 rounded-3xl border border-dashed">
                                Nenhum membro encontrado com este nome.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}