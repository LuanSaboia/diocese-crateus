import { useState } from "react"
import { useAdminAgenda } from "@/hooks/useAdminAgenda"
import type { Evento } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Calendar, MapPin } from "lucide-react"

export function AdminAgendaPage() {
  const { eventos, loading, saving, saveEvento, deleteEvento } = useAdminAgenda()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)

  // Estado do Formulário
  const [formData, setFormData] = useState<Partial<Evento>>({
    titulo: "",
    descricao: "",
    data_evento: "",
    local: ""
  })

  // Abrir modal para novo evento
  const handleOpenCreate = () => {
    setEditingEvento(null)
    setFormData({
      titulo: "",
      descricao: "",
      data_evento: new Date().toISOString().slice(0, 16),
      local: ""
    })
    setModalOpen(true)
  }

  // Abrir modal para edição
  const handleOpenEdit = (item: Evento) => {
    setEditingEvento(item)
    
    // Formata a data para o input datetime-local (YYYY-MM-DDTHH:mm)
    const formattedDate = item.data_evento 
      ? new Date(item.data_evento).toISOString().slice(0, 16)
      : ""

    setFormData({
      titulo: item.titulo,
      descricao: item.descricao || "",
      data_evento: formattedDate,
      local: item.local || ""
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await saveEvento(formData, editingEvento?.id)
    if (success) setModalOpen(false)
  }

  const eventosFiltrados = eventos.filter(e =>
    e.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (e.local && e.local.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão da Agenda Diocesana
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Cadastre celebrações, assembleias e compromissos do bispo e da diocese.
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
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando agenda...</div>
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
                  <TableHead className="text-xs">Local</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventosFiltrados.map((item) => {
                  const dataObj = new Date(item.data_evento)
                  const dataFormatada = dataObj.toLocaleDateString('pt-BR')
                  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

                  return (
                    <TableRow key={item.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                      <TableCell className="text-xs font-medium text-[#09090b] dark:text-[#fafafa] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
                          <span>{dataFormatada}</span>
                          <span className="text-[#71717a] text-[11px]">({horaFormatada})</span>
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa]">
                        {item.titulo}
                      </TableCell>

                      <TableCell className="text-xs text-[#71717a]">
                        {item.local ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#2563eb]" /> {item.local}
                          </span>
                        ) : (
                          <span className="italic text-[11px]">Não informado</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                          <Pencil className="w-3.5 h-3.5 text-[#71717a] hover:text-[#09090b]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEvento(item.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* MODAL FORMULÁRIO */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
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

            <div className="space-y-1.5">
              <Label>Data e Horário *</Label>
              <Input
                required
                type="datetime-local"
                value={formData.data_evento || ""}
                onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Local do Evento</Label>
              <Input
                value={formData.local || ""}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                placeholder="Ex: Centro Diocesano de Pastoral - Crateús"
                className="text-xs"
              />
            </div>

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

            <DialogFooter className="pt-4">
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

    </div>
  )
}