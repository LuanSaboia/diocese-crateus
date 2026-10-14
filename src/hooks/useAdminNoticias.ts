import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { Noticia, Categoria } from "@/types"
import { toast } from "sonner"

export function useAdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [newsRes, catRes] = await Promise.all([
        supabase
          .from('noticias')
          .select('*, categorias(id, nome, cor)')
          .order('created_at', { ascending: false }),
        supabase
          .from('categorias')
          .select('*')
          .order('nome', { ascending: true })
      ])

      if (newsRes.error) throw newsRes.error
      if (catRes.error) throw catRes.error

      setNoticias(newsRes.data as Noticia[])
      setCategorias(catRes.data as Categoria[])
    } catch (err: any) {
      toast.error("Erro ao carregar notícias: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Salvar ou Atualizar Notícia
  const saveNoticia = async (data: Partial<Noticia>, id?: string) => {
    try {
      setSaving(true)

      // Gerar slug automaticamente se não informado
      let slug = data.slug
      if (!slug && data.titulo) {
        slug = data.titulo
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      }

      // PAYLOAD ALINHADO COM O SCHEMA DO BANCO
      const payload = {
        titulo: data.titulo,
        subtitulo: data.subtitulo || null,
        slug,
        conteudo: data.conteudo,
        imagem_capa_url: data.imagem_capa_url || null,
        categoria_id: data.categoria_id && data.categoria_id !== "" ? data.categoria_id : null,
        publicado: data.publicado ?? true,
        data_publicacao: data.data_publicacao || new Date().toISOString()
      }

      if (id) {
        const { error } = await supabase.from('noticias').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Notícia atualizada com sucesso!")
      } else {
        const { error } = await supabase.from('noticias').insert([payload])
        if (error) throw error
        toast.success("Notícia publicada com sucesso!")
      }

      await fetchData()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar notícia: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Alternar visibilidade
  const togglePublicado = async (id: string, publicadoAtual: boolean) => {
    try {
      const { error } = await supabase
        .from('noticias')
        .update({ publicado: !publicadoAtual })
        .eq('id', id)

      if (error) throw error
      toast.success(!publicadoAtual ? "Notícia publicada!" : "Notícia salva como rascunho!")
      await fetchData()
    } catch (err: any) {
      toast.error("Erro ao alterar status: " + err.message)
    }
  }

  // Excluir
  const deleteNoticia = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return

    try {
      const { error } = await supabase.from('noticias').delete().eq('id', id)
      if (error) throw error
      toast.success("Notícia excluída com sucesso!")
      await fetchData()
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
    }
  }

  return {
    noticias,
    categorias,
    loading,
    saving,
    saveNoticia,
    togglePublicado,
    deleteNoticia,
    refetch: fetchData
  }
}