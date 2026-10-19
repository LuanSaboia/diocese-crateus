import { useState } from "react"
import { useAdminAgenda } from "@/hooks/useAdminAgenda"
import type { Evento } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Calendar, MapPin, Video } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

export function AdminAgendaPage() {
  const { eventos, loading, saving, saveEvento, deleteEvento } = useAdminAgenda()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState<Partial<Evento>>({
    titulo: "",
    descricao: "",
    data_evento: "",
    hora_evento: "09:00",
    tipo_modalidade: "presencial",
    local_presencial: "",
    link_virtual: ""
  })

  const eventosFiltrados = eventos.filter(e =>
    e.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (e.local && e.local.toLowerCase().includes(search.toLowerCase()))
  )

  const handleOpenCreate = () => {
    setEditingEvento(null)
    setFormData({
      titulo: "",
      descricao: "",
      data_evento: new Date().toISOString().split("T")[0],
      hora_evento: "09:00",
      tipo_modalidade: "presencial",
      local_presencial: "",
      link_virtual: ""
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: Evento) => {
    setEditingEvento(item)
    setFormData({
      titulo: item.titulo,
      descricao: item.descricao || "",
      data_evento: item.data_evento || "",
      hora_evento: item.hora_evento ? item.hora_evento.slice(0, 5) : "09:00",
      tipo_modalidade: item.tipo_modalidade || "presencial",
      local_presencial: item.local_presencial || item.local || "",
      link_virtual: item.link_virtual || ""
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const localCalculado = formData.tipo_modalidade === 'virtual'
      ? 'Evento Virtual'
      : formData.local_presencial || 'Diocese de Crateús'

    const success = await saveEvento({
      ...formData,
      local: localCalculado
    }, editingEvento?.id)

    if (success) setModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await deleteEvento(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  // Função auxiliar para exibir data no formato BR na tabela sem erros de Fuso Horário
  const formatarDataTabela = (dataStr: string) => {
    if (!dataStr) return "-"
    const [ano, mes, dia] = dataStr.split("T")[0].split("-")
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão da Agenda Diocesana
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Cadastre celebrações, assembleias e compromissos do bispo e das pastorais.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Novo Evento
        </Button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
        <Input
          type="text"
          placeholder="Buscar evento ou local..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* TABELA DE EVENTOS */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando eventos...</div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a] space-y-2">
              <Calendar className="w-8 h-8 text-[#a1a1aa] mx-auto" />
              <p>Nenhum evento encontrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e4e4e7] dark:border-[#27272a]">
                  <TableHead className="text-xs">Data & Hora</TableHead>
                  <TableHead className="text-xs">Título do Evento</TableHead>
                  <TableHead className="text-xs">Modalidade</TableHead>
                  <TableHead className="text-xs">Local / Link</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventosFiltrados.map((item) => (
                  <TableRow key={item.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                    <TableCell className="text-xs text-[#71717a] whitespace-nowrap">
                      {formatarDataTabela(item.data_evento)} {item.hora_evento ? `(${item.hora_evento.slice(0, 5)})` : ""}
                    </TableCell>

                    <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa]">
                      {item.titulo}
                    </TableCell>

                    <TableCell className="text-xs">
                      {item.tipo_modalidade === 'virtual' && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] gap-1">
                          <Video className="w-3 h-3" /> Virtual
                        </Badge>
                      )}
                      {item.tipo_modalidade === 'hibrido' && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] gap-1">
                          <Video className="w-3 h-3" /> Híbrido
                        </Badge>
                      )}
                      {(!item.tipo_modalidade || item.tipo_modalidade === 'presencial') && (
                        <Badge variant="outline" className="text-[10px] gap-1 border-zinc-200">
                          <MapPin className="w-3 h-3 text-emerald-600" /> Presencial
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-[#71717a] max-w-xs truncate">
                      {item.local_presencial || item.link_virtual || item.local || "-"}
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

      {/* MODAL FORMULÁRIO DE EVENTOS */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingEvento ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label>Título do Evento *</Label>
              <Input
                required
                value={formData.titulo || ""}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Assembleia Diocesana de Pastoral"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Data do Evento *</Label>
                <Input
                  type="date"
                  required
                  value={formData.data_evento || ""}
                  onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Horário *</Label>
                <Input
                  type="time"
                  required
                  value={formData.hora_evento || "09:00"}
                  onChange={(e) => setFormData({ ...formData, hora_evento: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Modalidade</Label>
              <Select
                value={formData.tipo_modalidade || "presencial"}
                onValueChange={(val: "presencial" | "virtual" | "hibrido") =>
                  setFormData({ ...formData, tipo_modalidade: val })
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

            {(formData.tipo_modalidade === 'presencial' || formData.tipo_modalidade === 'hibrido') && (
              <div className="space-y-1.5">
                <Label>Local Presencial</Label>
                <Input
                  value={formData.local_presencial || ""}
                  onChange={(e) => setFormData({ ...formData, local_presencial: e.target.value })}
                  placeholder="Ex: Centro Diocesano de Pastoral - Crateús"
                  className="text-xs"
                />
              </div>
            )}

            {(formData.tipo_modalidade === 'virtual' || formData.tipo_modalidade === 'hibrido') && (
              <div className="space-y-1.5">
                <Label>Link do Google Meet / Live / YouTube</Label>
                <Input
                  type="url"
                  value={formData.link_virtual || ""}
                  onChange={(e) => setFormData({ ...formData, link_virtual: e.target.value })}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="text-xs"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Descrição / Observações</Label>
              <Textarea
                rows={3}
                value={formData.descricao || ""}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes adicionais ou orientações para os participantes..."
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Evento"}
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
        title="Excluir Evento?"
        description="Tem certeza que deseja remover este evento da agenda?"
      />

    </div>
  )
}