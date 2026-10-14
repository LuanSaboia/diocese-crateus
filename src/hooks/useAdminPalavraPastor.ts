import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { PalavraPastorItem } from "@/hooks/usePalavraPastor"
import { toast } from "sonner"

export function useAdminPalavraPastor() {
  const [itens, setItens] = useState<PalavraPastorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchItens = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('palavra_pastor')
        .select('*')
        .order('data_publicacao', { ascending: false })

      if (error) throw error
      setItens(data as PalavraPastorItem[])
    } catch (err: any) {
      toast.error("Erro ao carregar mensagens: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItens()
  }, [])

  const saveItem = async (data: Partial<PalavraPastorItem>, id?: string) => {
    try {
      setSaving(true)
      const payload = {
        titulo: data.titulo,
        tipo: data.tipo,
        url_youtube: data.tipo === 'video' ? data.url_youtube : null,
        conteudo_nota: data.tipo === 'nota' ? data.conteudo_nota : null,
        data_publicacao: data.data_publicacao || new Date().toISOString()
      }

      if (id) {
        const { error } = await supabase.from('palavra_pastor').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Mensagem atualizada!")
      } else {
        const { error } = await supabase.from('palavra_pastor').insert([payload])
        if (error) throw error
        toast.success("Mensagem publicada!")
      }

      await fetchItens()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta publicação?")) return
    try {
      const { error } = await supabase.from('palavra_pastor').delete().eq('id', id)
      if (error) throw error
      toast.success("Publicação removida!")
      await fetchItens()
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
    }
  }

  return { itens, loading, saving, saveItem, deleteItem }
}