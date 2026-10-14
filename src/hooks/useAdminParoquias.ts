import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { Paroquia } from "@/types"
import { toast } from "sonner"

export function useAdminParoquias() {
  const [paroquias, setParoquias] = useState<Paroquia[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Carregar paróquias
  const fetchParoquias = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('paroquias')
        .select('*')
        .order('nome', { ascending: true })

      if (error) throw error
      setParoquias(data as Paroquia[])
    } catch (err: any) {
      toast.error("Erro ao carregar paróquias: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParoquias()
  }, [])

  // Criar ou Atualizar Paróquia
  const saveParoquia = async (data: Partial<Paroquia>, id?: string) => {
    try {
      setSaving(true)

      // Gera slug automaticamente se não informado
      if (!data.slug && data.nome) {
        data.slug = data.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      }

      if (id) {
        const { error } = await supabase.from('paroquias').update(data).eq('id', id)
        if (error) throw error
        toast.success("Paróquia atualizada com sucesso!")
      } else {
        const { error } = await supabase.from('paroquias').insert([data])
        if (error) throw error
        toast.success("Paróquia criada com sucesso!")
      }

      await fetchParoquias()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Excluir Paróquia
  // Em src/hooks/useAdminParoquias.ts
  const deleteParoquia = async (id: string) => {
    try {
      const { error } = await supabase.from('paroquias').delete().eq('id', id)
      if (error) throw error
      toast.success("Paróquia removida com sucesso!")
      await fetchParoquias()
      return true
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
      return false
    }
  }

  return {
    paroquias,
    loading,
    saving,
    saveParoquia,
    deleteParoquia,
    refetch: fetchParoquias
  }
}