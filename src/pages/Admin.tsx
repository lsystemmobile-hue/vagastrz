import { useState, useEffect } from "react";
import { supabase, getHorarios, getConfiguracoes, createHorario, updateHorario, deleteHorario, upsertConfiguracoes, updateOrdemHorarios, Horario, Configuracao } from "@/lib/supabase";
import { LoginAdmin } from "@/components/LoginAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Plus, Trash2, LogOut, Settings, Calendar, Save, ArrowLeft, Pencil, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tab = "horarios" | "config";

interface SortableRowProps {
  h: import("@/lib/supabase").Horario;
  isDiario: boolean;
  editandoId: string | null;
  editData: string; editHora: string; editDescricao: string; editWhatsapp: string;
  setEditData: (v: string) => void;
  setEditHora: (v: string) => void;
  setEditDescricao: (v: string) => void;
  setEditWhatsapp: (v: string) => void;
  onSalvar: () => void;
  onCancelar: () => void;
  onEditar: (h: import("@/lib/supabase").Horario) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, ativo: boolean) => void;
}

function SortableRow({ h, isDiario, editandoId, editData, editHora, editDescricao, editWhatsapp, setEditData, setEditHora, setEditDescricao, setEditWhatsapp, onSalvar, onCancelar, onEditar, onDelete, onToggle }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: h.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <TableRow ref={setNodeRef} style={style} className="border-border">
      <TableCell className="w-8 cursor-grab active:cursor-grabbing text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </TableCell>
      {editandoId === h.id ? (
        <>
          <TableCell>
            <div className="flex gap-2">
              {!isDiario && (
                <Input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} className="h-8 bg-secondary border-border text-xs w-36" />
              )}
              <Input type="time" value={editHora} onChange={(e) => setEditHora(e.target.value)} className="h-8 bg-secondary border-border text-xs w-24" />
            </div>
          </TableCell>
          <TableCell>
            <Input value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="h-8 bg-secondary border-border text-xs" />
          </TableCell>
          <TableCell>
            <Input placeholder="WhatsApp" value={editWhatsapp} onChange={(e) => setEditWhatsapp(e.target.value)} className="h-8 bg-secondary border-border text-xs w-36" />
          </TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={onSalvar} className="h-7 px-3 text-xs gap-1"><Save className="h-3 w-3" /> Salvar</Button>
              <Button size="sm" variant="ghost" onClick={onCancelar} className="h-7 px-3 text-xs">Cancelar</Button>
            </div>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className="font-medium text-sm">
            {isDiario ? format(new Date(h.data_hora), "HH:mm", { locale: ptBR }) : format(new Date(h.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">{h.descricao}</TableCell>
          <TableCell className="text-xs text-muted-foreground font-mono">{h.whatsapp_numero || <span className="opacity-40">—</span>}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Switch checked={h.ativo} onCheckedChange={() => onToggle(h.id, h.ativo)} />
              <span className={`text-xs font-semibold ${h.ativo ? "text-primary" : "text-muted-foreground"}`}>{h.ativo ? "Ativo" : "Encerrado"}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEditar(h)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(h.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("horarios");
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Novo horário
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaWhatsapp, setNovaWhatsapp] = useState("");

  // Config
  const [whatsappNumero, setWhatsappNumero] = useState("");
  const [nomeCampeonato, setNomeCampeonato] = useState("");
  const [isDiario, setIsDiario] = useState(false);
  const [pixChave, setPixChave] = useState("");

  // Edição
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editData, setEditData] = useState("");
  const [editHora, setEditHora] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = horarios.findIndex((h) => h.id === active.id);
    const newIndex = horarios.findIndex((h) => h.id === over.id);
    const reordered = arrayMove(horarios, oldIndex, newIndex);
    setHorarios(reordered);
    try {
      await updateOrdemHorarios(reordered.map((h, i) => ({ id: h.id, ordem: i })));
      toast({ title: "Ordem salva!", description: "A ordenação foi atualizada." });
    } catch {
      toast({ title: "Erro ao salvar ordem", variant: "destructive" });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAutenticado(!!session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAutenticado(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (autenticado) carregar();
  }, [autenticado]);

  const carregar = async () => {
    setLoading(true);
    try {
      const [h, c] = await Promise.all([getHorarios(), getConfiguracoes()]);
      setHorarios(h);
      setConfig(c);
      setWhatsappNumero(c?.whatsapp_numero || "");
      setNomeCampeonato(c?.nome_campeonato || "");
      setIsDiario(c?.is_diario || false);
      setPixChave(c?.pix_chave || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleCriarHorario = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!isDiario && !novaData) || !novaHora || !novaDescricao) return;
    try {
      const dataStr = isDiario ? new Date().toISOString().split('T')[0] : novaData;
      const dataHora = new Date(`${dataStr}T${novaHora}:00`).toISOString();
      await createHorario({ data_hora: dataHora, descricao: novaDescricao, ativo: true, whatsapp_numero: novaWhatsapp });
      setNovaData("");
      setNovaHora("");
      setNovaDescricao("");
      setNovaWhatsapp("");
      await carregar();
      toast({ title: "Horário criado!", description: "O horário foi adicionado com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível criar o horário.", variant: "destructive" });
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await updateHorario(id, { ativo: !ativo });
      setHorarios((prev) => prev.map((h) => h.id === id ? { ...h, ativo: !ativo } : h));
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível atualizar.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este horário?")) return;
    try {
      await deleteHorario(id);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
      toast({ title: "Excluído", description: "Horário removido com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível excluir.", variant: "destructive" });
    }
  };

  const handleIniciarEdicao = (h: Horario) => {
    const dt = new Date(h.data_hora);
    setEditandoId(h.id);
    setEditData(format(dt, "yyyy-MM-dd"));
    setEditHora(format(dt, "HH:mm"));
    setEditDescricao(h.descricao);
    setEditWhatsapp(h.whatsapp_numero || "");
  };

  const handleSalvarEdicao = async () => {
    if (!editandoId) return;
    try {
      const h = horarios.find(x => x.id === editandoId);
      const dataStr = isDiario ? new Date(h?.data_hora || "").toISOString().split('T')[0] : editData;
      const dataHora = new Date(`${dataStr}T${editHora}:00`).toISOString();
      await updateHorario(editandoId, { data_hora: dataHora, descricao: editDescricao, whatsapp_numero: editWhatsapp });
      setEditandoId(null);
      await carregar();
      toast({ title: "Atualizado!", description: "Horário atualizado com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" });
    }
  };

  const handleSalvarConfig = async () => {
    try {
      await upsertConfiguracoes({
        id: config?.id,
        whatsapp_numero: whatsappNumero,
        nome_campeonato: nomeCampeonato,
        is_diario: isDiario,
        pix_chave: pixChave,
      });
      await carregar();
      toast({ title: "Configurações salvas!", description: "As configurações foram atualizadas." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível salvar as configurações.", variant: "destructive" });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Trophy className="h-10 w-10 text-primary animate-pulse" />
      </div>
    );
  }

  if (!autenticado) {
    return <LoginAdmin onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Painel Admin</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{config?.nome_campeonato || "Campeonato"}</p>
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground border border-border/50">
                  {config?.total_acessos || 0} visitas
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Ver página pública</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("horarios")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${tab === "horarios"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
          >
            <Calendar className="h-4 w-4" />
            Horários
          </button>
          <button
            onClick={() => setTab("config")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${tab === "config"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </button>
        </div>

        {/* Aba Horários */}
        {tab === "horarios" && (
          <div className="space-y-6">
            {/* Formulário novo horário */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Adicionar Horário
              </h3>
              <form onSubmit={handleCriarHorario} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {!isDiario && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Data</Label>
                    <Input
                      type="date"
                      value={novaData}
                      onChange={(e) => setNovaData(e.target.value)}
                      required
                      className="mt-1 bg-secondary border-border"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Hora</Label>
                  <Input
                    type="time"
                    value={novaHora}
                    onChange={(e) => setNovaHora(e.target.value)}
                    required
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Descrição</Label>
                  <Input
                    placeholder="Ex: Quadra A, Partida de Abertura..."
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    required
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">WhatsApp (número)</Label>
                  <Input
                    placeholder="Ex: 5511999999999"
                    value={novaWhatsapp}
                    onChange={(e) => setNovaWhatsapp(e.target.value)}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Horário
                  </Button>
                </div>
              </form>
            </div>

            {/* Lista de horários com DnD */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold">Horários Cadastrados ({horarios.length})</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Arraste as linhas para reordenar. A ordem é salva automaticamente.</p>
              </div>
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Carregando...</div>
              ) : horarios.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Nenhum horário cadastrado ainda.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="w-8"></TableHead>
                        <TableHead className="text-muted-foreground">{isDiario ? "Hora" : "Data/Hora"}</TableHead>
                        <TableHead className="text-muted-foreground">Descrição</TableHead>
                        <TableHead className="text-muted-foreground">WhatsApp</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={horarios.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                        <TableBody>
                          {horarios.map((h) => (
                            <SortableRow
                              key={h.id}
                              h={h}
                              isDiario={isDiario}
                              editandoId={editandoId}
                              editData={editData}
                              editHora={editHora}
                              editDescricao={editDescricao}
                              editWhatsapp={editWhatsapp}
                              setEditData={setEditData}
                              setEditHora={setEditHora}
                              setEditDescricao={setEditDescricao}
                              setEditWhatsapp={setEditWhatsapp}
                              onSalvar={handleSalvarEdicao}
                              onCancelar={() => setEditandoId(null)}
                              onEditar={handleIniciarEdicao}
                              onDelete={handleDelete}
                              onToggle={handleToggleAtivo}
                            />
                          ))}
                        </TableBody>
                      </SortableContext>
                    </DndContext>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aba Configurações */}
        {tab === "config" && (
          <div className="bg-card border border-border rounded-xl p-5 max-w-lg">
            <h3 className="font-bold mb-5 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Configurações do Campeonato
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Nome do Campeonato</Label>
                <Input
                  placeholder="Ex: Copa do Bairro 2024"
                  value={nomeCampeonato}
                  onChange={(e) => setNomeCampeonato(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">WhatsApp do Administrador</Label>
                <Input
                  placeholder="Ex: 5511999998888 (com código do país)"
                  value={whatsappNumero}
                  onChange={(e) => setWhatsappNumero(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Inclua o código do país. Ex: <strong>55</strong> (Brasil) + DDD + número = 5511999998888
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Chave Pix</Label>
                <Input
                  placeholder="Ex: CPF, E-mail ou Celular"
                  value={pixChave}
                  onChange={(e) => setPixChave(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Campeonato Diário</Label>
                  <p className="text-xs text-muted-foreground">Oculta as datas e exibe apenas os horários.</p>
                </div>
                <Switch
                  checked={isDiario}
                  onCheckedChange={setIsDiario}
                />
              </div>
              <Button onClick={handleSalvarConfig} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
