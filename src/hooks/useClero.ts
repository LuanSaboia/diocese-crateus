import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"
import { type Clero } from "@/types"

export function useClero() {
  const [clero, setClero] = useState<Clero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCargo, setSelectedCargo] = useState<string>("todos")

  useEffect(() => {
    async function fetchClero() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('clero')
          .select('*')
          .order('nome', { ascending: true })

        if (sbError) throw sbError
        if (data) setClero(data as Clero[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar o diretório do clero.")
      } finally {
        setLoading(false)
      }
    }

    fetchClero()
  }, [])

  // Filtragem combinada por nome e cargo
  const cleroFiltrado = useMemo(() => {
    return clero.filter((membro) => {
      const matchesSearch = membro.nome
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      const matchesCargo =
        selectedCargo === "todos" ||
        membro.cargo?.toLowerCase().includes(selectedCargo.toLowerCase())

      return matchesSearch && matchesCargo
    })
  }, [clero, searchQuery, selectedCargo])

  return {
    clero: cleroFiltrado,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCargo,
    setSelectedCargo
  }
}