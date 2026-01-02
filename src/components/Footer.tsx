import { Link } from "react-router-dom"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* COLUNA 1: IDENTIDADE */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl tracking-tight text-primary">
              Diocese de Crateús
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Caminhando juntos na fé e na caridade, a serviço do povo de Deus no sertão cearense.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-red-600 transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* COLUNA 2: ACESSO RÁPIDO */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-900 dark:text-zinc-100">Portal</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/noticias" className="hover:text-primary transition-colors">Notícias e Artigos</Link></li>
              <li><Link to="/paroquias" className="hover:text-primary transition-colors">Encontre sua Paróquia</Link></li>
              <li><Link to="/clero" className="hover:text-primary transition-colors">Nossos Presbíteros</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors text-xs opacity-50">Acesso Restrito</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO CÚRIA */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-900 dark:text-zinc-100">Cúria Diocesana</h4>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span>Rua Firmino Rosa, 1064, Centro<br />Crateús - CE, 63700-000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(88) 3691-0131</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@diocesedecrateus.com.br</span>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: BISPO (MINI CARD) */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-bold text-xs uppercase mb-3 text-primary">Bispo Diocesano</h4>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQtc50Axsp5Rfz1U_5J_A2IVjZ17HJJaru44HXPAGw3Jq4uDRvG54C7FYWVrfUq-qs6hujyjbx3cJ8nT5f4gx8o2HhpPAlLEcAiqkETY8&s=10" 
                  alt="Dom Ailton" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <p className="font-bold text-zinc-900 dark:text-zinc-100">Dom Ailton Menegussi</p>
                <p className="text-zinc-500">Desde 2013</p>
              </div>
            </div>
          </div>

        </div>

        <Separator className="my-8 bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <p>© {currentYear} Diocese de Crateús. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> pela Pastoral da Comunicação
          </p>
        </div>
      </div>
    </footer>
  )
}