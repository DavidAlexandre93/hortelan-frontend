# HORTELAN-V2 ⭐️

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Automated and monitored smart garden

### ✨ [Live Demo](https://hortelan-frontend.vercel.app/dashboard/app)

## Support is contiguous 

Leave a ⭐️ If this project got you going!
<p>
  <a href="https://www.buymeacoffee.com/davidfernandes"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="buymeacoffee.com/davidfernandes" /></a>
</p>
<br /><br />

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Backend API

O frontend agora tenta autenticar usando os endpoints do backend via `VITE_API_BASE_URL`.

Crie um arquivo `.env` com:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

Endpoints utilizados no frontend:

- `POST /auth/login`
- `POST /auth/social-login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `GET /auth/validate-reset-token?token=...`
- `POST /auth/reset-password`


## Blockchain + SSR

### Blockchain (EVM)

Foi adicionada uma integração inicial de blockchain no dashboard com:

- Conexão de carteira EVM (ex.: MetaMask);
- Assinatura de mensagem para checkpoint de cultivo;
- Envio de transação nativa (ETH) para endereço informado.

### SSR seletivo

Também foi incluído SSR seletivo com Vite para rotas específicas:

- `/login`
- `/register`
- `/forgot-password`

Comandos:

```bash
npm run serve:ssr     # desenvolvimento com SSR via Vite middleware
npm run build:ssr     # build do cliente + bundle SSR
NODE_ENV=production npm run serve:ssr
```
