import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link as LinkIcon, Save } from "lucide-react"
import { RichTextEditor } from "@/components/RichTextEditor"

export function AdminCleroForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(!!id)
    const [uploading, setUploading] = useState(false)
    const [membro, setMembro] = useState({
        nome: "", cargo: "", data_ordenacao: "", imagem_url: "", biografia: ""
    })

    useEffect(() => {
        if (id) {
            async function load() {
                const { data } = await supabase.from('clero').select('*').eq('id', id).single()
                if (data) setMembro(data)
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
            const { error } = await supabase.storage.from('fotos-clero').upload(fileName, file)
            if (error) throw error
            const { data } = supabase.storage.from('fotos-clero').getPublicUrl(fileName)
            setMembro({ ...membro, imagem_url: data.publicUrl })
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        const { error } = id
            ? await supabase.from('clero').update(membro).eq('id', id)
            : await supabase.from('clero').insert([membro])

        if (!error) {
            alert("Dados salvos com sucesso!")
            navigate("/admin/clero")
        } else alert("Erro: " + error.message)
    }

    if (loading) return <div className="p-20 text-center">Carregando...</div>

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-bold">{id ? "Editar Membro" : "Novo Membro"}</h1>

            <div className="grid gap-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input value={membro.nome} onChange={e => setMembro({ ...membro, nome: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Cargo / Função</Label>
                        <Input placeholder="Ex: Pároco, Vigário, Diácono" value={membro.cargo} onChange={e => setMembro({ ...membro, cargo: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Data de Ordenação</Label>
                    <Input type="date" value={membro.data_ordenacao} onChange={e => setMembro({ ...membro, data_ordenacao: e.target.value })} />
                </div>

                <div className="space-y-2">
                    <Label>Foto do Membro</Label>
                    <Tabs defaultValue="upload">
                        <TabsList className="w-full">
                            <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-2" /> Upload</TabsTrigger>
                            <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-2" /> Link URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="border-2 border-dashed p-4 rounded-md flex flex-col items-center gap-2">
                            <Input type="file" onChange={handleUpload} disabled={uploading} />
                            {membro.imagem_url && <img src={membro.imagem_url} className="h-20 w-20 rounded-full object-cover border" />}
                        </TabsContent>
                        <TabsContent value="url">
                            <Input value={membro.imagem_url} onChange={e => setMembro({ ...membro, imagem_url: e.target.value })} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-2">
                    <Label className="font-bold">Biografia e Histórico</Label>
                    <RichTextEditor
                        content={membro.biografia || ""}
                        onChange={(html) => setMembro({ ...membro, biografia: html })}
                    />
                    <p className="text-[10px] text-zinc-500 italic">
                        Conte a história da ordenação, paróquias por onde passou, etc.
                    </p>
                </div>

                <Button onClick={handleSave} disabled={uploading} className="w-full bg-green-700 hover:bg-green-800 h-12">
                    <Save className="w-4 h-4 mr-2" /> Salvar Membro do Clero
                </Button>
            </div>
        </div>
    )
}