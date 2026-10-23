export interface Album {
  id: string
  titulo: string
  descricao?: string
  capa_url: string
  data_evento: string
  destaque_home?: boolean
  created_at?: string
  total_fotos?: number
}

export interface FotoAlbum {
  id: string
  album_id: string
  imagem_url: string
  legenda?: string
  ordem?: number
}