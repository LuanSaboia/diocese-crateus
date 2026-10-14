import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"
import type { Evento } from "@/types"

export function useAgenda() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriodo, setFilterPeriodo] = useState<"proximos" | "todos">("proximos")

  useEffect(() => {
    async function fetchEventos() {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('eventos')
          .select('*')
          .order('data_evento', { ascending: true })

        if (filterPeriodo === "proximos") {
          query = query.gte('data_evento', new Date().toISOString())
        }

        const { data, error: sbError } = await query

        if (sbError) throw sbError
        if (data) setEventos(data as Evento[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar a agenda diocesana.")
      } finally {
        setLoading(false)
      }
    }

    fetchEventos()
  }, [filterPeriodo])

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const matchesSearch =
        evento.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evento.local && evento.local.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evento.descricao && evento.descricao.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesSearch
    })
  }, [eventos, searchQuery])

  // Agrupamento dos eventos por Mês/Ano para facilidade de leitura
  const eventosPorMes = useMemo(() => {
    return eventosFiltrados.reduce((acc, evento) => {
      const date = new Date(evento.data_evento)
      const mesAno = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
      const mesCapitalizado = mesAno.charAt(0).toUpperCase() + mesAno.slice(1)

      if (!acc[mesCapitalizado]) acc[mesCapitalizado] = []
      acc[mesCapitalizado].push(evento)
      return acc
    }, {} as Record<string, Evento[]>)
  }, [eventosFiltrados])

  return {
    eventos: eventosFiltrados,
    eventosPorMes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterPeriodo,
    setFilterPeriodo
  }
}