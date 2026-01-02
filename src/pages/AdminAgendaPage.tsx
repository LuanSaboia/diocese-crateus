import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Trash2, Edit, X, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AdminAgendaPage() {
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    titulo: "",
    data_evento: "",
    hora_evento: "",
    local: "",
    descricao: ""
  })

  useEffect(() => { fetchEventos() }, [])

  async function fetchEventos() {
    const { data } = await supabase.from('eventos').select('*').order('data_evento', { ascending: true })
    if (data) setEventos(data)
    setLoading(false)
  }

  const handleEditClick = (evento: any) => {
    setEditId(evento.id)
    setForm({
      titulo: evento.titulo,
      data_evento: evento.data_evento,
      hora_evento: evento.hora_evento || "",
      local: evento.local || "",
      descricao: evento.descricao || ""
    })
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ titulo: "", data_evento: "", hora_evento: "", local: "", descricao: "" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editId 
      ? await supabase.from('eventos').update(form).eq('id', editId)
      : await supabase.from('eventos').insert([form])
    
    if (!error) { resetForm(); fetchEventos(); }
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold italic text-primary mb-6">Agenda Diocesana</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* FORMULÁRIO STICKY */}
        <aside className={`lg:col-span-1 border rounded-3xl flex flex-col bg-zinc-50 dark:bg-zinc-900 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] ${editId ? 'border-orange-500 shadow-md' : ''}`}>
          <div className="p-6 border-b flex justify-between items-center bg-white dark:bg-zinc-950 rounded-t-3xl shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              {editId ? <Edit className="w-4 h-4 text-orange-600" /> : <Plus className="w-4 h-4" />}
              {editId ? 'Editar Evento' : 'Novo Evento'}
            </h3>
            {editId && <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-2">
              <Label>Título do Evento</Label>
              <Input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Data</Label><Input required type="date" value={form.data_evento} onChange={e => setForm({...form, data_evento: e.target.value})} /></div>
              <div className="space-y-2"><Label>Hora</Label><Input type="time" value={form.hora_evento} onChange={e => setForm({...form, hora_evento: e.target.value})} /></div>
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input value={form.local} onChange={e => setForm({...form, local: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea className="h-24" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
            </div>
          </div>

          <div className="p-6 border-t bg-white dark:bg-zinc-950 rounded-b-3xl shrink-0">
            <Button onClick={handleSubmit} className={`w-full ${editId ? 'bg-orange-600' : 'bg-primary'}`}>
              <Save className="w-4 h-4 mr-2" /> {editId ? 'Salvar Alterações' : 'Agendar'}
            </Button>
          </div>
        </aside>

        {/* LISTAGEM */}
        <div className="lg:col-span-2 space-y-4">
          {eventos.map(ev => (
            <Card key={ev.id} className={`border-none shadow-sm ${editId === ev.id ? 'ring-2 ring-orange-500' : 'bg-white'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg text-center min-w-[60px] ${editId === ev.id ? 'bg-orange-500 text-white' : 'bg-zinc-100'}`}>
                    <span className="block font-bold text-lg">{new Date(ev.data_evento).getUTCDate()}</span>
                    <span className="text-[10px] uppercase">{new Date(ev.data_evento).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' })}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">{ev.titulo}</h4>
                    <p className="text-xs text-zinc-400 italic">{ev.local} • {ev.hora_evento}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(ev)} className="text-blue-500"><Edit className="w-4 h-4" /></Button>
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