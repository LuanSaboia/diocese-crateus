import { useState } from "react"
import { useAdminParoquias } from "@/hooks/useAdminParoquias"
import type { Paroquia } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Building2, MapPin } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

export function AdminParoquiasPage() {
  const { paroquias, loading, saving, saveParoquia, deleteParoquia } = useAdminParoquias()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingParoquia, setEditingParoquia] = useState<Paroquia | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Estado do Formulário com os campos de horários
  const [formData, setFormData] = useState<Partial<Paroquia>>({
    nome: "",
    cidade: "",
    area: "Centro",
    endereco: "",
    telefone: "",
    email: "",
    horarios_missa: "",
    horarios_confissoes: "",
    imagem_url: ""
  })

  // Abrir modal para criação
  const handleOpenCreate = () => {
    setEditingParoquia(null)
    setFormData({
      nome: "",
      cidade: "",
      area: "Centro",
      endereco: "",
      telefone: "",
      email: "",
      horarios_missa: "",
      horarios_confissoes: "",
      imagem_url: ""
    })
    setModalOpen(true)
  }

  // Abrir modal para edição
  const handleOpenEdit = (p: Paroquia) => {
    setEditingParoquia(p)
    setFormData(p)
    setModalOpen(true)
  }

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await saveParoquia(formData, editingParoquia?.id)
    if (success) setModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteParoquia(deleteId)
    setDeleting(false)
    if (success) setDeleteId(null)
  }

  const paroquiasFiltradas = paroquias.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cidade.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">

      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão de Paróquias
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Cadastre e atualize informações, horários de missas e contatos das paróquias.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Nova Paróquia
        </Button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
        <Input
          type="text"
          placeholder="Buscar paróquia ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* TABELA DE PARÓQUIAS */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando paróquias...</div>
          ) : paroquiasFiltradas.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a] space-y-2">
              <Building2 className="w-8 h-8 text-[#a1a1aa] mx-auto" />
              <p>Nenhuma paróquia encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e4e4e7] dark:border-[#27272a]">
                  <TableHead className="text-xs">Paróquia</TableHead>
                  <TableHead className="text-xs">Cidade</TableHead>
                  <TableHead className="text-xs">Área Pastoral</TableHead>
                  <TableHead className="text-xs">Telefone</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paroquiasFiltradas.map((p) => (
                  <TableRow key={p.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                    <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa]">
                      {p.nome}
                    </TableCell>
                    <TableCell className="text-xs text-[#71717a]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2563eb]" /> {p.cidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-[#f4f4f5] dark:bg-[#27272a] font-medium text-[11px]">
                        Área {p.area}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-[#71717a]">
                      {p.telefone || "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(p)}>
                        <Pencil className="w-3.5 h-3.5 text-[#71717a] hover:text-[#09090b]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO COM NOVOS CAMPOS */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingParoquia ? "Editar Paróquia" : "Nova Paróquia"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label>Nome da Paróquia *</Label>
              <Input
                required
                value={formData.nome || ""}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Paróquia Senhora Sant'Ana"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Cidade *</Label>
                <Input
                  required
                  value={formData.cidade || ""}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Ex: Crateús"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Área Pastoral *</Label>
                <Select
                  value={formData.area || "Centro"}
                  onValueChange={(v) => setFormData({ ...formData, area: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Norte">Norte</SelectItem>
                    <SelectItem value="Centro">Centro</SelectItem>
                    <SelectItem value="Sul">Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Endereço</Label>
              <Input
                value={formData.endereco || ""}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, Número, Bairro"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Telefone / WhatsApp</Label>
                <Input
                  value={formData.telefone || ""}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(88) 9XXXX-XXXX"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="paroquia@diocese.org"
                  className="text-xs"
                />
              </div>
            </div>

            {/* NOVOS CAMPOS: HORÁRIOS DE MISSAS E CONFISSÕES */}
            <div className="space-y-1.5">
              <Label>Horários das Missas</Label>
              <Textarea
                rows={2}
                value={formData.horarios_missa || ""}
                onChange={(e) => setFormData({ ...formData, horarios_missa: e.target.value })}
                placeholder="Ex: Dom: 07h e 19h | Qua: 19h | Sex: 17h"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Horários de Confissões / Atendimento</Label>
              <Textarea
                rows={2}
                value={formData.horarios_confissoes || ""}
                onChange={(e) => setFormData({ ...formData, horarios_confissoes: e.target.value })}
                placeholder="Ex: Ter e Qui: 15h às 17h"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>URL da Imagem da Paróquia</Label>
              <Input
                value={formData.imagem_url || ""}
                onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                placeholder="https://..."
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Paróquia"}
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
        title="Excluir Paróquia?"
        description="Tem certeza que deseja remover esta paróquia? Esta ação não poderá ser revertida."
      />

    </div>
  )
}