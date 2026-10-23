export interface ProjetoDiocesano {
  id: string
  slug: string
  nome: string
  descricao_curta: string
  imagem_capa_url: string
  link_externo?: string | null
  permite_doacao?: boolean
  permite_inscricao?: boolean
  ordem?: number
}