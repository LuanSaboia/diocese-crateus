import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface NewsCardProps {
  title: string
  excerpt?: string
  date: string
  category: string
  image: string
  onClick?: () => void
}

export function NewsCard({ title, excerpt, date, category, image, onClick }: NewsCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden group cursor-pointer border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-xl transition-all duration-300"
    >
      {/* Imagem com efeito de zoom ao passar o mouse */}
      <div className="aspect-video overflow-hidden">
        <img 
          src={image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
        </div>
        <CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <div className="mt-4 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Ler notícia completa →
        </div>
      </CardContent>
    </Card>
  )
}