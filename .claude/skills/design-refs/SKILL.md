---
name: design-refs
description: Usa a biblioteca de 124 referências visuais em "WEBSITE REFS" (board Pinterest de landing pages) como base de design ao criar, redesenhar ou ajustar visualmente uma página, seção ou componente. Aciona quando o usuário pede uma landing page, hero, seção nova, "nova página", redesign, "usa as refs", "no estilo das referências", ou pede uma direção visual para o site Waterfall. Seleciona referências pelo setor/estilo/cor, LÊ as imagens, extrai um sistema de design (paleta, tipografia, ritmo, layout, motion) e implementa em React + Tailwind seguindo os tokens já existentes do projeto.
---

# Design a partir das referências visuais

Biblioteca: `C:/Users/kohii/OneDrive/Área de Trabalho/WEBSITE REFS` — 124 imagens de landing pages reais.
Nome dos arquivos: `SETOR_ESTILO_COR_NNN.ext` (ex.: `BEBIDA_HIDRATACAO_AZUL_CLINICA_070.png`).

Índice completo por setor, estilo e cor: `references/catalogo.md`. Lista crua: `references/arquivos.txt`.

## Regra inegociável

**Nunca projete a partir do nome do arquivo.** O nome só serve para pré-selecionar. Você tem que abrir as imagens escolhidas com a ferramenta **Read** (ela renderiza imagens) e descrever o que realmente vê antes de escrever qualquer linha de código.

## Processo

### 1. Entender o pedido
Identifique: que página/seção, que produto ou setor, que sensação (premium, clínico, divertido, brutalista, editorial...). Se o usuário já indicou um estilo ou uma referência específica, respeite.

Se o pedido for ambíguo entre direções muito diferentes (ex.: "dark neon" vs "editorial claro"), pergunte **uma** vez com 2–3 opções concretas. Caso contrário, escolha e siga.

### 2. Selecionar referências
Consulte `references/catalogo.md` e escolha **3 a 6** arquivos:
- 1–2 do **setor** mais próximo (para Waterfall: `Bebida / Água / Hidratação`, `Saúde / Clínica`, `Tech`).
- 1–2 do **estilo** pedido (DARK, EDITORIAL, MINIMALISTA, BRUTALISTA, ORGANICA...).
- 1–2 "curinga" de outro setor com o mesmo clima — é daí que vem a originalidade.

Prefira variar: não reutilize sempre as mesmas imagens entre pedidos.

### 3. Ler as imagens
Abra cada arquivo escolhido com Read (caminho absoluto completo, com acentos). Para cada uma, anote em 2–4 linhas:
- **Cor**: fundo, cor de acento, quantas cores realmente aparecem, se é claro ou escuro.
- **Tipografia**: serif ou sans, peso do display, contraste de escala entre título e corpo, se há caixa alta / tracking negativo.
- **Layout**: grid, assimetria, largura do conteúdo, densidade, uso de bordas/cards/bento.
- **Profundidade**: sombra, ruído, gradiente, vidro, plano chapado.
- **Fotografia/asset**: recorte, tratamento, se o produto flutua, sangra ou fica em card.
- **O truque**: o único detalhe que faz aquela página parecer cara.

### 4. Sintetizar uma direção
Escreva ao usuário, curto (máx. ~10 linhas), antes de implementar:
- Referências usadas (nomes dos arquivos).
- A direção em uma frase.
- Paleta com valores hex concretos, escala tipográfica, ritmo de espaçamento, tratamento de bordas/raio, motion.

**Sintetize, não copie.** O resultado tem que ser uma terceira coisa — nunca um clone de um pin.

### 5. Implementar
- Respeite o stack e as convenções do projeto (React + TypeScript + Tailwind + Vite, componentes em `components/ui/`, tokens em `src/index.css`).
- Se o projeto já tem tokens de cor/tipografia, **estenda-os** em vez de inventar um sistema paralelo. Só proponha romper com os tokens existentes se o usuário pediu um redesign explícito — e avise que está rompendo.
- Use os assets reais em `public/images/`; não invente caminhos de imagem.
- Responsivo de verdade: verifique mobile (375) e desktop.

### 6. Verificar
Suba o preview (`preview_start`), tire screenshot em desktop e mobile, cheque console e mostre o resultado. Não peça ao usuário para conferir manualmente.

## Critérios de qualidade

Antes de entregar, cheque:
- [ ] Abri e descrevi as imagens de referência (não só os nomes).
- [ ] A paleta tem hierarquia clara: fundo, superfície, texto, **um** acento dominante.
- [ ] Escala tipográfica com contraste real (display grande de verdade, não `text-2xl`).
- [ ] Espaçamento com ritmo consistente, não valores aleatórios.
- [ ] Existe pelo menos um momento visual memorável — o "truque" da etapa 3.
- [ ] Nada de cara de template: sem hero centrado genérico + 3 cards + gradiente roxo padrão.
- [ ] Contraste acessível (texto corpo ≥ 4.5:1).
- [ ] Funciona em mobile.

## Notas
- Os textos devem sair em **português do Brasil**, salvo pedido contrário.
- Se a pasta de referências não estiver acessível, avise e siga com a direção descrita pelo usuário — não invente o conteúdo das imagens.
