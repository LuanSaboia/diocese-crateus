import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Landmark, Plus, Trash2, Edit, X, Save, Search } from "lucide-react"

export function AdminCongregacaoPage() {
  const [lista, setLista] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: "", sigla: "", endereco: "", telefone: "", membros: "", imagem_url: "" })

  useEffect(() => { fetchCongregacao() }, [])

  async function fetchCongregacao() {
    const { data } = await supabase.from('congregacoes').select('*').order('nome')
    if (data) setLista(data)
  }

  const handleEdit = (item: any) => {
    setEditId(item.id)
    setForm({ ...item })
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ nome: "", sigla: "", endereco: "", telefone: "", membros: "", imagem_url: "" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editId 
      ? await supabase.from('congregacoes').update(form).eq('id', editId)
      : await supabase.from('congregacoes').insert([form])
    
    if (!error) { resetForm(); fetchCongregacao(); }
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold italic text-primary mb-6 flex items-center gap-2"><Landmark /> Congregações</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* FORMULÁRIO STICKY */}
        <aside className={`lg:col-span-1 border rounded-3xl flex flex-col bg-zinc-50 dark:bg-zinc-900 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] ${editId ? 'border-purple-500 shadow-md' : ''}`}>
          <div className="p-6 border-b flex justify-between items-center bg-white dark:bg-zinc-950 rounded-t-3xl shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              {editId ? <Edit className="w-4 h-4 text-purple-600" /> : <Plus className="w-4 h-4" />} Gestão de Casa
            </h3>
            {editId && <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-1"><Label>Nome</Label><Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
            <div className="space-y-1"><Label>Sigla</Label><Input value={form.sigla} onChange={e => setForm({...form, sigla: e.target.value})} /></div>
            <div className="space-y-1"><Label>Endereço</Label><Input value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} /></div>
            <div className="space-y-1"><Label>Membros (Resumo)</Label><Input value={form.membros} onChange={e => setForm({...form, membros: e.target.value})} /></div>
            <div className="space-y-1"><Label>URL da Imagem</Label><Input value={form.imagem_url} onChange={e => setForm({...form, imagem_url: e.target.value})} /></div>
          </div>

          <div className="p-6 border-t bg-white dark:bg-zinc-950 rounded-b-3xl shrink-0">
            <Button onClick={handleSubmit} className={`w-full ${editId ? 'bg-purple-600' : 'bg-primary'}`}>
              <Save className="w-4 h-4 mr-2" /> Salvar Congregação
            </Button>
          </div>
        </aside>

        {/* LISTAGEM */}
        <div className="lg:col-span-2 space-y-4">
          {lista.map(item => (
            <Card key={item.id} className={`border-none shadow-sm ${editId === item.id ? 'ring-2 ring-purple-500' : 'bg-white'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Landmark className="w-6 h-6 text-zinc-300" />
                  <div>
                    <h4 className="font-bold">{item.nome}</h4>
                    <p className="text-xs text-zinc-500 italic">{item.sigla} — {item.endereco}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}