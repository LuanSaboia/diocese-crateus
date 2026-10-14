import { useEffect, useState, useMemo } from "react"
import supabase from "@/lib/supabase"

export interface PalavraPastorItem {
  id: string
  titulo: string
  tipo: 'video' | 'nota'
  url_youtube?: string | null
  conteudo_nota?: string | null
  data_publicacao: string
  created_at?: string
}

export function usePalavraPastor() {
  const [itens, setItens] = useState<PalavraPastorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("todos")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const { data, error: sbError } = await supabase
          .from('palavra_pastor')
          .select('*')
          .order('data_publicacao', { ascending: false })

        if (sbError) throw sbError
        if (data) setItens(data as PalavraPastorItem[])
      } catch (err: any) {
        setError(err.message || "Erro ao carregar a Palavra do Pastor.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const itensFiltrados = useMemo(() => {
    if (tab === "video") return itens.filter(i => i.tipo === 'video')
    if (tab === "nota") return itens.filter(i => i.tipo === 'nota')
    return itens
  }, [itens, tab])

  // Função utilitária para transformar links do YouTube em URL Embed segura
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return ""
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url
  }

  return {
    itens: itensFiltrados,
    loading,
    error,
    tab,
    setTab,
    getEmbedUrl
  }
}