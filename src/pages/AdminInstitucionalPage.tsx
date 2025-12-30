import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/RichTextEditor"
import { Save, Loader2, Plus, Trash2, Landmark } from "lucide-react"

export function AdminInstitucionalPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [historia, setHistoria] = useState("")
  const [curia, setCuria] = useState<{ cargo: string, nome: string }[]>([])

  const ID_FIXO = '00000000-0000-0000-0000-000000000000'

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('institucional').select('*').eq('id', ID_FIXO).single()
      if (data) {
        setHistoria(data.historia_html || "")
        setCuria(data.curia_json || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const addMembroCuria = () => setCuria([...curia, { cargo: "", nome: "" }])
  
  const removeMembro = (index: number) => setCuria(curia.filter((_, i) => i !== index))

  const updateMembro = (index: number, field: 'cargo' | 'nome', value: string) => {
    const novaCuria = [...curia]
    novaCuria[index][field] = value
    setCuria(novaCuria)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('institucional').upsert({
      id: ID_FIXO,
      historia_html: historia,
      curia_json: curia,
      updated_at: new Date().toISOString()
    })

    if (!error) alert("Dados institucionais atualizados!")
    else alert("Erro ao salvar: " + error.message)
    setSaving(false)
  }

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto"/></div>

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Landmark /> Gestão Institucional</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
          Guardar Alterações
        </Button>
      </div>

      <div className="grid gap-8">
        {/* EDITAR HISTÓRIA */}
        <div className="space-y-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
          <Label className="text-lg font-bold">História da Diocese</Label>
          <RichTextEditor content={historia} onChange={setHistoria} />
        </div>

        {/* EDITAR CÚRIA */}
        <div className="space-y-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-bold">Membros da Cúria</Label>
            <Button variant="outline" size="sm" onClick={addMembroCuria}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Cargo
            </Button>
          </div>
          
          <div className="space-y-3">
            {curia.map((membro, index) => (
              <div key={index} className="flex gap-4 items-end border-b pb-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs uppercase">Cargo</Label>
                  <Input 
                    value={membro.cargo} 
                    onChange={(e) => updateMembro(index, 'cargo', e.target.value)}
                    placeholder="Ex: Vigário Geral"
                  />
                </div>
                <div className="flex-[2] space-y-2">
                  <Label className="text-xs uppercase">Nome</Label>
                  <Input 
                    value={membro.nome} 
                    onChange={(e) => updateMembro(index, 'nome', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeMembro(index)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}