export interface OpcaoLeitura {
  referencia?: string
  titulo?: string
  refrao?: string
  texto: string
}

export interface Leitura {
  ordem: number
  tipo: "leitura" | "salmo" | "evangelho" | "extra" | string
  rotulo: string
  opcoes: OpcaoLeitura[]
}

export interface Oracoes {
  coleta?: string
  oferendas?: string
  comunhao?: string
  extras?: { titulo: string; texto: string }[]
}

export interface Antifonas {
  entrada?: string
  comunhao?: string
}

export interface Celebracao {
  id: string
  liturgia: string
  cor: "Verde" | "Vermelho" | "Roxo" | "Rosa" | "Branco" | string
  principal: boolean
  oracoes?: Oracoes
  antifonas?: Antifonas
  leituras: Leitura[]
}

export interface LiturgiaResponse {
  data: string
  celebracoes: Celebracao[]
  erro?: string
}