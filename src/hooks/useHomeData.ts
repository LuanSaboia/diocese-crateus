import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { Noticia, Evento } from "@/types"

export function useHomeData() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDados() {
      try {
        setLoading(true)
        setError(null)

        const [newsRes, evRes] = await Promise.all([
          supabase
            .from('noticias')
            .select('*, categorias(nome, cor)')
            .eq('publicado', true)
            .order('data_publicacao', { ascending: false })
            .limit(4),
          supabase
            .from('eventos')
            .select('*')
            .gte('data_evento', new Date().toISOString())
            .order('data_evento', { ascending: true })
            .limit(4)
        ])

        if (newsRes.error) throw newsRes.error
        if (evRes.error) throw evRes.error

        if (newsRes.data) setNoticias(newsRes.data as Noticia[])
        if (evRes.data) setEventos(evRes.data as Evento[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados da página inicial.")
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [])

  const principal = noticias[0] || null
  const secundarias = noticias.slice(1)

  return {
    principal,
    secundarias,
    eventos,
    loading,
    error
  }
}