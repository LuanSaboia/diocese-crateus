import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import supabase from "@/lib/supabase"
import { type Paroquia } from "@/types"

export function useParoquiaDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [paroquia, setParoquia] = useState<Paroquia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchParoquia() {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const { data, error: sbError } = await supabase
          .from('paroquias')
          .select('*')
          .eq('slug', slug)
          .single()

        if (sbError) throw sbError
        if (data) setParoquia(data as Paroquia)
      } catch (err: any) {
        setError(err.message || "Paróquia não encontrada.")
      } finally {
        setLoading(false)
      }
    }

    fetchParoquia()
  }, [slug])

  return {
    paroquia,
    loading,
    error
  }
}