import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { Album, FotoAlbum } from "@/types/galeria"

export function useGaleria() {
  const [albuns, setAlbuns] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlbuns() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("albuns")
          .select("*, fotos_album(count)")
          .order("data_evento", { ascending: false })

        if (error) {
          console.warn("Tabela de álbuns ainda não criada ou sem dados:", error.message)
          setAlbuns([])
        } else if (data) {
          const formatados = data.map((item: any) => ({
            ...item,
            total_fotos: item.fotos_album?.[0]?.count || 0
          }))
          setAlbuns(formatados)
        }
      } catch (err) {
        console.error("Erro ao buscar galerias:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbuns()
  }, [])

  return { albuns, loading }
}

export function useAlbumDetail(albumId?: string) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [fotos, setFotos] = useState<FotoAlbum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!albumId) return

    async function fetchDetail() {
      try {
        setLoading(true)
        const { data: aData } = await supabase
          .from("albuns")
          .select("*")
          .eq("id", albumId)
          .single()

        const { data: fData } = await supabase
          .from("fotos_album")
          .select("*")
          .eq("album_id", albumId)
          .order("ordem", { ascending: true })

        if (aData) setAlbum(aData as Album)
        if (fData) setFotos(fData as FotoAlbum[])
      } catch (err) {
        console.error("Erro ao carregar fotos do álbum:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [albumId])

  return { album, fotos, loading }
}