import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"
import type { Paroquia } from "@/types"

export function useParoquias() {
  const [paroquias, setParoquias] = useState<Paroquia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("todas")

  useEffect(() => {
    async function fetchParoquias() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('paroquias')
          .select('*')
          .order('nome', { ascending: true })

        if (sbError) throw sbError
        if (data) setParoquias(data as Paroquia[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar as paróquias.")
      } finally {
        setLoading(false)
      }
    }

    fetchParoquias()
  }, [])

  // Filtragem combinada por busca textual e área selecionada
  const paroquiasFiltradas = useMemo(() => {
    return paroquias.filter((paroquia) => {
      const matchesSearch = 
        paroquia.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paroquia.cidade.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesArea = 
        selectedArea === "todas" || 
        paroquia.area?.toLowerCase() === selectedArea.toLowerCase()

      return matchesSearch && matchesArea
    })
  }, [paroquias, searchQuery, selectedArea])

  // Agrupamento por Área Pastoral (Norte, Centro, Sul, etc.)
  const paroquiasPorArea = useMemo(() => {
    return paroquiasFiltradas.reduce((acc, paroquia) => {
      const area = paroquia.area || "Outras"
      if (!acc[area]) acc[area] = []
      acc[area].push(paroquia)
      return acc
    }, {} as Record<string, Paroquia[]>)
  }, [paroquiasFiltradas])

  return {
    paroquias: paroquiasFiltradas,
    paroquiasPorArea,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedArea,
    setSelectedArea
  }
}