# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Consumidor final brasileiro comprando para a própria casa. Dois públicos convivem no mesmo repositório:

- **Water Diamond Ion Center:** quem quer mudar a água da casa (filtragem, purificação, alcalinização, ionização) e avalia uma central instalada na cozinha.
- **BionLife:** quem procura mais conforto, sustentação e recursos de relaxamento em um colchão. A conveniência da entrega a vácuo é relevante, mas não é o motivo central da compra.

Em ambos os casos a decisão passa por um consultor humano antes da compra. O visitante chega para entender e comparar, não para finalizar um checkout.

## Product Purpose

Site institucional e de geração de leads da Waterfall. Apresenta as linhas de produto, explica a tecnologia de cada uma e encaminha o visitante para conversa com um consultor. Sucesso = o visitante entende qual configuração serve para ele e inicia contato.

## Positioning

- **Ion Center:** central de tratamento de água instalada, não um filtro de ponto de uso.
- **BionLife:** o colchão reúne tecnologias distintas que atuam em momentos diferentes do descanso — espumas de densidade progressiva para sustentar, alta resiliência para adaptar, revestimento ActiveCool para a sensação térmica, sistemas de massagem para desacelerar. A embalagem a vácuo é conveniência de transporte, nunca o argumento de compra.

Cada recurso precisa aparecer ligado ao que muda na experiência, não como lista de nomes técnicos.

## Operating Context

- Venda consultiva via WhatsApp (5547992828752). Todos os CTAs principais abrem conversa com mensagem já contextualizada pela origem do lead.
- Formulários existentes usam Web3Forms (`lib/forms.ts`), com chaves separadas por origem: contato, consultor, fitacademia.
- Rotas atuais resolvidas por `window.location.pathname` em `src/App.tsx`: `/` (home Ion Center), `/consultor`, `/fitacademia`, documentos legais. Sem router; SPA servida por Apache com fallback para `index.html` (`public/.htaccess`).
- BionLife é servida em subdomínio próprio (`bionlife.`), com a marca BionLife como protagonista. Waterfall aparece uma única vez, discreta, na assinatura do rodapé.

## Capabilities and Constraints

- Stack existente: Vite 6 + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`) + `motion`. Alias `@` para a raiz do projeto.
- CSP restritiva no `.htaccess`: `default-src 'self'`. Fontes, imagens e scripts precisam ser auto-hospedados; a única conexão externa liberada é `api.web3forms.com`.
- Fontes auto-hospedadas em `public/fonts/` (Poppins 300–700) declaradas em `src/index.css`.
- Ícones: `lucide-react` já é dependência do projeto e é a família usada em todas as páginas.
- Sem framework de rotas: uma página nova entra como componente lazy despachado em `src/App.tsx`.

### Linha BionLife — fatos confirmados pelo cliente

Modelos, alturas e recursos (aprovados para publicação):

- **BionLife Dream** — 20 cm; 100% espuma; suporte indicado até 130 kg por lado; espumas em densidade progressiva; tecido com ActiveCool; 80 pastilhas magnéticas; 80 emissores de infravermelho longo; controle Life Vibro ou Cromos; embalagem a vácuo.
- **BionLife Sense Pro** — 25 cm; 100% espuma; suporte indicado até 140 kg por lado; camadas Sleep Green D33, ComfyBLU HR Sense D33 e SenseGRAY D28; revestimento em linho com ActiveCool; 80 pastilhas magnéticas; 80 emissores de infravermelho longo; controle Life Vibro ou Cromos LCD; embalagem a vácuo.
- **BionLife Elite** — 30 cm; espumas de densidade progressiva; disponível em azul e cinza; embalagem a vácuo. Capacidade de peso e composição completa ainda não definidas.

Controles de massagem:

- **Life Vibro** — 8 tipos de massagem, programação de até 15 minutos.
- **Cromos LCD** — 6 motores, 20 tipos de massagem, até 50 minutos de programação, 5 níveis de intensidade, cromoterapia nas versões compatíveis.

Expansão após desembalar: até 72 horas, conforme modelo e ambiente.

Recursos variam por modelo. A página nunca pode sugerir que todos os recursos existem em todas as configurações.

## Brand Commitments

- Waterfall (grafado "Water Diamond" na linha de água) é a marca institucional. Na página BionLife ela aparece só no rodapé, como "Uma marca Waterfall."
- Idioma: português do Brasil.
- **Restrição de linguagem (vinculante):** sem promessas médicas, sem linguagem pseudocientífica, sem adjetivos vazios. Pastilhas magnéticas, infravermelho longo e cromoterapia são apresentados como componentes de conforto e relaxamento. Nota obrigatória na página: o colchão não substitui diagnóstico, tratamento ou orientação de profissionais de saúde.
- Sem imagens médicas, ilustrações de coluna, jalecos ou promessas de cura.
- Sem rótulos decorativos ou textos em caixa alta acima dos títulos.
- Tom BionLife: tecnológico, claro e sensorial.

## Evidence on Hand

- Copy final da página BionLife fornecida pelo cliente, seção a seção, incluindo FAQ e alternativas de hero. É a fonte de verdade textual.
- **Não existem ainda:** fotos do produto, corte real das camadas, foto dos controles, logotipo BionLife em arquivo. A página é construída com espaços reservados descritos, para receber material real depois.
- Não existem depoimentos, avaliações, prêmios, números de venda ou certificações confirmados. Nada disso pode ser inventado.

### Pendências declaradas pelo cliente (não inventar)

Medidas disponíveis por modelo; prazo recomendado antes do primeiro uso; garantia, assistência e política de troca; regiões de entrega e frete; cores e acabamentos por modelo; quais modelos têm cada recurso; capacidade de peso e composição do Elite; certificações e registros; aprovação jurídica de "magnético", "infravermelho longo" e "cromoterapia"; se a expansão de 72 horas vale para toda a linha.

## Product Principles

1. Toda tecnologia aparece colada ao benefício que ela produz. Nome técnico sozinho não entra na página.
2. A escolha do modelo é uma conversa, não um checkout. O consultor é o próximo passo declarado.
3. A conveniência (vácuo, transporte) nunca ocupa o lugar do argumento central, que é o que acontece quando a pessoa se deita.
4. Nenhum recurso é apresentado como universal da linha quando é opcional por configuração.
5. O que ainda não foi confirmado pelo cliente fica de fora da página, marcado como pendência, nunca preenchido com estimativa.

## Accessibility & Inclusion

Sem requisito formal declarado pelo cliente. O piso é WCAG AA para contraste de texto e controles, navegação por teclado nos elementos interativos e respeito a `prefers-reduced-motion`.
