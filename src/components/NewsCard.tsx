import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface NewsCardProps {
  title: string
  excerpt?: string
  date: string
  category: any
  image: string
  onClick?: () => void
}

export function NewsCard({ title, excerpt, date, category, image, onClick }: NewsCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden group cursor-pointer border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-zinc-950 flex flex-col h-full relative"
    >
      <div className="aspect-video overflow-hidden relative">
        <img
          src={image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3"}
          alt={title}
          /* O grayscale só afeta a imagem agora */
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
        />

        {/* Badge posicionada ABSOLUTAMENTE e com Z-INDEX alto para ignorar filtros da imagem */}
        {category && (
          <div className="absolute top-4 left-4 z-30">
            <Badge
              variant="outline"
              className={`shadow-sm uppercase text-[10px] px-3 py-1 tracking-wider border-2 ${category.cor}`}
            >
              {category.nome}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
          <Calendar className="w-3 h-3 text-secondary" />
          {date}
        </div>
        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors italic line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1">
        <p className="text-zinc-500 text-sm line-clamp-3 font-light leading-relaxed">
          {excerpt}
        </p>
        <div className="mt-4 text-xs font-black uppercase tracking-tighter text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          Ler mais +
        </div>
      </CardContent>
    </Card>
  )
}