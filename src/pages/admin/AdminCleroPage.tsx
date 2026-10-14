import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { Clero, Paroquia } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, Save, X, User } from "lucide-react"

export function AdminCleroPage() {
  const [clero, setClero] = useState<Clero[]>([])
  const [paroquias, setParoquias] = useState<Paroquia[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    cargo: "Pároco",
    paroquia_id: "",
    imagem_url: "",
    data_ordenacao: "",
    aniversario_natalicio: "",
    email: "",
    biografia: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [cleroRes, paroquiasRes] = await Promise.all([
      supabase.from("clero").select("*, paroquias(id, nome)").order("nome"),
      supabase.from("paroquias").select("id, nome").order("nome")
    ])

    if (cleroRes.data) setClero(cleroRes.data as Clero[])
    if (paroquiasRes.data) setParoquias(paroquiasRes.data as Paroquia[])
    setLoading(false)
  }

  function handleEdit(membro: Clero) {
    setEditingId(membro.id)
    setFormData({
      nome: membro.nome || "",
      cargo: membro.cargo || "Pároco",
      paroquia_id: membro.paroquia_id || "",
      imagem_url: membro.imagem_url || "",
      data_ordenacao: membro.data_ordenacao || "",
      aniversario_natalicio: membro.aniversario_natalicio || "",
      email: membro.email || "",
      biografia: membro.biografia || ""
    })
  }

  function handleResetForm() {
    setEditingId(null)
    setFormData({
      nome: "",
      cargo: "Pároco",
      paroquia_id: "",
      imagem_url: "",
      data_ordenacao: "",
      aniversario_natalicio: "",
      email: "",
      biografia: ""
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      nome: formData.nome,
      cargo: formData.cargo,
      // Garante conversão de string vazia para NULL no UUID do Supabase
      paroquia_id: formData.paroquia_id ? formData.paroquia_id : null,
      imagem_url: formData.imagem_url || null,
      data_ordenacao: formData.data_ordenacao || null,
      aniversario_natalicio: formData.aniversario_natalicio || null,
      email: formData.email || null,
      biografia: formData.biografia || null
    }

    if (editingId) {
      const { error } = await supabase.from("clero").update(payload).eq("id", editingId)
      if (error) alert("Erro ao atualizar: " + error.message)
    } else {
      const { error } = await supabase.from("clero").insert([payload])
      if (error) alert("Erro ao cadastrar: " + error.message)
    }

    handleResetForm()
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este membro do clero?")) return
    const { error } = await supabase.from("clero").delete().eq("id", id)
    if (error) alert("Erro ao deletar: " + error.message)
    else fetchData()
  }

  if (loading) return <div className="p-8 text-xs text-[#71717a]">Carregando clero...</div>

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Gerenciar Clero
        </h1>
      </div>

      {/* Formulário */}
      <Card className="border rounded-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-sm font-bold">
              {editingId ? "Editar Clérigo" : "Cadastrar Novo Clérigo"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold">Nome*</label>
                <Input
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do Pe. / Diácono"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Cargo/Função*</label>
                <select
                  className="w-full h-9 px-3 rounded-md border text-xs bg-background"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                >
                  <option value="Pároco">Pároco</option>
                  <option value="Vigário">Vigário</option>
                  <option value="Diácono">Diácono</option>
                  <option value="Bispo">Bispo</option>
                  <option value="Emérito">Emérito</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Paróquia Vinculada</label>
                <select
                  className="w-full h-9 px-3 rounded-md border text-xs bg-background"
                  value={formData.paroquia_id}
                  onChange={(e) => setFormData({ ...formData, paroquia_id: e.target.value })}
                >
                  <option value="">Nenhuma / Sem Paróquia (Disponível)</option>
                  {paroquias.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">URL da Foto</label>
                <Input
                  value={formData.imagem_url}
                  onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Data de Ordenação</label>
                <Input
                  type="date"
                  value={formData.data_ordenacao}
                  onChange={(e) => setFormData({ ...formData, data_ordenacao: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Aniversário Natalício</label>
                <Input
                  type="date"
                  value={formData.aniversario_natalicio}
                  onChange={(e) => setFormData({ ...formData, aniversario_natalicio: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" className="text-xs gap-1">
                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? "Atualizar" : "Cadastrar"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" size="sm" onClick={handleResetForm} className="text-xs gap-1">
                  <X className="w-4 h-4" /> Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {clero.map((membro) => (
          <Card key={membro.id} className="border rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                {membro.imagem_url ? (
                  <img src={membro.imagem_url} alt={membro.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-xs font-bold truncate">{membro.nome}</h3>
                <p className="text-[11px] text-muted-foreground">{membro.cargo}</p>
                <p className="text-[10px] text-blue-600 font-semibold truncate">
                  {(membro as any).paroquias?.nome || "Sem Paróquia"}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => handleEdit(membro)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="w-7 h-7 text-red-600" onClick={() => handleDelete(membro.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}