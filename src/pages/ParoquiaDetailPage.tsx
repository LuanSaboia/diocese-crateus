import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Clock, Phone, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function ParoquiaDetailPage() {
  const { slug } = useParams()
  const [paroquia, setParoquia] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getParoquia() {
      const { data } = await supabase
        .from('paroquias')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) setParoquia(data)
      setLoading(false)
    }
    getParoquia()
  }, [slug])

  if (loading) return <div className="p-10 text-center">Carregando detalhes...</div>
  if (!paroquia) return <div className="p-10 text-center">Paróquia não encontrada.</div>

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/paroquias">
        <Button variant="ghost" className="mb-6 gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar para a lista
        </Button>
      </Link>

      <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img 
          src={paroquia.imagem_url || "https://images.unsplash.com/photo-1548625361-6243071d7d9f"} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <h1 className="text-4xl font-bold text-white">{paroquia.nome}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LADO ESQUERDO: Informações Gerais */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" /> Sobre a Paróquia
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {paroquia.descricao || "Informações sobre a história e fundação desta comunidade serão adicionadas em breve."}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" /> Localização
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">{paroquia.endereco}</p>
            <p className="text-zinc-500 font-medium">{paroquia.cidade} - CE</p>
          </section>
        </div>

        {/* LADO DIREITO: Horários (Sidebar) */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Horários de Missa
          </h3>
          
          <div className="space-y-4">
            {paroquia.horarios_missa?.domingo && (
              <div>
                <p className="font-semibold text-sm uppercase text-zinc-400">Domingo</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {paroquia.horarios_missa.domingo.map((h: string) => (
                    <span key={h} className="bg-white dark:bg-zinc-800 px-3 py-1 rounded-md text-sm border shadow-sm">{h}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Se houver telefone cadastrado */}
            {paroquia.telefone && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-sm font-semibold text-zinc-400 uppercase mb-2">Contato</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Phone className="w-4 h-4" /> {paroquia.telefone}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}