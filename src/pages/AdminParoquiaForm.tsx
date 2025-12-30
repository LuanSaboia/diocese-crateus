import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link as LinkIcon, Save, Trash2 } from "lucide-react"

export function AdminParoquiaForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(!!id)
    const [uploading, setUploading] = useState(false)
    const [paroquia, setParoquia] = useState({
        nome: "", cidade: "", endereco: "", area: "Centro",
        slug: "", imagem_url: "", horarios_missa: {} as any
    })

    // 1. Defina os dias da semana para o Select
    const DIAS_SEMANA = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

    // 2. No seu componente, adicione funções para manipular essa lista
    const adicionarHorario = () => {
        const novoHorario = { ...paroquia.horarios_missa, "": [] };
        setParoquia({ ...paroquia, horarios_missa: novoHorario });
    };

    const removerDia = (diaParaRemover: string) => {
        const novosHorarios = { ...paroquia.horarios_missa };
        delete novosHorarios[diaParaRemover];
        setParoquia({ ...paroquia, horarios_missa: novosHorarios });
    };

    const atualizarHorariosDoDia = (dia: string, valor: string) => {
        // Transforma "07:00, 19:00" em ["07:00", "19:00"]
        const arrayHoras = valor.split(",").map(h => h.trim()).filter(h => h !== "");
        setParoquia({
            ...paroquia,
            horarios_missa: { ...paroquia.horarios_missa, [dia]: arrayHoras }
        });
    };

    useEffect(() => {
        if (id) {
            async function load() {
                const { data } = await supabase.from('paroquias').select('*').eq('id', id).single()
                if (data) setParoquia(data)
                setLoading(false)
            }
            load()
        }
    }, [id])

    // Lógica de Upload para o bucket fotos-paroquia
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return
            const fileName = `${Date.now()}-${file.name}`
            const { error } = await supabase.storage.from('fotos-paroquia').upload(fileName, file)
            if (error) throw error
            const { data } = supabase.storage.from('fotos-paroquia').getPublicUrl(fileName)
            setParoquia({ ...paroquia, imagem_url: data.publicUrl })
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        const { error } = id
            ? await supabase.from('paroquias').update(paroquia).eq('id', id)
            : await supabase.from('paroquias').insert([paroquia])

        if (!error) navigate("/admin/paroquias")
        else alert("Erro ao salvar: " + error.message)
    }

    if (loading) return <div className="p-20 text-center">Carregando...</div>

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-bold">{id ? "Editar Paróquia" : "Nova Paróquia"}</h1>

            <div className="grid gap-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nome da Paróquia</Label>
                        <Input value={paroquia.nome} onChange={e => setParoquia({ ...paroquia, nome: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input value={paroquia.cidade} onChange={e => setParoquia({ ...paroquia, cidade: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Imagem da Igreja</Label>
                    <Tabs defaultValue="upload">
                        <TabsList className="w-full">
                            <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-2" /> Upload</TabsTrigger>
                            <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-2" /> Link URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="border-2 border-dashed p-4 rounded-md">
                            <Input type="file" onChange={handleUpload} disabled={uploading} />
                        </TabsContent>
                        <TabsContent value="url">
                            <Input value={paroquia.imagem_url} onChange={e => setParoquia({ ...paroquia, imagem_url: e.target.value })} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-4 border p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex justify-between items-center">
                        <Label className="font-bold text-lg">Horários de Missa</Label>
                        <Button type="button" variant="outline" size="sm" onClick={adicionarHorario}>
                            + Adicionar Dia
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(paroquia.horarios_missa || {}).map(([dia, horas]: any, index) => (
                            <div key={index} className="flex gap-3 items-start bg-white dark:bg-zinc-950 p-3 rounded-md border shadow-sm">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-zinc-400">Dia da Semana</Label>
                                    <select
                                        className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={dia}
                                        onChange={(e) => {
                                            const novoDia = e.target.value;
                                            const novosHorarios = { ...paroquia.horarios_missa };
                                            novosHorarios[novoDia] = novosHorarios[dia];
                                            delete novosHorarios[dia];
                                            setParoquia({ ...paroquia, horarios_missa: novosHorarios });
                                        }}
                                    >
                                        <option value="">Selecione o dia...</option>
                                        {DIAS_SEMANA.map(d => (
                                            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-[2] space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-zinc-400">Horários (separe por vírgula)</Label>
                                    <Input
                                        placeholder="Ex: 07:00, 18:30"
                                        value={horas.join(", ")}
                                        onChange={(e) => atualizarHorariosDoDia(dia, e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6 text-red-500 hover:text-red-700"
                                    onClick={() => removerDia(dia)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <p className="text-[10px] text-zinc-500 italic">
                        * Dica: Digite os horários separados por vírgula. Ex: 08:00, 19:30
                    </p>
                </div>

                <Button onClick={handleSave} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Save className="w-4 h-4 mr-2" /> Salvar Paróquia
                </Button>
            </div>
        </div>
    )
}