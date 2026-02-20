
-- Criar tabela de horários
CREATE TABLE public.horarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  descricao TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de configurações
CREATE TABLE public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_numero TEXT NOT NULL DEFAULT '',
  nome_campeonato TEXT NOT NULL DEFAULT 'Campeonato',
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Política pública de leitura de horários (qualquer um pode ver)
CREATE POLICY "Qualquer um pode ver horários" 
ON public.horarios 
FOR SELECT 
USING (true);

-- Política pública de leitura de configurações (qualquer um pode ver número do WhatsApp)
CREATE POLICY "Qualquer um pode ver configurações" 
ON public.configuracoes 
FOR SELECT 
USING (true);

-- Políticas para admin (autenticado) gerenciar horários
CREATE POLICY "Admin pode inserir horários" 
ON public.horarios 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin pode atualizar horários" 
ON public.horarios 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admin pode excluir horários" 
ON public.horarios 
FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para admin (autenticado) gerenciar configurações
CREATE POLICY "Admin pode inserir configurações" 
ON public.configuracoes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin pode atualizar configurações" 
ON public.configuracoes 
FOR UPDATE 
TO authenticated 
USING (true);

-- Inserir configuração padrão
INSERT INTO public.configuracoes (whatsapp_numero, nome_campeonato) 
VALUES ('', 'Campeonato');

-- Inserir alguns horários de exemplo
INSERT INTO public.horarios (data_hora, descricao, ativo) VALUES
  (now() + interval '2 days' + interval '9 hours', 'Manhã - Quadra A', true),
  (now() + interval '2 days' + interval '14 hours', 'Tarde - Quadra A', true),
  (now() + interval '3 days' + interval '9 hours', 'Manhã - Quadra B', true),
  (now() + interval '3 days' + interval '16 hours', 'Final do Dia - Quadra B', false);
