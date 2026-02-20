import { supabase } from "@/integrations/supabase/client";

export type Horario = {
  id: string;
  data_hora: string;
  descricao: string;
  ativo: boolean;
  ordem?: number;
  whatsapp_numero?: string;
  criado_em: string;
};

export type Configuracao = {
  id: string;
  whatsapp_numero: string;
  nome_campeonato: string;
  is_diario: boolean;
  pix_chave?: string;
  total_acessos?: number;
  atualizado_em: string;
};

export async function getHorarios(): Promise<Horario[]> {
  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .order("ordem", { ascending: true, nullsFirst: false })
    .order("data_hora", { ascending: true });
  if (error) throw error;
  // Assign fallback ordem based on position if column is missing/null
  return (data || []).map((h, i) => ({ ...h, ordem: (h as any).ordem ?? i }));
}

export async function getConfiguracoes(): Promise<Configuracao | null> {
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ? { ...data, is_diario: !!(data as any).is_diario } : null;
}

export async function createHorario(horario: Omit<Horario, "id" | "criado_em">) {
  const { data, error } = await supabase.from("horarios").insert(horario).select().single();
  if (error) throw error;
  return data;
}

export async function updateHorario(id: string, updates: Partial<Horario>) {
  const { data, error } = await supabase.from("horarios").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteHorario(id: string) {
  const { error } = await supabase.from("horarios").delete().eq("id", id);
  if (error) throw error;
}

export async function updateOrdemHorarios(items: { id: string; ordem: number }[]) {
  const updates = items.map(({ id, ordem }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from("horarios").update({ ordem } as any).eq("id", id)
  );
  await Promise.all(updates);
}

export async function upsertConfiguracoes(config: Partial<Configuracao> & { id?: string }) {
  const { data, error } = await supabase
    .from("configuracoes")
    .upsert({ ...config, atualizado_em: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function registrarAcesso() {
  // We'll use a transaction/rpc if possible, or a simple update since it's just a counter
  // To avoid race conditions in a simple update, we'd need a specialized function.
  // For now, let's use the most direct way available in the client.
  const { data: config } = await supabase.from("configuracoes").select("id, total_acessos" as any).single();
  if (config) {
    const { error } = await supabase
      .from("configuracoes")
      .update({ total_acessos: ((config as any).total_acessos || 0) + 1 } as any)
      .eq("id", (config as any).id);
    if (error) console.error("Erro ao registrar acesso:", error);
  }
}

export { supabase };
