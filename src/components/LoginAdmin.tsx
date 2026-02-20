import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Lock } from "lucide-react";

interface LoginAdminProps {
  onLogin: () => void;
}

export function LoginAdmin({ onLogin }: LoginAdminProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("Email ou senha incorretos.");
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="bg-primary rounded-2xl p-4 inline-flex mb-4">
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm mt-1">Acesso restrito ao organizador</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-primary" />
            <span className="font-semibold">Entrar</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-muted-foreground text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="senha" className="text-muted-foreground text-sm">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="mt-1 bg-secondary border-border"
              />
            </div>

            {erro && (
              <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 font-bold">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
