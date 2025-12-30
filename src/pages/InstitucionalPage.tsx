import { History, Users, Award, Landmark, Heart, Sprout, GraduationCap, MapPin, MessageSquare, BookOpen, ShieldCheck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function InstitucionalPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      {/* Banner Principal */}
      <div className="relative h-[350px] bg-blue-900 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Crateús" />
        <div className="relative z-20 text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight italic">A Diocese</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-light">Uma Igreja missionária no coração do sertão cearense.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 space-y-24">
        
        {/* SECÇÃO 1: HISTÓRIA */}
        <section id="historia" className="max-w-4xl mx-auto space-y-10 scroll-mt-24">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold italic">Nossa Caminhada</h2>
          </div>
          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              Criada pelo <strong>Papa Paulo VI em 28 de setembro de 1963</strong>, a Diocese de Crateús é fruto do desmembramento das dioceses de Iguatu e Sobral. 
              Instalada em 9 de agosto de 1964, teve em Dom Antônio Batista Fragoso sua grande referência inicial, moldando uma identidade de resistência e fé.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {[
                { nome: "Dom Antônio Fragoso", periodo: "1964 - 1998", p: "Foco na libertação camponesa e educação popular." },
                { nome: "Dom Jacinto Brito", periodo: "1998 - 2012", p: "Expansão pastoral e resgate da identidade católica." },
                { nome: "Dom Ailton Menegussi", periodo: "2013 - Atual", p: "Liderança do Jubileu e renovação das comunidades." }
              ].map((b, i) => (
                <div key={i} className="p-5 border rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:border-blue-500 transition-all">
                  <Award className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-bold">{b.nome}</h4>
                  <p className="text-xs text-blue-600 mb-2">{b.periodo}</p>
                  <p className="text-sm text-zinc-500">{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECÇÃO 2: CÚRIA */}
        <section id="curia" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2">
            <Landmark className="w-10 h-10 text-blue-600 mx-auto" />
            <h2 className="text-3xl font-bold italic">Cúria Diocesana</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { c: "Bispo Diocesano", n: "Dom Ailton Menegussi" },
              { c: "Vigário Geral", n: "Pe. Denilson Furtado" },
              { c: "Chanceler", n: "Pe. Raimundo Feitosa (Neto)" },
              { c: "Ecônomo", n: "Pe. Antônio José Meneles" },
              { c: "Secretária", n: "Daiane Marques" },
              { c: "Tribunal Eclesiástico", n: "Pe. Anderson Lima" },
              { c: "Contadora", n: "Marcela Soares" },
            ].map((item, i) => (
              <Card key={i} className="border-none bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">{item.c}</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{item.n}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* SECÇÃO 3: PASTORAIS E MOVIMENTOS */}
        <section id="pastorais" className="space-y-12 scroll-mt-24">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold italic">Pastorais e Movimentos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coordenação de Pastoral */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                <ShieldCheck className="w-5 h-5" /> Coordenação e Conselhos
              </h3>
              <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p><strong>Coordenação Geral:</strong> Pe. Akino Vasconcelos, Fátima Veras e Ir. Elza.</p>
                <p><strong>CDP:</strong> Conselho Diocesano de Pastoral.</p>
                <p><strong>COMIDI:</strong> Bispo Dom Ailton e Ir. Sônia.</p>
                <p><strong>CAE / Consultores:</strong> Comissões de Assuntos Econômicos e Presbiteral.</p>
              </div>
            </div>

            {/* Setores e Pastorais Específicas */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                <BookOpen className="w-5 h-5" /> Setores e Catequese
              </h3>
              <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><strong>Juventude:</strong> Pe. Adriano.</p>
                <p><strong>Catequese:</strong> Pe. José Damacio Soares Silva.</p>
                <p><strong>Dízimo:</strong> Pe. Reginaldo.</p>
                <p><strong>Educação e Saúde:</strong> Ir. Ailce (Saúde).</p>
                <p><strong>Familiar:</strong> Diácono Francisco das Chagas.</p>
              </div>
            </div>

            {/* Movimentos e Novas Comunidades */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                <MessageSquare className="w-5 h-5" /> Movimentos
              </h3>
              <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><strong>Coordenação:</strong> Pe. José Aurenilson Carvalho.</p>
                <p className="italic">Apostolado da Oração, Legião de Maria, Homens do Terço, Mães que Oram, RCC, Shalom e Mensageiro das Chagas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECÇÃO 4: PROJETOS SOCIAIS (CÁRITAS E TERRA) */}
        <section id="projetos" className="bg-zinc-900 rounded-[40px] p-8 md:p-16 text-white space-y-12 scroll-mt-24 shadow-2xl">
          <div className="max-w-3xl">
            <Badge className="bg-blue-600 mb-4 px-4 py-1">Promoção Humana</Badge>
            <h2 className="text-4xl font-bold italic mb-4 text-white">Projetos Sociais e Cáritas</h2>
            <p className="opacity-80 text-lg">Ação contínua de promoção social e defesa de direitos no território diocesano.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { t: "Cáritas Diocesana", d: "Atua na promoção social, defesa de direitos e convivência com o semiárido. Presidente: Pe. Neto.", i: <Heart /> },
              { t: "Comissão Pastoral da Terra (CPT)", d: "Ligada aos trabalhadores rurais e luta por justiça social. Pe. Maurizio Cremaschi.", i: <Sprout /> },
              { t: "Projeto Paulo Freire", d: "Assessoria técnica para agricultores familiares em Tauá, Parambu e região.", i: <GraduationCap /> },
              { t: "Caminhos da Resiliência", d: "Trabalho inovador com pescadores artesanais dos sertões de Crateús.", i: <MapPin /> }
            ].map((p, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-blue-400">
                  {p.i}
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">{p.t}</h4>
                  <p className="text-sm opacity-70 leading-relaxed font-light">{p.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-blue-400 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" /> Formação Vocacional
              </h4>
              <p className="text-sm opacity-80"><strong>Casa Vocacional:</strong> Rua José Regino, 692 - Venâncio, Crateús.</p>
              <p className="text-sm opacity-80"><strong>Seminário Fortaleza:</strong> Rua Conselheiro Tristão, 73 - Centro, Fortaleza.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}