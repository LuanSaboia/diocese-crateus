import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/RichTextEditor"
import { Save, Trash2, Edit, X, Play, FileText } from "lucide-react"

export function AdminPalavraPastorPage() {
  const [lista, setLista] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    titulo: "", tipo: "video", url_youtube: "", conteudo_nota: "", data_publicacao: new Date().toISOString().split('T')[0] 
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('palavra_pastor').select('*').order('data_publicacao', { ascending: false })
    if (data) setLista(data)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editId 
      ? await supabase.from('palavra_pastor').update(form).eq('id', editId)
      : await supabase.from('palavra_pastor').insert([form])
    
    if (!error) { setEditId(null); setForm({ titulo: "", tipo: "video", url_youtube: "", conteudo_nota: "", data_publicacao: new Date().toISOString().split('T')[0] }); load(); }
  }

  return (
    <div className="container mx-auto py-10 px-4 h-[calc(100vh-120px)] overflow-hidden">
      <h1 className="text-3xl font-bold italic text-primary mb-6">Administrar Palavra do Pastor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
        {/* FORMULÁRIO LATERAL COM SCROLL */}
        <aside className="lg:col-span-1 border rounded-[2rem] flex flex-col h-full bg-zinc-50 overflow-hidden">
          <div className="p-6 border-b bg-white font-bold flex justify-between">
            {editId ? "Editar Mensagem" : "Nova Mensagem"}
            {editId && <X className="cursor-pointer" onClick={() => setEditId(null)} />}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Conteúdo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo do Youtube</SelectItem>
                  <SelectItem value="nota">Nota / Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            </div>

            {form.tipo === 'video' ? (
              <div className="space-y-2">
                <Label>Link do Vídeo</Label>
                <Input placeholder="https://youtube.com/watch?v=..." value={form.url_youtube} onChange={e => setForm({...form, url_youtube: e.target.value})} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Conteúdo da Nota</Label>
                <RichTextEditor content={form.conteudo_nota} onChange={h => setForm({...form, conteudo_nota: h})} />
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-white">
            <Button onClick={handleSave} className="w-full bg-primary h-12 rounded-xl">
              <Save className="w-4 h-4 mr-2" /> Salvar Mensagem
            </Button>
          </div>
        </aside>

        {/* LISTAGEM */}
        <div className="lg:col-span-2 overflow-y-auto space-y-4 pr-2">
          {lista.map(item => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {item.tipo === 'video' ? <Play className="text-red-500" /> : <FileText className="text-blue-500" />}
                  <div>
                    <h4 className="font-bold">{item.titulo}</h4>
                    <p className="text-xs text-zinc-400">{item.data_publicacao}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditId(item.id); setForm(item); }}><Edit className="w-4 h-4" /></Button>
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