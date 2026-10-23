import { useState, useEffect } from "react"
import supabase from "@/lib/supabase"
import type { Congregacao, ReligiosaMembro } from "@/types"
import { toast } from "sonner"

export function useAdminReligiosas() {
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([])
  const [membros, setMembros] = useState<ReligiosaMembro[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [congRes, memRes] = await Promise.all([
        supabase
          .from('congregacoes')
          .select('*')
          .order('ordem_exibicao', { ascending: true })
          .order('nome', { ascending: true }),
        supabase
          .from('religiosas_membros')
          .select('*, congregacoes(nome, sigla)')
          .order('nome', { ascending: true })
      ])

      if (congRes.error) throw congRes.error
      if (memRes.error) throw memRes.error

      setCongregacoes(congRes.data as Congregacao[])
      setMembros(memRes.data as ReligiosaMembro[])
    } catch (err: any) {
      toast.error("Erro ao carregar dados: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // CRUD Congregação
  const saveCongregacao = async (data: Partial<Congregacao>, id?: string) => {
    try {
      setSaving(true)
      const payload = {
        nome: data.nome,
        sigla: data.sigla || null,
        endereco: data.endereco || null,
        telefone: data.telefone || null,
        membros: data.membros || null,
        imagem_url: data.imagem_url || null,
        ordem_exibicao: 0
        // ordem_exibicao: data.ordem_exibicao || 0
      }

      if (id) {
        const { error } = await supabase.from('congregacoes').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Congregação atualizada com sucesso!")
      } else {
        const { error } = await supabase.from('congregacoes').insert([payload])
        if (error) throw error
        toast.success("Congregação cadastrada com sucesso!")
      }

      await fetchData()
      return true
    } catch (err: any) {
      toast.error("Erro ao salvar congregação: " + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const deleteCongregacao = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta congregação? Todas as irmãs vinculadas serão removidas.")) return

    try {
      const { error } = await supabase.from('congregacoes').delete().eq('id', id)
      if (error) throw error
      toast.success("Congregação removida!")
      await fetchData()
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
    }
  }

  const saveMembro = async (data: Partial<ReligiosaMembro>, id?: string) => {
    try {
      setSaving(true)
      const payload = {
        nome: data.nome,
        cargo: data.cargo || null,
        biografia: data.biografia || null,
        foto_url: data.foto_url || null,
        congregacao_id: data.congregacao_id || null
      }

      if (id) {
        const { error } = await supabase.from('religiosas_membros').update(payload).eq('id', id)
        if (error) throw error
        toast.success("Dados da religiosa atualizados!")
      } else {
        const { error } = await supabase.from('religiosas_membros').insert([payload])
        if (error) throw error
        toast.success("Religiosa vinculada com sucesso!")
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

  const deleteMembro = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta religiosa?")) return

    try {
      const { error } = await supabase.from('religiosas_membros').delete().eq('id', id)
      if (error) throw error
      toast.success("Registro removido!")
      await fetchData()
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message)
    }
  }

  return {
    congregacoes,
    membros,
    loading,
    saving,
    saveCongregacao,
    deleteCongregacao,
    saveMembro,
    deleteMembro,
    refetch: fetchData
  }
}