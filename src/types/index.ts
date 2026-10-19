export interface Categoria {
  id: string
  nome: string
  slug: string
  cor?: string | null
  created_at?: string
}

export interface Noticia {
  id: string
  titulo: string
  subtitulo?: string | null
  slug: string
  conteudo: string
  imagem_capa_url?: string | null
  autor_id?: string | null
  publicado?: boolean | null
  data_publicacao: string
  created_at?: string | null
  categoria_id?: string | null
  categorias?: Categoria | null
}

export interface FotoNoticia {
  id: string
  noticia_id?: string | null
  url: string
  created_at?: string
}

export interface Paroquia {
  id: string
  nome: string
  slug: string
  cidade: string
  endereco: string
  telefone?: string | null
  email?: string | null
  horarios_missa?: any
  horarios_confissoes?: any
  redes_sociais?: any
  imagem_url?: string | null
  area?: string | null
  historico?: string | null
  created_at?: string
}

export interface Clero {
  id: string
  nome: string
  cargo: string
  paroquia_id?: string | null
  imagem_url?: string | null
  foto_url?: string | null
  data_ordenacao?: string | null
  email?: string | null
  aniversario_natalicio?: string | null
  biografia?: string | null
  ordem_exibicao?: number
  paroquias?: Paroquia | null
}

export interface Congregacao {
  id: string
  nome: string
  sigla?: string | null
  endereco?: string | null
  telefone?: string | null
  membros?: string | null
  imagem_url?: string | null
  carisma?: string | null
  cidade?: string | null
}

export interface ReligiosaMembro {
  id: string
  nome: string
  cargo?: string | null
  biografia?: string | null
  foto_url?: string | null
  congregacao_id?: string | null
  congregacoes?: Congregacao | null
}

export interface Evento {
  id: string
  titulo: string
  data_evento: string // 'YYYY-MM-DD'
  hora_evento?: string | null // 'HH:MM:SS'
  local?: string | null
  descricao?: string | null
  link_inscricao?: string | null
  created_at?: string | null
  noticia_id?: string | null
  tipo_modalidade?: 'presencial' | 'virtual' | 'hibrido' | string | null
  local_presencial?: string | null
  link_virtual?: string | null
}

export interface PalavraPastor {
  id: string
  titulo: string
  tipo: 'video' | 'nota'
  url_youtube?: string | null
  conteudo_nota?: string | null
  imagem_destaque?: string | null
  data_publicacao?: string | null
  created_at?: string
}

export interface Institucional {
  id: string
  chave?: string | null
  titulo?: string | null
  conteudo_html?: string | null
  dados_json?: any | null
  updated_at?: string
}