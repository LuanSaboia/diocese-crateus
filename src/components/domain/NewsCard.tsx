import { Link } from "react-router-dom"
import { Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Noticia } from "@/types"

interface NewsCardProps {
  item: Noticia
}

export function NewsCard({ item }: NewsCardProps) {
  const imagemCapa = item.imagem_capa_url || item.imagem_url

  return (
    <Link to={`/noticias/${item.slug}`} className="group block h-full">
      <Card className="h-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] overflow-hidden rounded-xl flex flex-col shadow-sm hover:shadow-md transition-all">
        
        {/* Foto de Capa */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f4f4f5] dark:bg-[#27272a]">
          {imagemCapa ? (
            <img 
              src={imagemCapa} 
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#a1a1aa] text-xs">
              Sem imagem
            </div>
          )}

          {item.categorias && (
            <Badge className={`absolute top-3 left-3 border-none text-[10px] ${item.categorias.cor || 'bg-[#2563eb] text-[#ffffff]'}`}>
              {item.categorias.nome}
            </Badge>
          )}
        </div>

        <CardHeader className="p-4 pb-2 space-y-2">
          {item.data_publicacao && (
            <div className="flex items-center gap-1.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{new Date(item.data_publicacao).toLocaleDateString('pt-BR')}</span>
            </div>
          )}

          <CardTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb] transition-colors leading-snug line-clamp-2">
            {item.titulo}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
            {item.subtitulo || item.resumo || item.conteudo?.replace(/<[^>]*>?/gm, '') || ""}
          </p>

          <div className="pt-3 border-t border-[#f4f4f5] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#09090b] dark:text-[#fafafa] group-hover:text-[#2563eb]">
            <span>Ler notícia</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}