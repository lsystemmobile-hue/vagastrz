import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Horario } from "@/lib/supabase";
import { format } from "date-fns";
import { MessageSquare, Calendar, DollarSign } from "lucide-react";

interface VagaModalProps {
    horariosSelecionados: Horario[];
    whatsappAdmin: string;
    nomeCampeonato: string;
    pixChave: string;
    isDiario: boolean;
    onClose: () => void;
}

const PRECO_POR_VAGA = 5;

function buildWhatsAppUrl(phone: string, message: string) {
    return (
        "https://api.whatsapp.com/send/?phone=" +
        phone.replace(/\D/g, "") +
        "&text=" +
        encodeURIComponent(message) +
        "&type=phone_number&app_absent=0"
    );
}

export function VagaModal({
    horariosSelecionados,
    whatsappAdmin,
    nomeCampeonato,
    pixChave,
    onClose,
}: VagaModalProps) {
    const [nome, setNome] = useState("");

    const total = horariosSelecionados.length * PRECO_POR_VAGA;

    const formatarHora = (h: Horario) => format(new Date(h.data_hora), "HH:mm");

    // Group schedules by whatsapp_numero, falling back to whatsappAdmin
    const grupos = horariosSelecionados.reduce<Record<string, Horario[]>>((acc, h) => {
        const numero = h.whatsapp_numero?.trim() || whatsappAdmin;
        if (!acc[numero]) acc[numero] = [];
        acc[numero].push(h);
        return acc;
    }, {});

    const gruposEntries = Object.entries(grupos);
    const multiGrupo = gruposEntries.length > 1;

    const buildMensagem = (lista: Horario[]) => {
        const titulo = (nomeCampeonato || "Campeonato").toUpperCase();
        const horariosStr = lista.map((h) => "- " + formatarHora(h)).join("\n");
        const qtd = lista.length;
        const totalStr = "R$ " + (qtd * PRECO_POR_VAGA).toFixed(2).replace(".", ",");
        const pixLinha = pixChave ? "\n*Pix:* " + pixChave : "";

        return [
            "*VAGA - " + titulo + "* \u270d",
            "",
            "*Nicks:* " + nome.trim(),
            "*Horários:*",
            horariosStr,
            "",
            "*Total:* " + totalStr + " (" + qtd + " vaga" + (qtd > 1 ? "s" : "") + ")" + pixLinha,
        ].join("\n");
    };

    const enviarGrupo = (numero: string, lista: Horario[]) => {
        if (!nome.trim()) return;
        window.open(buildWhatsAppUrl(numero, buildMensagem(lista)), "_blank");
    };

    const enviarTodos = () => {
        if (!nome.trim()) return;
        gruposEntries.forEach(([numero, lista]) => enviarGrupo(numero, lista));
        onClose();
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 mb-1">
                <div className="bg-[#25D366]/20 rounded-xl p-2">
                    <MessageSquare className="h-5 w-5 text-[#25D366]" />
                </div>
                <div>
                    <h2 className="font-bold text-base text-foreground">Resumo da Vaga</h2>
                    <p className="text-xs text-muted-foreground">{nomeCampeonato || "Campeonato"}</p>
                </div>
            </div>

            {/* Horários selecionados */}
            <div className="bg-secondary/40 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5" />
                    Horários Selecionados
                </div>
                <ul className="space-y-1.5">
                    {horariosSelecionados.map((h) => (
                        <li key={h.id} className="text-sm font-medium text-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">▸</span>
                            <span>{formatarHora(h)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-primary/10 border border-primary/25 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Total a pagar
                </div>
                <span className="text-lg font-black text-primary">
                    R$ {total.toFixed(2).replace(".", ",")}
                </span>
            </div>

            {/* Nicks */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Nicks da Dupla
                </label>
                <Input
                    placeholder="Ex: JogadorBR / Parceiro"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                    onKeyDown={(e) => e.key === "Enter" && enviarTodos()}
                />
            </div>

            {/* Botões de envio */}
            {multiGrupo ? (
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground font-medium">
                        Seus horários têm organizadores diferentes. Envie para cada um:
                    </p>
                    {gruposEntries.map(([numero, lista], i) => (
                        <button
                            key={numero}
                            disabled={!nome.trim()}
                            onClick={() => { enviarGrupo(numero, lista); if (i === gruposEntries.length - 1) onClose(); }}
                            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-3 rounded-xl gap-2 transition-all w-full text-left"
                        >
                            <MessageSquare className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-sm">
                                Enviar {lista.map(formatarHora).join(", ")}
                            </span>
                            <span className="text-xs font-mono opacity-80">
                                {numero.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4")}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <Button
                    onClick={enviarTodos}
                    disabled={!nome.trim()}
                    className="w-full h-12 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-base rounded-xl gap-2 transition-all"
                >
                    <MessageSquare className="h-5 w-5" />
                    Enviar via WhatsApp
                </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
                Você será redirecionado para o WhatsApp com os detalhes da reserva.
            </p>
        </div>
    );
}
