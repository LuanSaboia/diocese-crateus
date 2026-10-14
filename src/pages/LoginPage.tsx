import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { toast } from "sonner"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      toast.success("Login efetuado com sucesso!")
      navigate("/admin")
    } catch (err: any) {
      toast.error("Falha ao entrar: " + (err.message || "Credenciais inválidas."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="w-10 h-10 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center mx-auto mb-2 border border-[#e4e4e7] dark:border-[#27272a]">
            <Lock className="w-4 h-4 text-[#2563eb]" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Painel Administrativo
          </CardTitle>
          <CardDescription className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Informe suas credenciais da Diocese de Crateús.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>E-mail *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@diocese.org"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-xs font-semibold" disabled={loading}>
              {loading ? "Entrando..." : "Acessar Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}