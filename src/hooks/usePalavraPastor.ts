import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export interface PalavraPastorItem {
  id: string
  titulo: string
  tipo: "video" | "audio" | "nota"
  url_youtube?: string | null
  url_audio?: string | null
  conteudo_nota?: string | null
  data_publicacao: string
  created_at?: string
}

export function usePalavraPastor() {
  const [itens, setItens] = useState<PalavraPastorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<string>("todos")

  useEffect(() => {
    async function fetchPalavraPastor() {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from("palavra_pastor")
          .select("*")
          .order("data_publicacao", { ascending: false })

        if (err) throw err
        if (data) setItens(data as PalavraPastorItem[])
      } catch (err: any) {
        console.error("Erro ao carregar Palavra do Pastor:", err)
        setError("Não foi possível carregar as mensagens pastorais.")
      } finally {
        setLoading(false)
      }
    }

    fetchPalavraPastor()
  }, [])

  // Função auxiliar para transformar links normais do YouTube em embed
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return ""
    if (url.includes("embed")) return url
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url
  }

  // Filtragem dinâmica por abas (todos, video, audio, nota)
  const itensFiltrados = itens.filter((item) => {
    if (tab === "todos") return true
    return item.tipo === tab
  })

  // Separa o item mais recente para destaque quando estiver na aba "todos"
  const destaque = tab === "todos" && itensFiltrados.length > 0 ? itensFiltrados[0] : null
  const listaRestante = tab === "todos" && itensFiltrados.length > 0 ? itensFiltrados.slice(1) : itensFiltrados

  return {
    itens: listaRestante,
    destaque,
    loading,
    error,
    tab,
    setTab,
    getEmbedUrl
  }
}