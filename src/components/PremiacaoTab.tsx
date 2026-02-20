import { useState } from "react";
import { Trophy, Zap, Heart, Star, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PremiacaoTab() {
    const [kills, setKills] = useState<string>("");
    const valorKill = 0.5;
    const totalKills = parseFloat(kills) || 0;
    const ganhoKills = totalKills * valorKill;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Regras do campeonato */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Regras do Campeonato
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1">💰</span>
                        <span className="text-xs text-muted-foreground font-medium">Inscrição</span>
                        <span className="text-base font-bold text-foreground">R$ 5,00</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1">💀</span>
                        <span className="text-xs text-muted-foreground font-medium">Cada Kill</span>
                        <span className="text-base font-bold text-foreground">R$ 0,50</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1">❤️</span>
                        <span className="text-xs text-muted-foreground font-medium">Reviver</span>
                        <span className="text-base font-bold text-foreground">Liberado</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1">⭐</span>
                        <span className="text-xs text-muted-foreground font-medium">Level mínimo</span>
                        <span className="text-base font-bold text-foreground">40</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center sm:col-span-2">
                        <span className="text-2xl mb-1">🪂</span>
                        <span className="text-xs text-muted-foreground font-medium">Mapa</span>
                        <span className="text-base font-bold text-foreground">1 Queda Bermuda</span>
                    </div>
                </div>
            </div>

            {/* Premiações */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Premiações
                </h3>
                <div className="space-y-3">
                    {/* 1º Lugar */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 border border-yellow-500/30">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🥇</span>
                            <div>
                                <p className="font-bold text-foreground">1º Lugar</p>
                                <p className="text-xs text-muted-foreground">Campeão do Diário</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-yellow-400">R$ 20,00</span>
                    </div>

                    {/* 2º Lugar */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-slate-400/20 to-slate-300/10 border border-slate-400/30">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🥈</span>
                            <div>
                                <p className="font-bold text-foreground">2º Lugar</p>
                                <p className="text-xs text-muted-foreground">Vice-campeão</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-300">R$ 10,00</span>
                    </div>

                    {/* 3º Lugar */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-400/10 border border-orange-500/30">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🥉</span>
                            <div>
                                <p className="font-bold text-foreground">3º Lugar</p>
                                <p className="text-xs text-muted-foreground">Pódio garantido</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-orange-400">R$ 5,00</span>
                    </div>
                </div>
            </div>

            {/* Calculadora de Kills */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Bônus de Kills
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Cada kill vale <strong>R$ 0,50</strong>, independente da sua posição final.
                </p>

                <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                    <label className="text-sm font-semibold text-foreground">Calcule seu ganho:</label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min={0}
                            placeholder="Nº de kills"
                            value={kills}
                            onChange={(e) => setKills(e.target.value)}
                            className="bg-background border-border text-center text-lg font-bold w-36 h-12"
                        />
                        <span className="text-muted-foreground text-sm">kills × R$ 0,50 =</span>
                        <span className={`text-xl font-black ${ganhoKills > 0 ? "text-green-400" : "text-muted-foreground"}`}>
                            R$ {ganhoKills.toFixed(2).replace(".", ",")}
                        </span>
                    </div>
                    {totalKills > 0 && (
                        <p className="text-xs text-primary font-medium animate-in fade-in duration-300">
                            🎉 Com {totalKills} kill{totalKills !== 1 ? "s" : ""} você recebe R$ {ganhoKills.toFixed(2).replace(".", ",")} de bônus!
                        </p>
                    )}
                </div>

                <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
                    <p className="text-xs text-primary font-medium">
                        Exemplo: 4 kills = R$ 2,00 de bônus independente da colocação.
                    </p>
                </div>
            </div>

            {/* Level mínimo destaque */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium">LEVEL MÍNIMO DA CONTA PARA JOGAR</p>
                <p className="text-5xl font-black text-primary mt-1">40</p>
            </div>
        </div>
    );
}
