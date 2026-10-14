export interface BispoHistorico {
  nome: string
  periodo: string
  status: string
  descricao: string
  lema: string
  foto: string
  brasao: string
  isAtual: boolean
}

export interface CuriaMembro {
  cargo: string
  nome: string
}

export interface ProjetoSocial {
  titulo: string
  descricao: string
}

export const BISPOS_HISTORICOS: BispoHistorico[] = [
  {
    nome: "Dom Antônio Fragoso",
    periodo: "1964 - 1998",
    status: "1º Bispo Diocesano",
    descricao: "Referência histórica na libertação camponesa, organização das comunidades de base e educação popular no sertão.",
    lema: "Opportet Illas adducere - (Também tenho de as conduzir)",
    foto: "/src/assets/bispos/fragoso.jpg",
    brasao: "/src/assets/brasoes/fragoso-brasao.png",
    isAtual: false
  },
  {
    nome: "Dom Jacinto Brito",
    periodo: "1998 - 2012",
    status: "2º Bispo Diocesano",
    descricao: "Atuação marcada pela expansão pastoral, estruturação das paróquias e fortalecimento da identidade eclesial.",
    lema: "In Verbo Tuo",
    foto: "/src/assets/bispos/jacinto.jpg",
    brasao: "/src/assets/brasoes/jacinto-brasao.png",
    isAtual: false
  },
  {
    nome: "Dom Ailton Menegussi",
    periodo: "2013 - Atual",
    status: "3º Bispo Diocesano (Atual)",
    descricao: "Liderança na celebração do Jubileu Diocesano, animação vocacional e renovação contínua das comunidades.",
    lema: "Basta-te a minha graça",
    foto: "/src/assets/bispos/ailton.jpg",
    brasao: "/src/assets/brasoes/ailton-brasao.png",
    isAtual: true
  }
]

export const CURIA_MEMBROS: CuriaMembro[] = [
  { cargo: "Bispo Diocesano", nome: "Dom Ailton Menegussi" },
  { cargo: "Vigário Geral", nome: "Pe. Denilson Furtado" },
  { cargo: "Chanceler", nome: "Pe. Raimundo Feitosa (Neto)" },
  { cargo: "Ecônomo", nome: "Pe. Antônio José Meneles" },
  { cargo: "Secretária da Cúria", nome: "Daiane Marques" },
  { cargo: "Tribunal Eclesiástico", nome: "Pe. Anderson Lima" },
  { cargo: "Contadora", nome: "Marcela Soares" },
]

export const PROJETOS_SOCIAIS: ProjetoSocial[] = [
  { titulo: "Cáritas Diocesana", descricao: "Promoção social, defesa de direitos e convivência com o semiárido. Presidência: Pe. Neto." },
  { titulo: "Comissão Pastoral da Terra (CPT)", descricao: "Apoio e assessoria aos trabalhadores rurais e defesa da justiça social no campo." },
  { titulo: "Projeto Paulo Freire", descricao: "Assessoria técnica para agricultores familiares no território diocesano." },
  { titulo: "Caminhos da Resiliência", descricao: "Projeto focado no apoio aos pescadores artesanais dos sertões de Crateús." },
]