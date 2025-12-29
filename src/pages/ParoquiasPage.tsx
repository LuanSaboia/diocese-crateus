// src/pages/ParoquiasPage.tsx
import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { ParoquiaCard } from "@/components/ParoquiaCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ParoquiasPage() {
  const [paroquias, setParoquias] = useState<any[]>([])
  const [filtroArea, setFiltroArea] = useState<string | null>(null)

  useEffect(() => {
    async function fetchParoquias() {
      const { data } = await supabase
        .from('paroquias')
        .select('*')
        .order('nome', { ascending: true })
      if (data) setParoquias(data)
    }
    fetchParoquias()
  }, [])

  const paroquiasFiltradas = filtroArea 
    ? paroquias.filter(p => p.area === filtroArea)
    : paroquias

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Paróquias</h1>
      
      {/* Filtros por Área com as cores do mapa */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <Button variant={!filtroArea ? "default" : "outline"} onClick={() => setFiltroArea(null)}>Todas</Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setFiltroArea("Norte")}>Norte</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setFiltroArea("Centro")}>Centro</Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setFiltroArea("Sul")}>Sul</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paroquiasFiltradas.map((p) => (
          <ParoquiaCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  )
}