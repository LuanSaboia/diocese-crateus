import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { Evento } from "@/types"
import { toast } from "sonner"

export function useAdminAgenda() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchEventos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_evento', { ascending: true })

      if (error) throw error
      setEventos(data as Evento[])
    } catch (err: any) {
      toast.error("Erro ao carregar a agenda: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  const saveEvento = async (data: Partial<Evento>, id?: string) => {
    try {
      setSaving(true)

      const payload = {
        titulo: data.titulo,
        descricao: data.descricao || null,
        data_evento: data.data_evento,
        local: data.local || null
      }

      if (id) {
        const { error } = await supabase.from('eventos').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Evento atualizado com sucesso!")
      } else {
        const { error } = await supabase.from('eventos').insert([payload])
        if (error) throw error
        toast.success("Evento cadastrado com sucesso!")
      }

      await fetchEventos()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar evento: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const deleteEvento = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return

    try {
      const { error } = await supabase.from('eventos').delete().eq('id', id)
      if (error) throw error
      toast.success("Evento removido com sucesso!")
      await fetchEventos()
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
    }
  }

  return {
    eventos,
    loading,
    saving,
    saveEvento,
    deleteEvento,
    refetch: fetchEventos
  }
}