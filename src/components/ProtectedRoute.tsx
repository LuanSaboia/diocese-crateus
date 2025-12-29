import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import supabase from "@/lib/supabase"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Escuta mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="p-10 text-center">Verificando permissões...</div>

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}