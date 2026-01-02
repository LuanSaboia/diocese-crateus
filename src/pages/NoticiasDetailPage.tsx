import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, Share2, Copy, Mail, MessageCircle, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function NoticiasDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [noticia, setNoticia] = useState<any>(null)
  const [galeria, setGaleria] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [relacionadas, setRelacionadas] = useState<any[]>([])

  useEffect(() => {
    async function fetchNoticia() {
      setLoading(true)

      const { data, error } = await supabase
        .from('noticias')
        .select('*, categorias(id, nome, cor)')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setNoticia(data)

      // 1. Busca Fotos da Galeria
      const { data: fotos } = await supabase
        .from('fotos_noticias')
        .select('url')
        .eq('noticia_id', data.id)
      if (fotos) setGaleria(fotos)

      // 2. Busca Notícias Relacionadas (mesma categoria, limit 3)
      if (data.categoria_id) {
        const { data: rel } = await supabase
          .from('noticias')
          .select('*, categorias(nome, cor)')
          .eq('categoria_id', data.categoria_id)
          .neq('id', data.id) // Não mostrar a notícia atual
          .eq('publicado', true)
          .order('data_publicacao', { ascending: false })
          .limit(3)

        if (rel) setRelacionadas(rel)
      }

      setLoading(false)
      window.scrollTo(0, 0) // Volta ao topo ao trocar de notícia
    }
    fetchNoticia()
  }, [slug])

  // FUNÇÃO DE COMPARTILHAR
  const handleShare = async () => {
    const shareData = {
      title: noticia.titulo,
      text: noticia.subtitulo,
      url: window.location.href,
    }

    // Tenta usar o compartilhamento nativo do celular
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Erro ao compartilhar', err)
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copiado para a área de transferência!")
  }

  if (loading) return <div className="p-20 text-center italic text-primary font-serif">Carregando notícia...</div>
  if (!noticia) return <div className="p-20 text-center">Notícia não encontrada.</div>

  return (
    <article className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="hover:text-primary transition-colors mb-4 group"
      >
        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Voltar para notícias
      </Button>

      <header className="space-y-6">
        {/* EXIBIÇÃO DA CATEGORIA */}
        {noticia.categorias && (
          <Badge className={`border-none shadow-md px-4 py-1 text-[10px] font-black uppercase tracking-widest ${noticia.categorias.cor}`}>
            {noticia.categorias.nome}
          </Badge>
        )}

        <h1 className="text-3xl md:text-5xl font-bold italic text-zinc-900 dark:text-zinc-100 leading-tight">
          {noticia.titulo}
        </h1>

        <p className="text-xl text-zinc-500 font-light leading-relaxed border-l-4 border-secondary pl-6">
          {noticia.subtitulo}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-bold uppercase tracking-tighter">
            <Calendar className="w-4 h-4 text-secondary" />
            Postado em {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>

          {/* BOTÃO DE PARTILHAR COM MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
                Partilhar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleShare} className="gap-2 cursor-pointer">
                <Share2 className="w-4 h-4" /> Enviar para...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(noticia.titulo + ' ' + window.location.href)}`)} className="gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`mailto:?subject=${noticia.titulo}&body=${window.location.href}`)} className="gap-2 cursor-pointer">
                <Mail className="w-4 h-4 text-red-500" /> E-mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4 text-blue-500" /> Copiar Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Imagem de Capa */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative">
        <img
          src={noticia.imagem_capa_url}
          alt={noticia.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="prose prose-zinc dark:prose-invert max-w-none lg:prose-xl mt-10
                   prose-headings:text-primary prose-headings:italic prose-a:text-secondary 
                   prose-blockquote:border-primary"
        dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
      />

      {/* Galeria de Fotos (Mantida a lógica original com ajuste visual) */}
      {galeria.length > 0 && (
        <section className="pt-20 space-y-10">
          <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-zinc-100" />
            <h2 className="text-3xl font-bold italic text-primary px-4">Galeria do Evento</h2>
            <Separator className="flex-1 bg-zinc-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galeria.map((foto, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-[2rem] bg-zinc-100 hover:opacity-90 transition-all cursor-pointer shadow-lg border-4 border-white dark:border-zinc-800"
                onClick={() => window.open(foto.url, '_blank')}
              >
                <img
                  src={foto.url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {relacionadas.length > 0 && (
        <section className="pt-20 border-t border-zinc-100">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-2">Continue lendo</h3>
              <h2 className="text-4xl font-bold italic text-primary">Relacionados</h2>
            </div>
            <Link to="/noticias" className="text-zinc-400 hover:text-primary flex items-center gap-2 text-sm font-bold uppercase transition-colors">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relacionadas.map((rel) => (
              <Link key={rel.id} to={`/noticias/${rel.slug}`} className="group space-y-4">
                <div className="aspect-video overflow-hidden rounded-2xl relative shadow-sm">
                  <img src={rel.imagem_url || rel.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {rel.categorias && (
                    <Badge className={`absolute top-3 left-3 border-none text-[9px] ${rel.categorias.cor}`}>
                      {rel.categorias.nome}
                    </Badge>
                  )}
                </div>
                <div>
                  <h4 className="font-bold italic text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {rel.titulo}
                  </h4>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase mt-2">{new Date(rel.data_publicacao).toLocaleDateString('pt-BR')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}