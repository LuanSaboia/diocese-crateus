import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import type { Clero, Paroquia } from "@/types"

export interface CleroComParoquia extends Clero {
  paroquia?: Paroquia
}

export function useCleroDetail() {
  const { id } = useParams<{ id: string }>()
  const [membro, setMembro] = useState<CleroComParoquia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCleroDetail() {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('clero')
          .select('*, paroquia:paroquias(*)')
          .eq('id', id)
          .single()

        if (sbError) throw sbError
        if (data) setMembro(data as CleroComParoquia)
      } catch (err: any) {
        setError(err.message || "Membro do clero não encontrado.")
      } finally {
        setLoading(false)
      }
    }

    fetchCleroDetail()
  }, [id])

  return {
    membro,
    loading,
    error
  }
}