import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Plane } from "lucide-react";
import { Horario } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface HorarioCardProps {
  horario: Horario;
  selected: boolean;
  onToggle: (id: string) => void;
  isDiario?: boolean;
}

export function HorarioCard({ horario, selected, onToggle, isDiario }: HorarioCardProps) {
  const dataHora = new Date(horario.data_hora);
  const disponivel = horario.ativo;

  return (
    <div
      onClick={() => disponivel && onToggle(horario.id)}
      className={cn(
        "relative rounded-xl border-2 p-4 transition-all duration-200 flex items-center gap-4",
        disponivel
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-50",
        selected && disponivel
          ? "border-primary bg-primary/10 glow-primary"
          : disponivel
            ? "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            : "border-border bg-card"
      )}
    >
      {/* Status badge - Top Right */}
      <div className="absolute top-2 right-2">
        {disponivel ? (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/20 text-primary"
          )}>
            {selected ? "✓ Selecionado" : "Disponível"}
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/20 text-destructive uppercase tracking-wider">
            Encerrado
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-16 sm:pr-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <span className="text-2xl font-bold text-foreground">
              {format(dataHora, "HH:mm")}
            </span>
          </div>

          {/* Date (Conditional) */}
          {!isDiario && (
            <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-4">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {format(dataHora, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex items-center gap-2 mt-1">
          <Plane className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground truncate">{horario.descricao}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 self-end">
        {/* Price - Large subtle */}
        <span className="text-5xl font-black text-primary/10 select-none pb-1">
          R$5
        </span>
      </div>
    </div>
  );
}
