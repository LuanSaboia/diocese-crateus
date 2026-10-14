import { useState } from "react"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string) => void
  folder?: string
}

export function ImageUploader({ value, onChange, folder = "geral" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo de ficheiro
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida (PNG, JPG, WEBP).")
      return
    }

    // Validação de tamanho máximo (ex: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.")
      return
    }

    try {
      setUploading(true)

      // Nome do ficheiro único para evitar sobreposição
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obter URL pública do ficheiro enviado
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      onChange(data.publicUrl)
      toast.success("Imagem enviada com sucesso!")
    } catch (err: any) {
      toast.error("Erro ao enviar imagem: " + (err.message || "Tente novamente."))
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[#e4e4e7] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#27272a] group">
          <img
            src={value}
            alt="Pré-visualização"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-1.5 text-xs font-semibold"
            >
              <X className="w-4 h-4" /> Remover Imagem
            </Button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-[#e4e4e7] dark:border-[#27272a] hover:border-[#2563eb] rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#ffffff] dark:bg-[#18181b]">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-xs text-[#71717a]">
              <Loader2 className="w-6 h-6 animate-spin text-[#2563eb]" />
              <span>A enviar imagem...</span>
            </div>
          ) : (
            <>
              <div className="w-9 h-9 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center border border-[#e4e4e7] dark:border-[#27272a]">
                <Upload className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#09090b] dark:text-[#fafafa]">
                  Clique para selecionar uma imagem
                </p>
                <p className="text-[11px] text-[#71717a]">
                  PNG, JPG ou WEBP até 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </>
          )}
        </label>
      )}
    </div>
  )
}