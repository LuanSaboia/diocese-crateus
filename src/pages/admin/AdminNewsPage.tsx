import { useState } from "react"
import { useAdminNoticias } from "@/hooks/useAdminNoticias"
import { usePagination } from "@/hooks/usePagination"
import type { Noticia } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Newspaper, Eye, EyeOff, Calendar } from "lucide-react"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"
import supabase from "@/lib/supabase"

export function AdminNewsPage() {
  const {
    noticias,
    categorias,
    loading,
    saving,
    saveNoticia,
    togglePublicado,
    deleteNoticia
  } = useAdminNoticias()

  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)

  // Estado para exclusão via AlertDialog
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Estado do Formulário da Notícia
  const [formData, setFormData] = useState<Partial<Noticia>>({
    titulo: "",
    subtitulo: "",
    conteudo: "",
    imagem_capa_url: "",
    categoria_id: "",
    publicado: true
  })

  // Estado de Integração com Evento/Agenda
  const [gerarEvento, setGerarEvento] = useState(false)
  const [eventoData, setEventoData] = useState({
    data_evento: "",
    hora_evento: "09:00",
    tipo_modalidade: "presencial" as "presencial" | "virtual" | "hibrido",
    local_presencial: "",
    link_virtual: ""
  })

  // 1. Filtrar lista pelo termo de busca
  const noticiasFiltradas = noticias.filter(n =>
    n.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (n.subtitulo && n.subtitulo.toLowerCase().includes(search.toLowerCase()))
  )

  // 2. Paginação dos dados filtrados
  const pagination = usePagination({
    data: noticiasFiltradas,
    itemsPerPage: 8
  })

  const handleOpenCreate = () => {
    setEditingNoticia(null)
    setFormData({
      titulo: "",
      subtitulo: "",
      conteudo: "",
      imagem_capa_url: "",
      categoria_id: "",
      publicado: true
    })
    setGerarEvento(false)
    setEventoData({
      data_evento: new Date().toISOString().split("T")[0],
      hora_evento: "09:00",
      tipo_modalidade: "presencial",
      local_presencial: "",
      link_virtual: ""
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Noticia) => {
    setEditingNoticia(item)
    setFormData({
      titulo: item.titulo,
      subtitulo: item.subtitulo || "",
      conteudo: item.conteudo || "",
      imagem_capa_url: item.imagem_capa_url || "",
      categoria_id: item.categoria_id || "",
      publicado: item.publicado
    })
    setGerarEvento(false)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await saveNoticia(formData, editingNoticia?.id)
    
    // Se ativado "Gerar Evento" no cadastro de uma nova notícia
    if (result && gerarEvento && !editingNoticia) {
      try {
        const localTexto = eventoData.tipo_modalidade === 'virtual' 
          ? 'Evento Virtual' 
          : eventoData.local_presencial || 'Diocese de Crateús'

        await supabase.from('eventos').insert({
          titulo: formData.titulo,
          descricao: formData.subtitulo || formData.titulo,
          data_evento: eventoData.data_evento,
          hora_evento: eventoData.hora_evento,
          local: localTexto,
          tipo_modalidade: eventoData.tipo_modalidade,
          local_presencial: eventoData.local_presencial || null,
          link_virtual: eventoData.link_virtual || null,
          noticia_id: (result as any)?.id || null
        })
      } catch (err) {
        console.error("Erro ao gerar evento da notícia:", err)
      }
    }

    if (result) setModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await deleteNoticia(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">

      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão de Notícias & Comunicados
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Publique matérias, comunicados da chancelaria e notícias das paróquias.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Nova Notícia
        </Button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
        <Input
          type="text"
          placeholder="Buscar título ou subtítulo..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            pagination.goToPage(1)
          }}
          className="pl-9 text-xs"
        />
      </div>

      {/* TABELA DE NOTÍCIAS */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando notícias...</div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a] space-y-2">
              <Newspaper className="w-8 h-8 text-[#a1a1aa] mx-auto" />
              <p>Nenhuma notícia encontrada.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#e4e4e7] dark:border-[#27272a]">
                    <TableHead className="text-xs">Título</TableHead>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs">Data</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.map((item) => (
                    <TableRow key={item.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                      <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa] max-w-xs truncate">
                        {item.titulo}
                      </TableCell>

                      <TableCell className="text-xs">
                        {item.categorias ? (
                          <Badge variant="outline" className="text-[10px] font-medium border-[#e4e4e7]">
                            {item.categorias.nome}
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-[#71717a]">Geral</span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-[#71717a]">
                        {new Date(item.data_publicacao || item.created_at || '').toLocaleDateString('pt-BR')}
                      </TableCell>

                      <TableCell className="text-xs">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublicado(item.id, item.publicado!)}
                          className="h-7 px-2 text-[11px] gap-1.5"
                        >
                          {item.publicado ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Publicado</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-amber-600 font-medium">Rascunho</span>
                            </>
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                          <Pencil className="w-3.5 h-3.5 text-[#71717a] hover:text-[#09090b]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(item.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <DataTablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPrevPage={pagination.prevPage}
                onNextPage={pagination.nextPage}
                hasPrevPage={pagination.hasPrevPage}
                hasNextPage={pagination.hasNextPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* MODAL FORMULÁRIO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingNoticia ? "Editar Notícia" : "Nova Notícia"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label>Título da Notícia *</Label>
              <Input
                required
                value={formData.titulo || ""}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Diocese celebra Missa em Ação de Graças pelo Jubileu"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select
                  value={formData.categoria_id || "sem_categoria"}
                  onValueChange={(v) => setFormData({ ...formData, categoria_id: v === "sem_categoria" ? "" : v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem_categoria">Geral / Sem Categoria</SelectItem>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status de Publicação</Label>
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={formData.publicado}
                    onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                  />
                  <span className="text-xs text-[#71717a]">
                    {formData.publicado ? "Publicado no Portal" : "Salvar como Rascunho"}
                  </span>
                </div>
              </div>
            </div>

            {/* SEÇÃO: GERAR EVENTO NA AGENDA (APENAS NA CRIAÇÃO) */}
            {!editingNoticia && (
              <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-xs">Gerar Evento na Agenda?</span>
                      <p className="text-[11px] text-[#71717a]">
                        Cria automaticamente uma entrada na Agenda Diocesana vinculada a esta notícia.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={gerarEvento}
                    onCheckedChange={setGerarEvento}
                  />
                </div>

                {gerarEvento && (
                  <div className="space-y-3 pt-2 border-t border-[#e4e4e7] dark:border-[#27272a]">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Data do Evento *</Label>
                        <Input
                          type="date"
                          required={gerarEvento}
                          value={eventoData.data_evento}
                          onChange={(e) => setEventoData({ ...eventoData, data_evento: e.target.value })}
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Horário *</Label>
                        <Input
                          type="time"
                          required={gerarEvento}
                          value={eventoData.hora_evento}
                          onChange={(e) => setEventoData({ ...eventoData, hora_evento: e.target.value })}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px]">Modalidade do Evento</Label>
                        <Select
                          value={eventoData.tipo_modalidade}
                          onValueChange={(val: "presencial" | "virtual" | "hibrido") =>
                            setEventoData({ ...eventoData, tipo_modalidade: val })
                          }
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="presencial">🟢 Presencial</SelectItem>
                            <SelectItem value="virtual">💻 Virtual / Online</SelectItem>
                            <SelectItem value="hibrido">🔄 Híbrido (Presencial + Online)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(eventoData.tipo_modalidade === 'presencial' || eventoData.tipo_modalidade === 'hibrido') && (
                        <div className="space-y-1">
                          <Label className="text-[11px]">Endereço / Local Presencial</Label>
                          <Input
                            placeholder="Ex: Catedral do Senhor do Bonfim"
                            value={eventoData.local_presencial}
                            onChange={(e) => setEventoData({ ...eventoData, local_presencial: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {(eventoData.tipo_modalidade === 'virtual' || eventoData.tipo_modalidade === 'hibrido') && (
                      <div className="space-y-1">
                        <Label className="text-[11px]">Link da Transmissão ou Reunião (Meet / Zoom / YouTube)</Label>
                        <Input
                          type="url"
                          placeholder="https://meet.google.com/abc-defg-hij"
                          value={eventoData.link_virtual}
                          onChange={(e) => setEventoData({ ...eventoData, link_virtual: e.target.value })}
                          className="text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Imagem de Capa</Label>
              <ImageUploader
                value={formData.imagem_capa_url}
                folder="noticias"
                onChange={(url) => setFormData({ ...formData, imagem_capa_url: url })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Subtítulo / Resumo</Label>
              <Textarea
                rows={2}
                value={formData.subtitulo || ""}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                placeholder="Subtítulo exibido nos cards da home e da listagem..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Conteúdo Completo da Matéria *</Label>
              <RichTextEditor
                content={formData.conteudo || ""}
                onChange={(html) => setFormData({ ...formData, conteudo: html })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Notícia"}
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
        title="Excluir Notícia?"
        description="Tem certeza que deseja remover esta matéria? Esta ação não poderá ser desfeita."
      />

    </div>
  )
}