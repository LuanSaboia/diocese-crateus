import { useEffect, useState } from "react"
import type { LiturgiaResponse, Celebracao } from "@/types/liturgia"

export function useLiturgia(dataSelecionada?: Date) {
  const [dataLiturgia, setDataLiturgia] = useState<LiturgiaResponse | null>(null)
  const [celebracaoAtiva, setCelebracaoAtiva] = useState<Celebracao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLiturgia() {
      try {
        setLoading(true)

        // Se uma data for informada, monta o parâmetro DD-MM-AAAA
        let endpoint = "https://liturgia.up.railway.app/v3/"

        if (dataSelecionada) {
          const dia = String(dataSelecionada.getDate()).padStart(2, "0")
          const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0")
          const ano = dataSelecionada.getFullYear()
          endpoint = `https://liturgia.up.railway.app/v3/${dia}-${mes}-${ano}`
        }

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error("Falha ao carregar a liturgia para esta data")
        }

        const resData: LiturgiaResponse = await response.json()
        setDataLiturgia(resData)

        if (resData.celebracoes && resData.celebracoes.length > 0) {
          // Se houver mais de uma opção, prioriza a Memória do Santo
          const celebracaoSanto = resData.celebracoes.find(
            (c) => !c.id.includes("tempo-comum") && !c.principal
          )

          const escolhida =
            celebracaoSanto ||
            resData.celebracoes.find((c) => c.principal) ||
            resData.celebracoes[0]

          setCelebracaoAtiva(escolhida)
        }
      } catch (err: any) {
        console.error("Erro ao buscar liturgia v3:", err)
        setError(err.message || "Erro ao carregar a liturgia")
      } finally {
        setLoading(false)
      }
    }

    fetchLiturgia()
  }, [dataSelecionada])

  return {
    dataLiturgia,
    celebracaoAtiva,
    setCelebracaoAtiva,
    loading,
    error
  }
}