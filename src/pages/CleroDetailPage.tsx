import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar } from "lucide-react"

export function CleroDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [membro, setMembro] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from('clero').select('*').eq('id', id).single()
            if (data) setMembro(data)
            setLoading(false)
        }
        load()
    }, [id])

    if (loading) return <div className="p-20 text-center">Carregando perfil...</div>
    if (!membro) return <div className="p-20 text-center">Membro não encontrado.</div>

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Foto e Info Básica */}
                <div className="space-y-4 text-center md:text-left">
                    <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl border-4 border-white dark:border-zinc-800">
                        <img
                            src={membro.imagem_url || "/placeholder-user.png"}
                            alt={membro.nome}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{membro.nome}</h1>
                    <p className="text-primary font-bold uppercase tracking-widest text-sm">{membro.cargo}</p>
                </div>

                {/* Detalhes e Biografia */}
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-zinc-400">Ordenação</p>
                                <p className="font-bold text-sm">
                                    {membro.data_ordenacao
                                        ? new Date(membro.data_ordenacao + 'T00:00:00').toLocaleDateString('pt-BR')
                                        : "Não informada"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Biografia e Trajetória</h3>
                        {membro.biografia ? (
                            <div
                                className="leading-relaxed text-zinc-600 dark:text-zinc-400"
                                dangerouslySetInnerHTML={{ __html: membro.biografia }}
                            />
                        ) : (
                            <p className="italic text-zinc-400">Biografia em breve...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}