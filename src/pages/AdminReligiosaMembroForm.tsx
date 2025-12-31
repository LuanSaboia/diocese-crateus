import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminReligiosaMembroForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [uploading, setUploading] = useState(false)
  const [congregacoes, setCongregacoes] = useState<any[]>([])
  const [membro, setMembro] = useState({
    nome: "",
    cargo: "",
    biografia: "",
    foto_url: "",
    congregacao_id: ""
  })

  useEffect(() => {
    async function loadInitialData() {
      
      const { data: congs } = await supabase.from('congregacoes').select('id, nome').order('nome')
      if (congs) setCongregacoes(congs)

      if (id) {
        const { data } = await supabase.from('religiosas_membros').select('*').eq('id', id).single()
        if (data) setMembro(data)
        setLoading(false)
      }
    }
    loadInitialData()
  }, [id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      
      const fileName = `irma-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('fotos-religiosas').upload(fileName, file)
      
      if (error) throw error
      
      const { data } = supabase.storage.from('fotos-religiosas').getPublicUrl(fileName)
      setMembro({ ...membro, foto_url: data.publicUrl })
    } catch (err: any) {
      alert("Erro no upload: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!membro.congregacao_id) return alert("Selecione uma congregação!")
    
    const { error } = id 
      ? await supabase.from('religiosas_membros').update(membro).eq('id', id)
      : await supabase.from('religiosas_membros').insert([membro])

    if (!error) navigate("/admin/religiosas")
    else alert("Erro ao salvar: " + error.message)
  }

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <UserPlus className="text-blue-600" /> {id ? "Editar Religiosa" : "Nova Religiosa na Fraternidade"}
      </h1>

      <div className="grid gap-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
        
        <div className="space-y-2">
          <Label>Selecione a Congregação/Casa</Label>
          <Select 
            value={membro.congregacao_id} 
            onValueChange={(val) => setMembro({...membro, congregacao_id: val})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha a fraternidade..." />
            </SelectTrigger>
            <SelectContent>
              {congregacoes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input value={membro.nome} onChange={e => setMembro({...membro, nome: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Cargo ou Função (Opcional)</Label>
            <Input placeholder="Ex: Superiora Local" value={membro.cargo} onChange={e => setMembro({...membro, cargo: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Biografia / História</Label>
          <Textarea 
            className="h-32" 
            value={membro.biografia} 
            onChange={e => setMembro({...membro, biografia: e.target.value})} 
          />
        </div>

        <div className="space-y-2">
          <Label>Foto de Perfil</Label>
          <Tabs defaultValue="upload">
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
              <TabsTrigger value="url" className="flex-1">Link URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="border-2 border-dashed p-6 rounded-md text-center">
              <Input type="file" onChange={handleUpload} disabled={uploading} />
              {membro.foto_url && (
                <div className="mt-4 w-24 h-24 mx-auto rounded-full overflow-hidden border">
                  <img src={membro.foto_url} className="w-full h-full object-cover" />
                </div>
              )}
            </TabsContent>
            <TabsContent value="url">
              <Input value={membro.foto_url} onChange={e => setMembro({...membro, foto_url: e.target.value})} />
            </TabsContent>
          </Tabs>
        </div>

        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
          <Save className="mr-2 h-4 w-4" /> Salvar Membro da Fraternidade
        </Button>
      </div>
    </div>
  )
}