import { useState, useEffect } from "react";
import { Trophy, RefreshCw, ShoppingCart } from "lucide-react";
import { HorarioCard } from "@/components/HorarioCard";
import { VagaModal } from "@/components/VagaModal";
import { getHorarios, getConfiguracoes, registrarAcesso, Horario, Configuracao } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Index() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const [h, c] = await Promise.all([getHorarios(), getConfiguracoes()]);
      setHorarios(h);
      setConfig(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();

    // Evita contar acessos repetidos no refresh usando sessionStorage
    const jaContou = sessionStorage.getItem("acesso_registrado");
    if (!jaContou) {
      registrarAcesso();
      sessionStorage.setItem("acesso_registrado", "true");
    }
  }, []);

  useEffect(() => {
    if (config?.nome_campeonato) {
      document.title = config.nome_campeonato;
    } else {
      document.title = "Vaga Fácil - Campeonato";
    }
  }, [config]);

  const toggleSelecionado = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const horariosSelecionados = horarios.filter((h) => selecionados.includes(h.id));

  return (
    <div className="min-h-screen gradient-hero pb-32">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {config?.nome_campeonato || "Diário DUO TRZ"}
              </h1>
              <p className="text-xs text-muted-foreground">Reserve sua vaga agora!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={carregar}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Escolha seu{" "}
            <span className="text-primary">horário</span>
          </h2>
          <p className="text-muted-foreground">
            Selecione um ou mais horários e envie sua reserva pelo WhatsApp
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1">
              <span className="text-sm font-semibold text-primary">R$ 5,00 por vaga</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="max-w-4xl mx-auto">
            {horarios.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Nenhum horário disponível</p>
                <p className="text-sm mt-1">Aguarde o organizador adicionar horários.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                {horarios.map((h) => (
                  <HorarioCard
                    key={h.id}
                    horario={h}
                    selected={selecionados.includes(h.id)}
                    onToggle={toggleSelecionado}
                    isDiario={config?.is_diario || false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8 px-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary/30 rounded-full border border-border/50">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-4 rounded-full border border-background bg-primary/20" />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            {config?.total_acessos || 0} visitas registradas
          </span>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <a href="/admin" className="hover:text-primary transition-colors">Área administrativa</a>
        </p>
      </footer>

      {/* FAB — aparece quando há horários selecionados */}
      {horariosSelecionados.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] active:scale-95 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl shadow-[#25D366]/40 transition-all w-full max-w-sm"
          >
            {/* Ícone + badge */}
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-white text-[#25D366] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#25D366]">
                {horariosSelecionados.length}
              </span>
            </div>
            {/* Texto + preço */}
            <div className="flex-1 text-left">
              <p className="text-sm font-black leading-tight">Enviar e Comprar Vaga</p>
              <p className="text-[11px] font-medium opacity-90">
                {horariosSelecionados.length} vaga{horariosSelecionados.length > 1 ? "s" : ""} · R$ {(horariosSelecionados.length * 5).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Modal de reserva */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90dvh] overflow-y-auto rounded-2xl p-6 border-border">
          <VagaModal
            horariosSelecionados={horariosSelecionados}
            whatsappAdmin={config?.whatsapp_numero || ""}
            nomeCampeonato={config?.nome_campeonato || "Campeonato"}
            pixChave={config?.pix_chave || ""}
            isDiario={config?.is_diario || false}
            onClose={() => setModalAberto(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
