import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight, Heart } from "lucide-react"

// Exemplo de dados iniciais enquanto não estiver buscando do Supabase
const PROJETOS_EXEMPLO = [
  {
    id: "1",
    slug: "caritas-diocesana",
    nome: "Cáritas Diocesana",
    descricao_curta: "Atua em defesa dos direitos humanos, fortalecendo a solidariedade e a vida digna no semiárido cearense.",
    imagem_capa_url: "https://instagram.fjdo10-1.fna.fbcdn.net/v/t51.82787-19/627536151_18345923941232585_1286162586093240221_n.jpg?_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=GBdxZyXJ75dHhS1BAJ0-fMMOXtkRbmNDAQAB0j-ccb7-5&ccb=7-5&_nc_sid=669407&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45MDYuQzMifQ%3D%3D&_nc_ohc=S-gixHuRRGAQ7kNvwFuTLIk&_nc_oc=Adoy4dwuagZROuilY4ZuWvWGhZuflDqLOFnkV-Ft3SU8Lg5Kr9N4_1unvdE74v7mkcwVMM982IzBbFeDNDNSreMH&_nc_zt=24&_nc_ht=instagram.fjdo10-1.fna&_nc_gid=LuBxrlSJheafr_-ZlxC3Hg&_nc_ss=7b6a8&oh=00_AQNpuYpaD1GgcOj0zNUFTquG5SLxaJpf4aGLN002yIZokw&oe=6AE13C86",
    link_externo: "https://caritasdecrateus.org.br/", // Leva pro site oficial
  },
  {
    id: "2",
    slug: "maos-unidas",
    nome: "Grupo Mãos Unidas Pelas Vocações",
    descricao_curta: "Ajude na formação dos futuros padres da diocese por meio de suporte financeiro e material.",
    imagem_capa_url: "https://scontent.fjdo1-1.fna.fbcdn.net/v/t39.30808-6/309024393_468423308659993_7576286219831890283_n.png?stp=dst-png&cstp=mx2048x2048&ctp=s2048x2048&_nc_cat=102&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFoLomuRKrc-nV6MGmSAIg00GNAZEkT46vQY0BkSRPjq1wEXGFmyZbndIl9vzBbHBCmJ34bkBx-iBo8uxnd1kba&_nc_ohc=1SAN5eFaeuUQ7kNvwG_aKy4&_nc_oc=AdpL-GtqldMgOtMon0qcPu2VNCLqjKyK_T0_tgfiFqroqgg80v2XtCj-V9Dop9IbCbcfDmPzBGxdldLfnYbbflxj&_nc_zt=23&_nc_ht=scontent.fjdo1-1.fna&_nc_gid=qyVgfcvqbr2BM07sDUrV5w&_nc_ss=7b2a8&oh=00_AQN3hTtyaLoy_ImCxBFjjmAMoFDK-OsNtYg357B-UpacZQ&oe=6AE12851",
    link_externo: null, // Leva para a página estática /projetos/maos-unidas
    permite_doacao: true,
  },
  {
    id: "3",
    slug: "pascom-diocesana",
    nome: "Pascom Diocesana",
    descricao_curta: "Pastoral da Comunicação a serviço da evangelização e da informação no território diocesano.",
    imagem_capa_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    link_externo: null,
  }
]

export function ProjetosSection() {
  return (
    <section className="space-y-6">
      
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex justify-between items-end border-b border-[#e4e4e7] dark:border-[#27272a] pb-3">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-[#2563eb]">
            Evangelização & Ação Social
          </Badge>
          <h3 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa] tracking-tight">
            Iniciativas & Projetos Diocesanos
          </h3>
        </div>

        {/* <Link
          to="/projetos"
          className="text-[#2563eb] hover:underline flex items-center gap-1 text-xs font-bold uppercase tracking-wider hidden sm:flex"
        >
          Ver todos os projetos <ArrowRight className="w-3.5 h-3.5" />
        </Link> */}
      </div>

      {/* GRID DE CARDS CLICÁVEIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJETOS_EXEMPLO.map((projeto) => {
          const isExternal = Boolean(projeto.link_externo)

          // Conteúdo do Card
          const CardBody = (
            <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] overflow-hidden rounded-2xl flex flex-col shadow-sm hover:shadow-md hover:border-[#2563eb] transition-all group cursor-pointer">
              
              {/* CAPA DA FOTO */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a]">
                <img
                  src={projeto.imagem_capa_url}
                  alt={projeto.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* BADGE INDICADOR */}
                <div className="absolute top-3 right-3">
                  {isExternal ? (
                    <Badge className="bg-black/70 backdrop-blur-sm text-white text-[10px] border-none gap-1">
                      Site Próprio <ExternalLink className="w-3 h-3" />
                    </Badge>
                  ) : projeto.permite_doacao ? (
                    <Badge className="bg-emerald-600 text-white text-[10px] border-none gap-1">
                      <Heart className="w-3 h-3 fill-white" /> Doações
                    </Badge>
                  ) : null}
                </div>
              </div>

              {/* TEXTO E TÍTULO */}
              <CardHeader className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors leading-snug flex items-center justify-between">
                    <span>{projeto.nome}</span>
                  </CardTitle>

                  <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
                    {projeto.descricao_curta}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f4f4f5] dark:border-[#27272a] flex items-center gap-1 text-xs font-semibold text-[#2563eb]">
                  <span>{isExternal ? "Acessar portal oficial" : "Conhecer e participar"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>
            </Card>
          )

          // Se tiver link externo (Cáritas), usa <a>, senão usa <Link> interno
          if (isExternal) {
            return (
              <a key={projeto.id} href={projeto.link_externo!} target="_blank" rel="noopener noreferrer">
                {CardBody}
              </a>
            )
          }

          return (
            <Link key={projeto.id} to={`/projetos/${projeto.slug}`}>
              {CardBody}
            </Link>
          )
        })}
      </div>

    </section>
  )
}