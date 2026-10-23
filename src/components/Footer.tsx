import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart, ExternalLink, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import supabase from "@/lib/supabase"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setIsAuthenticated(true)
        return
      }

      // checa se existe qualquer chave de autenticação ativa no localStorage
      const hasLocalToken = Object.keys(localStorage).some(key => key.includes('auth-token') || key.includes('supabase'))
      setIsAuthenticated(hasLocalToken)
    }

    checkSession()

    // mudanças de estado de autenticação em tempo real (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Função para fazer logout e redirecionar para a Home
  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err)
    } finally {
      // Limpa qualquer dado residual de login local e redireciona
      localStorage.clear()
      setIsAuthenticated(false)
      navigate("/")
    }
  }

  return (
    <footer className="bg-orange-500 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-12 pb-6 text-white">
      <div className="container mx-auto px-4 space-y-10">
        
        {/* GRID DE COLUNAS DE LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* COLUNA 1: IDENTIDADE & REDES */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
              Diocese de Crateús
            </h3>
            <p className="text-xs leading-relaxed text-orange-50 dark:text-zinc-400">
              Caminhando juntos na fé e na caridade, a serviço do povo de Deus no sertão cearense.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="https://www.facebook.com/diocesedecrateusce" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/diocesedecrateus/" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.youtube.com/@diocesedecrateus3546" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="YouTube"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* COLUNA 2: VIDAS ESPIRITUAL & PASTORAL */}
          <div className="space-y-3">
            <h4 className="font-black uppercase text-[11px] tracking-widest text-zinc-900 dark:text-zinc-100 border-b border-white/20 pb-1">
              Vida Espiritual
            </h4>
            <ul className="space-y-2 text-xs text-orange-50 dark:text-zinc-400">
              <li><Link to="/liturgia" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Liturgia Diária</Link></li>
              <li><Link to="/palavra-do-pastor" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Palavra do Pastor</Link></li>
              <li><Link to="/projetos" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Projetos & Ações</Link></li>
              <li><Link to="/galeria" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Galeria de Fotos</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: ESTRUTURA DIOCESANA */}
          <div className="space-y-3">
            <h4 className="font-black uppercase text-[11px] tracking-widest text-zinc-900 dark:text-zinc-100 border-b border-white/20 pb-1">
              A Diocese
            </h4>
            <ul className="space-y-2 text-xs text-orange-50 dark:text-zinc-400">
              <li><Link to="/a-diocese" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Sobre a Diocese</Link></li>
              <li><Link to="/paroquias" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Paróquias & Áreas</Link></li>
              <li><Link to="/clero" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Clero & Presbíteros</Link></li>
              <li><Link to="/religiosas" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Casas Religiosas</Link></li>
              <li><Link to="/agenda" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Agenda Diocesana</Link></li>
            </ul>
          </div>

          {/* COLUNA 4: LINKS EXTERNOS / IGREJA NO MUNDO */}
          <div className="space-y-3">
            <h4 className="font-black uppercase text-[11px] tracking-widest text-zinc-900 dark:text-zinc-100 border-b border-white/20 pb-1">
              Outros Portais
            </h4>
            <ul className="space-y-2 text-xs text-orange-50 dark:text-zinc-400">
              <li>
                <a href="https://www.vatican.va" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                  Vatican.va <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://www.vaticannews.va/pt.html" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                  Vatican News <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://www.cnbb.org.br" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                  CNBB Nacional <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://cnbbne1.org.br" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                  CNBB Regional NE1 <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 5: BISPO & CONTATO CÚRIA */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-white">
              <h4 className="font-bold text-[10px] uppercase mb-2 text-primary tracking-wider">Bispo Diocesano</h4>
              <div className="flex gap-2.5 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                  <img 
                    src="/src/assets/bispos/ailton.jpg" 
                    alt="Dom Ailton" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-bold leading-tight">Dom Ailton Menegussi</p>
                  <p className="text-[10px] text-zinc-500">Desde 2013</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] space-y-1.5 text-orange-50 dark:text-zinc-400">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> Rua Firmino Rosa, 1064, Centro</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" /> (88) 3691-0131</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0 text-xs truncate" /> contato@diocesedecrateus.com.br</p>
            </div>
          </div>

        </div>

        <Separator className="bg-white/20 dark:bg-zinc-800" />

        {/* DIREITOS E CRÉDITOS */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-orange-100 dark:text-zinc-400">
          <p>© {currentYear} Diocese de Crateús. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-3">
            <Link to="/admin" className="opacity-60 hover:opacity-100 transition-opacity text-[11px]">
              Acesso Restrito (Admin)
            </Link>

            {/* BOTAO DISCRETO DE SAIR (SÓ APARECE SE HOUVER SESSÃO ATIVA) */}
            {isAuthenticated && (
              <>
                <span className="opacity-40">•</span>
                <button
                  onClick={handleLogout}
                  className="opacity-70 hover:opacity-100 hover:text-red-200 transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Encerrar sessão de administrador"
                >
                  <LogOut className="w-3 h-3" />
                  Sair
                </button>
              </>
            )}

            <span className="opacity-40">•</span>
            
            <p className="flex items-center gap-1">
              Desenvolvido com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> pela Pascom
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}