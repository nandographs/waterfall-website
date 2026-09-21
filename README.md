# Water Diamond — site

Site institucional da linha Water Diamond Ion Center (React + Vite + Tailwind).

Rotas: `/` (home), `/consultor`, `/fitacademia`, `/politica-de-privacidade`, `/termos-de-uso`.

## Estrutura

```
src/
  App.tsx            home, header/menu compartilhados e roteamento
  pages/             Consultor, FitAcademia, BionLife (+ bionlife.css)
  components/ui/     componentes reutilizáveis
  lib/               utilitários e formulários (Web3Forms, WhatsApp)
public/              arquivos servidos como estão (imagens .webp, vídeos, fontes, ícones)
assets-originais/    masters em alta das imagens e vídeos (não vão para o site)
scripts/             otimização de imagens e build da BionLife
docs/                material de apoio (QA de design, copy)
```

O alias `@/` aponta para `src/` (ex.: `@/components/ui/button`).

## Rodar localmente

**Pré-requisitos:** Node.js 20+

```bash
npm install
npm run dev
```

Os formulários usam o Web3Forms. Copie `.env.example` para `.env.local` e preencha as
chaves para poder trocá-las sem recompilar (elas são públicas por design — o Web3Forms
usa a chave como endereço de entrega, não como segredo).

## Build e deploy

```bash
npm run build
```

O conteúdo de `dist/` é o que sobe para a hospedagem, incluindo o `.htaccess`
(headers de segurança, compressão, cache e as rotas da SPA).

## Imagens e vídeos

Os arquivos originais em alta ficam em `assets-originais/` e **não** vão para o site.
O que é servido são as versões `.webp` em `public/images`, geradas por:

```bash
npm run images
```

Para adicionar uma imagem nova: coloque o original em `assets-originais/images/`,
inclua o nome no `MANIFEST` de [scripts/optimize-images.mjs](scripts/optimize-images.mjs)
e rode o comando acima. Cada imagem gera duas larguras (`nome.webp` e `nome-sm.webp`),
usadas via `srcset` para o celular baixar o arquivo menor.

Os vídeos de fundo em `public/videos` são versões comprimidas e sem faixa de áudio
(os originais estão em `assets-originais/videos`). Eles só começam a carregar depois
que a página termina de abrir, e o celular recebe o arquivo `-mobile`.
