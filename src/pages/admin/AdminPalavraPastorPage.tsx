import { useState } from "react"
import { useAdminPalavraPastor } from "@/hooks/useAdminPalavraPastor"
import type { PalavraPastorItem } from "@/hooks/usePalavraPastor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Quote, PlayCircle, FileText } from "lucide-react"

export function AdminPalavraPastorPage() {
  const { itens, loading, saving, saveItem, deleteItem } = useAdminPalavraPastor()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PalavraPastorItem | null>(null)

  const [formData, setFormData] = useState<Partial<PalavraPastorItem>>({
    titulo: "",
    tipo: "video",
    url_youtube: "",
    conteudo_nota: "",
    data_publicacao: new Date().toISOString().slice(0, 10)
  })

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      titulo: "",
      tipo: "video",
      url_youtube: "",
      conteudo_nota: "",
      data_publicacao: new Date().toISOString().slice(0, 10)
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: PalavraPastorItem) => {
    setEditingItem(item)
    setFormData({
      titulo: item.titulo,
      tipo: item.tipo,
      url_youtube: item.url_youtube || "",
      conteudo_nota: item.conteudo_nota || "",
      data_publicacao: item.data_publicacao ? item.data_publicacao.slice(0, 10) : new Date().toISOString().slice(0, 10)
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await saveItem(formData, editingItem?.id)
    if (success) setModalOpen(false)
  }

  const itensFiltrados = itens.filter(i =>
    i.titulo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e4e4e7] dark:border-[#27272a] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
            Gestão da Palavra do Pastor
          </h1>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            Publique vídeos do YouTube ou notas e reflexões pastorais.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Nova Publicação
        </Button>
      </div>

      {/* BUSCA */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
        <Input
          type="text"
          placeholder="Buscar no título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* TABELA */}
      <Card className="border border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Carregando mensagens...</div>
          ) : itensFiltrados.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a] space-y-2">
              <Quote className="w-8 h-8 text-[#a1a1aa] mx-auto" />
              <p>Nenhuma publicação encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e4e4e7] dark:border-[#27272a]">
                  <TableHead className="text-xs">Tipo</TableHead>
                  <TableHead className="text-xs">Título</TableHead>
                  <TableHead className="text-xs">Data de Publicação</TableHead>
                  <TableHead className="text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensFiltrados.map((item) => (
                  <TableRow key={item.id} className="border-b border-[#f4f4f5] dark:border-[#27272a]">
                    <TableCell className="text-xs">
                      {item.tipo === 'video' ? (
                        <Badge variant="outline" className="text-[10px] font-bold border-[#e4e4e7] gap-1">
                          <PlayCircle className="w-3 h-3 text-[#2563eb]" /> Vídeo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-bold border-[#e4e4e7] gap-1">
                          <FileText className="w-3 h-3 text-emerald-600" /> Nota
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-xs text-[#09090b] dark:text-[#fafafa]">
                      {item.titulo}
                    </TableCell>

                    <TableCell className="text-xs text-[#71717a]">
                      {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                    </TableCell>

                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                        <Pencil className="w-3.5 h-3.5 text-[#71717a]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(item.id)}>
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

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingItem ? "Editar Publicação" : "Nova Publicação"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label>Título da Publicação *</Label>
              <Input
                required
                value={formData.titulo || ""}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Mensagem para o Tempo da Quaresma"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo de Conteúdo *</Label>
                <Select
                  value={formData.tipo || "video"}
                  onValueChange={(v: 'video' | 'nota') => setFormData({ ...formData, tipo: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo do YouTube</SelectItem>
                    <SelectItem value="nota">Nota / Texto Pastoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Data de Publicação</Label>
                <Input
                  type="date"
                  value={formData.data_publicacao || ""}
                  onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {formData.tipo === 'video' ? (
              <div className="space-y-1.5">
                <Label>URL do Vídeo no YouTube *</Label>
                <Input
                  required={formData.tipo === 'video'}
                  value={formData.url_youtube || ""}
                  onChange={(e) => setFormData({ ...formData, url_youtube: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="text-xs"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Conteúdo da Nota Pastoral *</Label>
                <Textarea
                  required={formData.tipo === 'nota'}
                  rows={5}
                  value={formData.conteudo_nota || ""}
                  onChange={(e) => setFormData({ ...formData, conteudo_nota: e.target.value })}
                  placeholder="Escreva a mensagem pastoral na íntegra..."
                  className="text-xs"
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Publicação"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}