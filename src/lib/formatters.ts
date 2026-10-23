/**
 * Converte números de versículos no texto (ex: 14eu, 15de) em sobrescritos (ex: ¹⁴eu, ¹⁵de)
 */
export function formatarVersiculos(texto: string): string {
  if (!texto) return ""

  const numerosSobrescritos: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹"
  }

  // Regex encontra números que antecedem versículos no texto bíblico
  return texto.replace(/\b(\d+)(?=[a-zA-Lá-úÁ-Ú]|[\s])/g, (_, num) => {
    return num
      .split("")
      .map((digito: string) => numerosSobrescritos[digito] || digito)
      .join("")
  })
}