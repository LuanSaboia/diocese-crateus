import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Noticia } from "@/types"

export function useNoticiaDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNoticia() {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('noticias')
          .select('*, categorias(id, nome, cor)')
          .eq('slug', slug)
          .single()

        if (sbError) throw sbError
        if (data) setNoticia(data as Noticia)
      } catch (err: any) {
        setError(err.message || "Notícia não encontrada.")
      } finally {
        setLoading(false)
      }
    }

    fetchNoticia()
  }, [slug])

  return {
    noticia,
    loading,
    error
  }
}