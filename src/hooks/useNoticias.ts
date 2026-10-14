import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"
import type { Noticia, Categoria } from "@/types"

export function useNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas")

  useEffect(() => {
    async function fetchDados() {
      try {
        setLoading(true)
        setError(null)

        const [newsRes, catRes] = await Promise.all([
          supabase
            .from('noticias')
            .select('*, categorias(id, nome, cor)')
            .eq('publicado', true)
            .order('data_publicacao', { ascending: false }),
          supabase
            .from('categorias')
            .select('*')
            .order('nome', { ascending: true })
        ])

        if (newsRes.error) throw newsRes.error
        if (catRes.error) throw catRes.error

        if (newsRes.data) setNoticias(newsRes.data as Noticia[])
        if (catRes.data) setCategorias(catRes.data as Categoria[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar o mural de notícias.")
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [])

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter((item) => {
      const matchesSearch = 
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.resumo && item.resumo.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategoria = 
        selectedCategoria === "todas" || 
        item.categorias?.id === selectedCategoria

      return matchesSearch && matchesCategoria
    })
  }, [noticias, searchQuery, selectedCategoria])

  return {
    noticias: noticiasFiltradas,
    categorias,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategoria,
    setSelectedCategoria
  }
}