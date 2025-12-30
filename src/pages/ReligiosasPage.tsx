import { useEffect, useState } from "react"
import { Link } from "react-router-dom" // Importante!
import supabase from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"

export function ReligiosasPage() {
  const [congregacoes, setCongregacoes] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('congregacoes').select('*').order('nome')
      setCongregacoes(data || [])
    }
    load()
  }, [])

  return (
    <div className="container mx-auto py-16 px-4 space-y-12">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold italic">Congregações Religiosas</h1>
        <p className="text-zinc-500 mt-4">A presença profética da Vida Consagrada em nossa Diocese.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {congregacoes.map((item) => (
          <Link key={item.id} to={`/religiosas/${item.id}`}> {/* O Card agora é um Link */}
            <Card className="overflow-hidden hover:shadow-xl transition-all border-zinc-200 h-full group">
              <div className="aspect-video bg-zinc-100 overflow-hidden">
                <img 
                  src={item.imagem_url || "https://images.unsplash.com/photo-1543160732-34390772709e"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={item.nome}
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-blue-600">{item.sigla || "CONGREGAÇÃO"}</Badge>
                <h3 className="font-bold text-xl leading-tight group-hover:text-blue-600 transition-colors">
                  {item.nome}
                </h3>
                
                <div className="space-y-2 text-sm text-zinc-500">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.endereco}</div>
                </div>
                
                <div className="pt-4 border-t flex justify-between items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                  Ver Fraternidade
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}