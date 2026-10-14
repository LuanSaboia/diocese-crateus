import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"

export interface Congregacao {
  id: string
  nome: string
  sigla?: string
  carisma?: string
  endereco?: string
  cidade?: string
  telefone?: string
  imagem_url?: string
}

export function useReligiosas() {
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchReligiosas() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('congregacoes')
          .select('*')
          .order('nome', { ascending: true })

        if (sbError) throw sbError
        if (data) setCongregacoes(data as Congregacao[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar as congregações religiosas.")
      } finally {
        setLoading(false)
      }
    }

    fetchReligiosas()
  }, [])

  const congregacoesFiltradas = useMemo(() => {
    return congregacoes.filter((c) =>
      c.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.sigla && c.sigla.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.cidade && c.cidade.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [congregacoes, searchQuery])

  return {
    congregacoes: congregacoesFiltradas,
    loading,
    error,
    searchQuery,
    setSearchQuery
  }
}