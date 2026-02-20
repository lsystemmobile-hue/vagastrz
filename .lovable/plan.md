
## App de Vagas para Campeonato 🏆

### Visão Geral
Uma plataforma web com duas áreas: uma página pública para os participantes escolherem horários e enviarem pelo WhatsApp, e um painel administrativo para gerenciar os horários e configurações.

---

### 1. Página Pública (Participantes)
- **Lista de horários disponíveis** em cards visuais, mostrando data, hora e status (disponível/encerrado)
- **Seleção de múltiplos horários** com checkboxes
- **Resumo dinâmico** que calcula automaticamente o valor total (nº de vagas × R$5,00)
- **Formulário simples** com nome e número do WhatsApp do participante
- **Botão "Reservar via WhatsApp"** que gera uma mensagem pré-formatada e abre o WhatsApp do admin com todos os detalhes (horários escolhidos, valor total, dados do participante)
- Horários desativados aparecem bloqueados e não podem ser selecionados

---

### 2. Painel Administrativo
- **Acesso protegido** com senha/login simples
- **Gerenciar Horários**: adicionar novos horários (data + hora + descrição), editar e excluir
- **Ativar/Desativar vagas** manualmente com um toggle — quando desativado, o horário aparece como "Encerrado" na página pública
- **Configurações**: campo para definir o número de WhatsApp que receberá as mensagens (com código do país)
- **Visão geral** dos horários cadastrados em uma tabela

---

### 3. Banco de Dados (Backend com Lovable Cloud)
Serão criadas duas tabelas:
- **horarios**: id, data_hora, descricao, ativo, criado_em
- **configuracoes**: whatsapp_numero (número do admin)

---

### 4. Fluxo do Participante
1. Acessa a página → vê os horários disponíveis
2. Seleciona um ou mais horários → valor total é calculado automaticamente
3. Preenche nome e WhatsApp
4. Clica em "Enviar pelo WhatsApp" → abre o app/web do WhatsApp com mensagem pronta para o admin

---

### Design
- Visual esportivo e moderno, com cores fortes (verde e preto)
- Layout responsivo, otimizado para celular (já que a maioria acessa pelo celular)
- Cards de horários claros e fáceis de tocar na tela

