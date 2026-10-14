import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { toast } from "sonner"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obter sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Sessão encerrada com sucesso!")
    } catch (err: any) {
      toast.error("Erro ao sair: " + err.message)
    }
  }

  return { session, user, loading, logout }
}