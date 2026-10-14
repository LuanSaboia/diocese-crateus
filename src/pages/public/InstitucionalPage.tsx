import { useState } from "react"
import { History, Landmark, Users, ShieldCheck, BookOpen, MessageSquare, Heart, MapPin, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// IMPORTAÇÃO DOS DADOS ISOLADOS
import { BISPOS_HISTORICOS, CURIA_MEMBROS, PROJETOS_SOCIAIS, type BispoHistorico } from "@/data/institucionalData"

export function InstitucionalPage() {
  const bispoAtual = BISPOS_HISTORICOS.find(b => b.isAtual)
  const bisposAnteriores = BISPOS_HISTORICOS.filter(b => !b.isAtual)

  return (
    <div className="bg-[#ffffff] dark:bg-[#09090b] min-h-screen pb-16 font-sans text-[#09090b] dark:text-[#fafafa]">
      
      {/* BANNER PRINCIPAL */}
      <div className="bg-[#f4f4f5] dark:bg-[#18181b] border-b border-[#e4e4e7] dark:border-[#27272a] py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            A Diocese de Crateús
          </h1>
          <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] max-w-2xl">
            Uma Igreja Particular missionária a serviço do Povo de Deus no sertão cearense desde 1964.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 space-y-14">

        {/* SECÇÃO 1: HISTÓRIA & BISPOS */}
        <section id="historia" className="space-y-8">
          <div className="flex items-center gap-2.5 border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
            <History className="w-5 h-5 text-[#2563eb]" />
            <h2 className="text-xl font-bold tracking-tight">Nossa Caminhada e Bispos Diocesanos</h2>
          </div>

          <p className="text-sm text-[#3f3f46] dark:text-[#d4d4d8] leading-relaxed">
            Criada pelo <strong>Papa Paulo VI em 28 de setembro de 1963</strong>, a Diocese de Crateús é fruto do desmembramento das dioceses de Iguatu e Sobral.
            Instalada em 9 de agosto de 1964, teve em Dom Antônio Batista Fragoso sua grande referência inicial, moldando uma identidade de profunda fé, resistência e compromisso social.
          </p>

          {/* BISPO ATUAL (EM DESTAQUE MAIOR) */}
          {bispoAtual && (
            <Card className="border-2 border-[#2563eb] bg-[#ffffff] dark:bg-[#18181b] rounded-2xl overflow-hidden shadow-md">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] shrink-0 border-2 border-[#2563eb] shadow-sm flex items-center justify-center">
                  <img
                    src={bispoAtual.foto}
                    alt={bispoAtual.nome}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <Badge className="bg-[#2563eb] text-[#ffffff] hover:bg-[#2563eb] text-xs font-semibold">
                      {bispoAtual.status}
                    </Badge>
                    <span className="text-xs font-bold text-[#71717a]">{bispoAtual.periodo}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa]">
                    {bispoAtual.nome}
                  </h3>

                  <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                    {bispoAtual.descricao}
                  </p>

                  <div className="pt-2 flex items-center justify-center md:justify-start gap-3 text-xs text-[#3f3f46] dark:text-[#d4d4d8]">
                    <img
                      src={bispoAtual.brasao}
                      alt="Brasão Episcopal"
                      className="w-8 h-8 object-contain shrink-0"
                    />
                    <span className="italic font-serif">"{bispoAtual.lema}"</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* BISPOS ANTERIORES (GRAYSCALE -> CORES NO HOVER) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">
              Bispos Anteriores
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bisposAnteriores.map((bispo, idx) => (
                <BispoAnteriorCard key={idx} bispo={bispo} />
              ))}
            </div>
          </div>
        </section>

        {/* SECÇÃO 2: CÚRIA DIOCESANA */}
        <section id="curia" className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
            <Landmark className="w-5 h-5 text-[#2563eb]" />
            <h2 className="text-xl font-bold tracking-tight">Cúria Diocesana</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURIA_MEMBROS.map((item, i) => (
              <Card key={i} className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
                <CardContent className="p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                    {item.cargo}
                  </span>
                  <p className="font-semibold text-sm text-[#09090b] dark:text-[#fafafa]">
                    {item.nome}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="bg-[#e4e4e7] dark:bg-[#27272a]" />

        {/* SECÇÃO 3: PASTORAIS E ORGANIZAÇÃO */}
        <section id="pastorais" className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
            <Users className="w-5 h-5 text-[#2563eb]" />
            <h2 className="text-xl font-bold tracking-tight">Pastorais, Setores e Movimentos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
              <CardHeader className="pb-2 border-b border-[#f4f4f5] dark:border-[#27272a]">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#09090b] dark:text-[#fafafa]">
                  <ShieldCheck className="w-4 h-4 text-[#2563eb]" /> Coordenação & Conselhos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2 text-[#71717a] dark:text-[#a1a1aa]">
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Coordenação de Pastoral:</strong> Pe. Akino Vasconcelos, Fátima Veras e Ir. Elza.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">CDP:</strong> Conselho Diocesano de Pastoral.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">COMIDI:</strong> Bispo Dom Ailton e Ir. Sônia.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">CAE:</strong> Comissão de Assuntos Econômicos.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Consultores:</strong> Conselho Presbiteral e de Consultores.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Equipe de Campanhas:</strong> Pe. Cícero.</p>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
              <CardHeader className="pb-2 border-b border-[#f4f4f5] dark:border-[#27272a]">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#09090b] dark:text-[#fafafa]">
                  <BookOpen className="w-4 h-4 text-[#2563eb]" /> Setores de Formação
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2 text-[#71717a] dark:text-[#a1a1aa]">
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Catequese:</strong> Pe. José Damacio Soares Silva.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Dízimo:</strong> Pe. Reginaldo.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Pascom:</strong> Pe. Jonas.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Familiar:</strong> Diácono Francisco das Chagas.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Saúde:</strong> Ir. Ailce.</p>
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Juventude:</strong> Pe. Adriano.</p>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
              <CardHeader className="pb-2 border-b border-[#f4f4f5] dark:border-[#27272a]">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#09090b] dark:text-[#fafafa]">
                  <MessageSquare className="w-4 h-4 text-[#2563eb]" /> Movimentos & Missão
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2 text-[#71717a] dark:text-[#a1a1aa]">
                <p><strong className="text-[#09090b] dark:text-[#fafafa]">Coordenação de Movimentos:</strong> Pe. José Aurenilson Carvalho.</p>
                <p className="italic text-[11px] leading-relaxed">
                  Apostolado da Oração, Legião de Maria, Homens do Terço, Mães que Oram, RCC, Shalom e Mensageiro das Chagas.
                </p>
                <div className="pt-2 border-t border-[#f4f4f5] dark:border-[#27272a] space-y-1">
                  <p><strong className="text-[#09090b] dark:text-[#fafafa]">PJR (Juventude Rural):</strong> Pe. Machado.</p>
                  <p><strong className="text-[#09090b] dark:text-[#fafafa]">CPT (Terra):</strong> Pe. Maurizio Cremaschi.</p>
                  <p><strong className="text-[#09090b] dark:text-[#fafafa]">Cáritas Diocesana:</strong> Pe. Raimundo Feitosa (Pe. Neto).</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECÇÃO 4: PROJETOS SOCIAIS E VOCACIONAL */}
        <section id="projetos" className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
            <Heart className="w-5 h-5 text-[#2563eb]" />
            <h2 className="text-xl font-bold tracking-tight">Projetos Sociais e Formação Vocacional</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJETOS_SOCIAIS.map((proj, idx) => (
              <Card key={idx} className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm">
                <CardContent className="p-4 space-y-1.5">
                  <h4 className="font-bold text-sm text-[#09090b] dark:text-[#fafafa]">
                    {proj.titulo}
                  </h4>
                  <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                    {proj.descricao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#18181b] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-sm text-[#09090b] dark:text-[#fafafa]">Casas de Formação Vocacional</h4>
                <p className="text-[#71717a] dark:text-[#a1a1aa]"><strong>Casa Vocacional:</strong> Rua José Regino, 692 - Venâncio, Crateús - CE.</p>
                <p className="text-[#71717a] dark:text-[#a1a1aa]"><strong>Seminário em Fortaleza:</strong> Rua Conselheiro Tristão, 73 - Centro, Fortaleza - CE.</p>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </div>
  )
}

// SUBCOMPONENTE DOS BISPOS ANTERIORES
function BispoAnteriorCard({ bispo }: { bispo: BispoHistorico }) {
  const [fotoErro, setFotoErro] = useState(false)
  const [brasaoErro, setBrasaoErro] = useState(false)

  return (
    <Card className="group border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm hover:border-[#2563eb] transition-all">
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a] shrink-0 border border-[#e4e4e7] dark:border-[#27272a] group-hover:border-[#2563eb] transition-all flex items-center justify-center">
            {!fotoErro ? (
              <img
                src={bispo.foto}
                alt={bispo.nome}
                onError={() => setFotoErro(true)}
                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <User className="w-6 h-6 text-[#a1a1aa]" />
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#09090b] dark:text-[#fafafa] leading-tight group-hover:text-[#2563eb] transition-colors">
              {bispo.nome}
            </h4>
            <p className="text-[11px] font-semibold text-[#71717a] mt-0.5">
              {bispo.periodo}
            </p>
          </div>
        </div>

        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          {bispo.descricao}
        </p>
      </div>

      <div className="p-3 bg-[#f4f4f5] dark:bg-[#27272a] border-t border-[#e4e4e7] dark:border-[#27272a] flex items-center gap-2.5">
        <img
          src={!brasaoErro ? bispo.brasao : "/src/assets/brasoes/default.svg"}
          alt="Brasão Episcopal"
          onError={() => setBrasaoErro(true)}
          className="w-7 h-7 object-contain shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <p className="text-[11px] italic text-[#3f3f46] dark:text-[#d4d4d8] leading-tight font-serif">
          "{bispo.lema}"
        </p>
      </div>
    </Card>
  )
}