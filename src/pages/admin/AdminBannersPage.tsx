import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { Banner, Noticia } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Newspaper, Info } from "lucide-react"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Tipo de destino no formulário
  const [tipoDestino, setTipoDestino] = useState<"link" | "noticia">("link")
  // Controla se quer personalizar a imagem da notícia ou usar a capa original
  const [usarImagemCustomizada, setUsarImagemCustomizada] = useState(false)

  const [formData, setFormData] = useState<Partial<Banner>>({
    titulo: "",
    subtitulo: "",
    imagem_url: "",
    link_destino: "",
    texto_botao: "Saiba mais",
    cor_fundo: "from-blue-600 to-indigo-700",
    ativo: true,
    ordem: 0
  })

  const loadData = async () => {
    setLoading(true)
    const { data: bData } = await supabase.from("banners").select("*").order("ordem", { ascending: true })
    const { data: nData } = await supabase.from("noticias").select("id, titulo, subtitulo, slug").eq("publicado", true).order("created_at", { ascending: false })

    if (bData) setBanners(bData as Banner[])
    if (nData) setNoticias(nData as Noticia[])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingBanner(null)
    setTipoDestino("link")
    setUsarImagemCustomizada(false)
    setFormData({
      titulo: "",
      subtitulo: "",
      imagem_url: "",
      link_destino: "",
      texto_botao: "Saiba mais",
      cor_fundo: "from-blue-600 to-indigo-700",
      ativo: true,
      ordem: 0
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Banner) => {
    setEditingBanner(item)
    const isNoticia = item.link_destino.startsWith("/noticias/")
    setTipoDestino(isNoticia ? "noticia" : "link")
    setUsarImagemCustomizada(!!item.imagem_url)

    setFormData({
      titulo: item.titulo,
      subtitulo: item.subtitulo || "",
      imagem_url: item.imagem_url || "",
      link_destino: item.link_destino,
      texto_botao: item.texto_botao || "Saiba mais",
      cor_fundo: item.cor_fundo || "from-blue-600 to-indigo-700",
      ativo: item.ativo ?? true,
      ordem: item.ordem || 0
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Se for notícia e não optou por imagem customizada, garante que imagem_url vá como null/vazio limpo
    const payload = {
      ...formData,
      imagem_url: (tipoDestino === "noticia" && !usarImagemCustomizada) ? null : formData.imagem_url
    }

    try {
      if (editingBanner) {
        await supabase.from("banners").update(payload).eq("id", editingBanner.id)
      } else {
        await supabase.from("banners").insert(payload)
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      console.error("Erro ao salvar banner:", err)
    } finally {
      setSaving(false)
    }
  }

  const toggleAtivo = async (id: string, ativoAtual: boolean) => {
    await supabase.from("banners").update({ ativo: !ativoAtual }).eq("id", id)
    loadData()
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from("banners").delete().eq("id", deleteId)
    setDeleting(false)
    setDeleteId(null)
    loadData()
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão de Banners & Campanhas
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Gerencie banners laterais das notícias, campanhas da diocese (Dízimo, Vocação) ou notícias fixadas.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Novo Banner
        </Button>
      </div>

      {/* TABELA DE BANNERS */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando banners...</div>
          ) : banners.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a] space-y-2">
              <ImageIcon className="w-8 h-8 text-[#a1a1aa] mx-auto" />
              <p>Nenhum banner cadastrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e4e4e7] dark:border-[#27272a]">
                  <TableHead className="text-xs">Título / Campanha</TableHead>
                  <TableHead className="text-xs">Destino</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((item) => (
                  <TableRow key={item.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                    <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa]">
                      <div className="space-y-0.5">
                        <p>{item.titulo}</p>
                        {item.subtitulo && <p className="text-[11px] text-[#71717a] font-normal">{item.subtitulo}</p>}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-[#71717a] max-w-xs truncate">
                      <span className="inline-flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-blue-600" />
                        {item.link_destino}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAtivo(item.id, !!item.ativo)}
                        className="h-7 px-2 text-[11px] gap-1.5"
                      >
                        {item.ativo ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Ativo</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-600 font-medium">Inativo</span>
                          </>
                        )}
                      </Button>
                    </TableCell>

                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                        <Pencil className="w-3.5 h-3.5 text-[#71717a]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* MODAL FORMULÁRIO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingBanner ? "Editar Banner" : "Novo Banner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            
            {/* SELEÇÃO DO TIPO DE DESTINO */}
            <div className="space-y-2 border border-[#e4e4e7] dark:border-[#27272a] rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Label className="font-semibold text-xs">Para onde o banner deve redirecionar?</Label>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="tipoDestino"
                    checked={tipoDestino === "link"}
                    onChange={() => {
                      setTipoDestino("link")
                      setUsarImagemCustomizada(true)
                    }}
                  />
                  <span>Link Externo / Chave PIX / Site</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="tipoDestino"
                    checked={tipoDestino === "noticia"}
                    onChange={() => {
                      setTipoDestino("noticia")
                      setUsarImagemCustomizada(false)
                    }}
                  />
                  <span>Fixar Notícia do Portal</span>
                </label>
              </div>

              {tipoDestino === "link" ? (
                <div className="space-y-1 pt-2">
                  <Label className="text-[11px]">URL de Destino *</Label>
                  <Input
                    type="url"
                    required
                    value={formData.link_destino || ""}
                    onChange={(e) => setFormData({ ...formData, link_destino: e.target.value })}
                    placeholder="https://diocesedecrateus.org.br/doe"
                    className="text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-1 pt-2">
                  <Label className="text-[11px]">Selecione a Notícia *</Label>
                  <Select
                    value={formData.link_destino ? formData.link_destino.replace("/noticias/", "") : ""}
                    onValueChange={(val) => {
                      const noti = noticias.find((n) => n.slug === val || n.id === val)
                      setFormData({
                        ...formData,
                        link_destino: `/noticias/${val}`,
                        titulo: noti?.titulo || formData.titulo || "",
                        subtitulo: noti?.subtitulo || formData.subtitulo || "",
                        texto_botao: "Ler matéria"
                      })
                    }}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Selecione uma matéria publicada..." />
                    </SelectTrigger>
                    <SelectContent>
                      {noticias.map((n) => (
                        <SelectItem key={n.id} value={n.slug || n.id}>
                          <span className="flex items-center gap-2">
                            <Newspaper className="w-3 h-3 text-blue-600" />
                            {n.titulo}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Título do Banner / Campanha *</Label>
              <Input
                required
                value={formData.titulo || ""}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Mãos Unidas pela Vocação"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Subtítulo / Descrição Curta (Opcional)</Label>
              <Input
                value={formData.subtitulo || ""}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                placeholder="Ex: Contribua com a formação dos nossos seminaristas"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Texto do Botão</Label>
                <Input
                  value={formData.texto_botao || "Saiba mais"}
                  onChange={(e) => setFormData({ ...formData, texto_botao: e.target.value })}
                  placeholder="Ex: Doar Agora, Saiba Mais, Ler Matéria"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Estilo / Cor do Fundo</Label>
                <Select
                  value={formData.cor_fundo || "from-blue-600 to-indigo-700"}
                  onValueChange={(val) => setFormData({ ...formData, cor_fundo: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-blue-600 to-indigo-700">🔵 Azul Diocesano</SelectItem>
                    <SelectItem value="from-emerald-600 to-teal-700">🟢 Verde Esperança</SelectItem>
                    <SelectItem value="from-amber-600 to-orange-700">🟠 Dourado / Festivo</SelectItem>
                    <SelectItem value="from-purple-600 to-indigo-800">🟣 Roxo Vocacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* IMAGEM DO BANNER OU CAPA DA NOTÍCIA */}
            <div className="space-y-2 border border-[#e4e4e7] dark:border-[#27272a] rounded-lg p-3">
              {tipoDestino === "noticia" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Imagem do Banner</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUsarImagemCustomizada(!usarImagemCustomizada)}
                      className="text-[11px] h-6 text-blue-600"
                    >
                      {usarImagemCustomizada ? "Usar capa da notícia" : "Enviar imagem personalizada"}
                    </Button>
                  </div>

                  {!usarImagemCustomizada ? (
                    <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 rounded-md text-[11px]">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>O portal usará automaticamente a <strong>imagem de capa oficial da notícia</strong> selecionada.</span>
                    </div>
                  ) : (
                    <ImageUploader
                      value={formData.imagem_url || ""}
                      folder="banners"
                      onChange={(url) => setFormData({ ...formData, imagem_url: url })}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label>Imagem / Arte do Banner (Opcional)</Label>
                  <ImageUploader
                    value={formData.imagem_url || ""}
                    folder="banners"
                    onChange={(url) => setFormData({ ...formData, imagem_url: url })}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Excluir Banner?"
        description="Tem certeza que deseja remover este banner?"
      />

    </div>
  )
}