import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import type { ReligiosaMembro, Congregacao } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, Save, X, User } from "lucide-react"

export function AdminReligiosasPage() {
  const [membros, setMembros] = useState<ReligiosaMembro[]>([])
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    congregacao_id: "",
    foto_url: "",
    biografia: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [membrosRes, congRes] = await Promise.all([
      supabase.from("religiosas_membros").select("*, congregacoes(id, nome)").order("nome"),
      supabase.from("congregacoes").select("id, nome").order("nome")
    ])

    if (membrosRes.data) setMembros(membrosRes.data as ReligiosaMembro[])
    if (congRes.data) setCongregacoes(congRes.data as Congregacao[])
    setLoading(false)
  }

  function handleEdit(item: ReligiosaMembro) {
    setEditingId(item.id)
    setFormData({
      nome: item.nome || "",
      cargo: item.cargo || "",
      congregacao_id: item.congregacao_id || "",
      foto_url: item.foto_url || "",
      biografia: item.biografia || ""
    })
  }

  function handleResetForm() {
    setEditingId(null)
    setFormData({
      nome: "",
      cargo: "",
      congregacao_id: "",
      foto_url: "",
      biografia: ""
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      nome: formData.nome,
      cargo: formData.cargo || null,
      // Converte string vazia para NULL no UUID do Supabase se for removida da congregação
      congregacao_id: formData.congregacao_id ? formData.congregacao_id : null,
      foto_url: formData.foto_url || null,
      biografia: formData.biografia || null
    }

    if (editingId) {
      const { error } = await supabase.from("religiosas_membros").update(payload).eq("id", editingId)
      if (error) alert("Erro ao atualizar: " + error.message)
    } else {
      const { error } = await supabase.from("religiosas_membros").insert([payload])
      if (error) alert("Erro ao cadastrar: " + error.message)
    }

    handleResetForm()
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover esta religiosa?")) return
    const { error } = await supabase.from("religiosas_membros").delete().eq("id", id)
    if (error) alert("Erro ao deletar: " + error.message)
    else fetchData()
  }

  if (loading) return <div className="p-8 text-xs text-[#71717a]">Carregando religiosas...</div>

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-[#09090b] dark:text-[#fafafa]">
          Gerenciar Religiosas & Irmãs
        </h1>
      </div>

      {/* Formulário */}
      <Card className="border rounded-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-sm font-bold">
              {editingId ? "Editar Religiosa" : "Cadastrar Nova Religiosa"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold">Nome*</label>
                <Input
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ir. Maria..."
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Cargo / Função</label>
                <Input
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  placeholder="Superiora, Madre, Irmã..."
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Congregação Vinculada</label>
                <select
                  className="w-full h-9 px-3 rounded-md border text-xs bg-background"
                  value={formData.congregacao_id}
                  onChange={(e) => setFormData({ ...formData, congregacao_id: e.target.value })}
                >
                  <option value="">Nenhuma / Sem Congregação</option>
                  {congregacoes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">URL da Foto</label>
                <Input
                  value={formData.foto_url}
                  onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                  placeholder="https://..."
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

      {/* Lista de Religiosas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {membros.map((item) => (
          <Card key={item.id} className="border rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-xs font-bold truncate">{item.nome}</h3>
                <p className="text-[11px] text-muted-foreground">{item.cargo || "Membro"}</p>
                <p className="text-[10px] text-blue-600 font-semibold truncate">
                  {(item as any).congregacoes?.nome || "Sem Congregação"}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => handleEdit(item)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="w-7 h-7 text-red-600" onClick={() => handleDelete(item.id)}>
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