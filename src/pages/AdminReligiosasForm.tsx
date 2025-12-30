import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link as LinkIcon, Save, Home } from "lucide-react"

export function AdminReligiosasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [uploading, setUploading] = useState(false)
  const [item, setItem] = useState({
    nome: "", sigla: "", endereco: "", telefone: "", membros: "", imagem_url: ""
  })

  useEffect(() => {
    if (id) {
      async function load() {
        const { data } = await supabase.from('congregacoes').select('*').eq('id', id).single()
        if (data) setItem(data)
        setLoading(false)
      }
      load()
    }
  }, [id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const fileName = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('fotos-religiosas').upload(fileName, file)
      if (error) throw error
      const { data } = supabase.storage.from('fotos-religiosas').getPublicUrl(fileName)
      setItem({ ...item, imagem_url: data.publicUrl })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const { error } = id 
      ? await supabase.from('congregacoes').update(item).eq('id', id)
      : await supabase.from('congregacoes').insert([item])
    
    if (!error) navigate("/admin/religiosas")
    else alert("Erro: " + error.message)
  }

  if (loading) return <div className="p-20 text-center">Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Home className="text-blue-600" /> {id ? "Editar Congregação" : "Nova Congregação"}
      </h1>
      
      <div className="grid gap-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome da Congregação</Label>
            <Input value={item.nome} onChange={e => setItem({...item, nome: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Sigla</Label>
            <Input placeholder="Ex: FSTJ" value={item.sigla} onChange={e => setItem({...item, sigla: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Endereço Completo</Label>
            <Input value={item.endereco} onChange={e => setItem({...item, endereco: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Telefone / Contato</Label>
            <Input value={item.telefone} onChange={e => setItem({...item, telefone: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Irmãs (Membros da Fraternidade)</Label>
          <Textarea 
            placeholder="Ex: Ir. Maria, Ir. Ana..." 
            value={item.membros} 
            onChange={e => setItem({...item, membros: e.target.value})}
            className="h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Foto da Casa ou Congregação</Label>
          <Tabs defaultValue="upload">
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-2"/> Upload</TabsTrigger>
              <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-2"/> URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="border-2 border-dashed p-4 rounded-md text-center">
              <Input type="file" onChange={handleUpload} disabled={uploading} />
              {item.imagem_url && <img src={item.imagem_url} className="mt-4 h-32 mx-auto rounded-lg shadow" />}
            </TabsContent>
            <TabsContent value="url">
              <Input value={item.imagem_url} onChange={e => setItem({...item, imagem_url: e.target.value})} />
            </TabsContent>
          </Tabs>
        </div>

        <Button onClick={handleSave} disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
          <Save className="w-4 h-4 mr-2" /> Salvar Congregação
        </Button>
      </div>
    </div>
  )
}