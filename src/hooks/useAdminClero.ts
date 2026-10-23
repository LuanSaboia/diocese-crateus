import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { Clero, Paroquia } from "@/types"
import { toast } from "sonner"

export function useAdminClero() {
  const [clero, setClero] = useState<Clero[]>([])
  const [paroquias, setParoquias] = useState<Paroquia[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)

      // Busca os sacerdotes com os dados da paróquia vinculada
      const { data: cleroData, error: cleroError } = await supabase
        .from('clero')
        .select('*, paroquias(id, nome, cidade)')
        .order('ordem_exibicao', { ascending: true })

      if (cleroError) throw cleroError

      // Busca a lista de paróquias para seleção no formulário
      const { data: paroquiasData, error: paroquiasError } = await supabase
        .from('paroquias')
        .select('id, nome, cidade')
        .order('nome', { ascending: true })

      if (paroquiasError) throw paroquiasError

      setClero((cleroData as Clero[]) || [])
      setParoquias((paroquiasData as Paroquia[]) || [])
    } catch (err: any) {
      toast.error("Erro ao carregar dados do clero: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Salvar / Atualizar / Transferir Padre
  const savePadre = async (data: Partial<Clero>, id?: string) => {
    try {
      setSaving(true)
      const payload = {
        nome: data.nome,
        cargo: data.cargo, // Ex: Pároco, Vigário, Reitor, Vigário Geral
        paroquia_id: data.paroquia_id || null,
        imagem_url: data.imagem_url || null,
        data_ordenacao: data.data_ordenacao || null,
        aniversario_natalicio: data.aniversario_natalicio || null,
        email: data.email || null,
        biografia: data.biografia || null,
        ordem_exibicao: data.ordem_exibicao || 0
      }

      if (id) {
        const { error } = await supabase.from('clero').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Dados do sacerdote atualizados!")
      } else {
        const { error } = await supabase.from('clero').insert([payload])
        if (error) throw error
        toast.success("Sacerdote cadastrado com sucesso!")
      }

      await fetchData()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Excluir Sacerdote
  const deletePadre = async (id: string) => {
    try {
      const { error } = await supabase.from('clero').delete().eq('id', id)
      if (error) throw error
      toast.success("Membro do clero removido!")
      await fetchData()
      return true
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
      return false
    }
  }

  return { clero, paroquias, loading, saving, savePadre, deletePadre }
}