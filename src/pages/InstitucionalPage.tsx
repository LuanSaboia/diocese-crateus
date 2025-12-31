import { History, Users, Landmark, Heart, Sprout, GraduationCap, MapPin, MessageSquare, BookOpen, ShieldCheck, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

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
                {
                  nome: "Dom Antônio Fragoso",
                  periodo: "1964 - 1998",
                  p: "Foco na libertação camponesa e educação popular.",
                  lema: "Opportet Illas adducere - (Também tenho de as conduzir)",
                  foto: "/src/assets/bispos/fragoso.jpg",
                  brasao: "/src/assets/brasoes/fragoso-brasao.png"
                },
                {
                  nome: "Dom Jacinto Brito",
                  periodo: "1998 - 2012",
                  p: "Expansão pastoral e resgate da identidade católica.",
                  lema: "In Verbo Tuo",
                  foto: "/src/assets/bispos/jacinto.jpg",
                  brasao: "/src/assets/brasoes/jacinto-brasao.png"
                },
                {
                  nome: "Dom Ailton Menegussi",
                  periodo: "2013 - Atual",
                  p: "Liderança do Jubileu e renovação das comunidades.",
                  lema: "Basta-te a minha graça",
                  foto: "/src/assets/bispos/ailton.jpg",
                  brasao: "/src/assets/brasoes/ailton-brasao.png"
                }
              ].map((b, i) => {
                const [fotoErro, setFotoErro] = useState(false);
                const [brasaoErro, setBrasaoErro] = useState(false);
                const isAtual = b.periodo.includes("Atual");

                return (
                  <div key={i} className={`flex flex-col border rounded-2xl bg-zinc-50 dark:bg-zinc-900 transition-all overflow-hidden shadow-sm h-full ${isAtual ? 'border-blue-500 shadow-md' : 'hover:border-blue-500'}`}>
                    <div className="flex p-5 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shrink-0 shadow-sm bg-zinc-100 flex items-center justify-center ${isAtual ? 'border-blue-500' : 'border-blue-100'}`}>
                        {!fotoErro ? (
                          <img
                            src={b.foto}
                            alt={b.nome}
                            onError={() => setFotoErro(true)}
                            className={`w-full h-full object-cover object-top transition-all duration-500 ${isAtual ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}
                          />
                        ) : (
                          <User className={`w-8 h-8 ${isAtual ? 'text-blue-600' : 'text-zinc-400'}`} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{b.nome}</h4>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{b.periodo}</p>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <p className="text-sm text-zinc-500 leading-relaxed italic">
                        {b.p}
                      </p>

                      <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                        <img
                          src={!brasaoErro ? b.brasao : "/src/assets/brasoes/default.svg"}
                          alt="Brasão Episcopal"
                          onError={() => setBrasaoErro(true)}
                          className="w-10 h-10 object-contain shrink-0"
                        />
                        <p className="text-[11px] italic text-zinc-600 dark:text-zinc-400 leading-tight border-l pl-3 border-zinc-200 dark:border-zinc-700">
                          "{b.lema}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            {/* COLUNA 1: Coordenação e Conselhos */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                <ShieldCheck className="w-5 h-5" /> Coordenação e Conselhos
              </h3>
              <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p><strong>Coordenação de Pastoral:</strong> Pe. Akino Vasconcelos, Fátima Veras e Ir. Elza.</p>
                <p><strong>CDP:</strong> Conselho Diocesano de Pastoral.</p>
                <p><strong>COMIDI:</strong> Bispo Dom Ailton e Ir. Sônia.</p>
                <p><strong>CAE:</strong> Comissão de Assuntos Econômicos.</p>
                <p><strong>Consultores:</strong> Conselho Presbiteral e de Consultores.</p>
                <p><strong>Equipe de Campanhas:</strong> Pe. Cícero.</p>
              </div>
            </div>

            {/* COLUNA 2: Setores e Pastorais de Formação */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                <BookOpen className="w-5 h-5" /> Setores e Pastorais
              </h3>
              <div className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><strong>Catequese:</strong> Pe. José Damacio Soares Silva.</p>
                <p><strong>Dízimo:</strong> Pe. Reginaldo.</p>
                <p><strong>Pascom:</strong> Pe. Jonas.</p>
                <p><strong>Familiar:</strong> Diácono Francisco das Chagas.</p>
                <p><strong>Saúde:</strong> Ir. Ailce.</p>
                <p><strong>Juventude:</strong> Pe. Adriano.</p>
                <p><strong>Educação:</strong> Sem informações.</p>
                <p><strong>Pessoa Idosa:</strong> Sem informações.</p>
                <p><strong>Sobriedade:</strong> Sem informações.</p>
                <p><strong>Litúrgica:</strong> Sem informações.</p>
              </div>
            </div>

            {/* COLUNA 3: Social, Movimentos e Comunidades */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2 text-blue-700">
                  <MessageSquare className="w-5 h-5" /> Movimentos e Missão
                </h3>
                <div className="text-sm space-y-3 text-zinc-600 dark:text-zinc-400">
                  <div>
                    <p><strong>Coordenação de Movimentos:</strong> Pe. José Aurenilson Carvalho.</p>
                    <p className="italic text-[10px] mt-1">Apostolado da Oração, Legião de Maria, Homens do Terço, Mães que Oram, RCC, Shalom e Mensageiro das Chagas.</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <p><strong>PJR (Juventude Rural):</strong> Pe. Machado.</p>
                    <p><strong>CPT (Terra):</strong> Pe. Maurizio Cremaschi.</p>
                    <p><strong>Cáritas Diocesana:</strong> Pe. Raimundo Feitosa (Pe. Neto).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Extra: Comunidades e Descrições Sociais (Abaixo da Grid) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
              <h4 className="font-bold text-blue-700 mb-2">Cáritas e Pastorais Sociais</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Atuação na promoção social, defesa de direitos, convivência com o semiárido, agricultura familiar e apoio a populações vulneráveis. Inclui a <strong>CPT</strong> (luta por justiça social e defesa da terra) e a <strong>PJR</strong> (foco na juventude do meio rural).
              </p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
              <h4 className="font-bold text-blue-700 mb-2">Comunidades Eclesiais Missionárias</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Metodologia eclesial que busca fazer de toda a Igreja um povo de discípulos missionários, que vive a fé em comunhão e a irradia no mundo por meio do testemunho, da liturgia e da ação social.
              </p>
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