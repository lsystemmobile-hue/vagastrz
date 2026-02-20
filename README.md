# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como fazer o deploy na Vercel

1.  **Conecte o repositório:** Vá ao painel da Vercel e importe o repositório `vagastrz`.
2.  **Configure as Variáveis de Ambiente:** Vá em *Settings > Environment Variables* e adicione:
    -   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
    -   `VITE_SUPABASE_ANON_KEY`: (Sua chave anônima do Supabase)
3.  **Configurações de Build:** O projeto já está configurado para usar a pasta `dist` e o comando `npm run build`. O arquivo `vercel.json` incluído cuidará do roteamento das páginas.
4.  **Deploy:** Clique em *Deploy* e o site estará no ar!

---

Este projeto foi customizado para incluir sistema de reservas, gerenciamento via WhatsApp por horário, painel administrativo e contador de acessos.
