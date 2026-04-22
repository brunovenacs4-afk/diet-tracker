# Deploy no Render — emagrecer neh carai

Este projeto é um app Expo (React Native) publicado como **site estático** (Expo Web)
no Render. Tudo que o usuário faz fica salvo no próprio navegador (AsyncStorage), não
existe backend.

## Modo automático (recomendado)

1. Suba o repositório no GitHub.
2. No Render, clique em **New → Blueprint** e aponte para este repositório.
3. O Render lê o `render.yaml` na raiz e cria automaticamente um **Static Site**
   chamado `emagrecer-neh-carai`.
4. Pronto — primeiro build leva ~3 minutos. Depois disso o app fica disponível em
   `https://emagrecer-neh-carai.onrender.com` (ou no domínio que tu configurar).

## Modo manual

Se preferir criar sem o blueprint:

- **Type:** Static Site
- **Build Command:**
  ```
  corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @workspace/diet-tracker run build:web
  ```
- **Publish Directory:** `artifacts/diet-tracker/dist`
- **Rewrite Rule (Redirects/Rewrites):**
  - Source: `/*`
  - Destination: `/index.html`
  - Action: Rewrite (status 200)

## Build local pra testar antes

```
pnpm install
pnpm --filter @workspace/diet-tracker run build:web
npx serve artifacts/diet-tracker/dist
```
