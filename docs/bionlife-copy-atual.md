# BionLife: copy atual e estrutura da página

Referência: `src/BionLifePage.tsx`, estado de 18/09/2026.

A página é uma landing única, com rolagem vertical, e tem **10 blocos** na seguinte ordem:

| # | Bloco | Âncora | Fundo | Função |
|---|---|---|---|---|
| 0 | Header fixo | — | transparente sobre o hero; sólido ao rolar | navegação + CTA consultor |
| 1 | Hero | `#inicio` | foto em tela cheia com véu escuro | promessa principal + 3 destaques |
| 2 | Tecnologia | `#tecnologia` | claro | suporte/adaptação + 3 benefícios |
| 3 | Camadas | — | claro (painel) | explicação das espumas |
| 4 | Massagem | `#massagem` | escuro, com foto | controles Life Vibro e Cromos LCD |
| 5 | Modelos | `#modelos` | claro | carrossel com 3 modelos |
| 6 | Orientação | — | claro (painel) | por que falar com consultor + 3 passos |
| 7 | Entrega | — | faixa clara | embalagem a vácuo |
| 8 | Dúvidas | `#duvidas` | claro | FAQ em acordeão (7 perguntas) |
| 9 | CTA final | — | escuro, com foto | fechamento + 2 botões |
| 10 | Rodapé | — | escuro | marca, links, assinatura Waterfall |

Todos os CTAs de consultor abrem o WhatsApp com esta mensagem:
> "Olá! Vim pelo site da BionLife e quero ajuda para escolher o colchão ideal."

---

## Metadados (aba do navegador e compartilhamento)

- **Título da aba:** BionLife | Conforto, sustentação e massagem
- **Descrição:** Colchões BionLife com densidade progressiva, ActiveCool e opções de massagem integradas.
- **Palavras-chave:** bionlife, colchão de espuma, colchão com massagem, activecool, densidade progressiva
- **Título ao compartilhar:** BionLife | Conforto, sustentação e massagem
- **Descrição ao compartilhar:** Tecnologia aplicada ao conforto, à sustentação e ao relaxamento.

---

## 0. Header

**Estrutura:** logo à esquerda, menu no centro (só no desktop) e botão à direita. Ele fica transparente sobre o hero e ganha fundo sólido quando a página rola.

- **Menu:** Tecnologia · Massagem · Modelos · Dúvidas
- **Botão:** Falar com um consultor (no celular: "Consultor")

---

## 1. Hero

**Estrutura:** foto do quarto em tela cheia, com uma versão vertical própria no celular. O título fica embaixo, à esquerda, com um botão. À direita (no celular, embaixo) há uma faixa com 3 destaques e uma nota pequena.

**Título:**
> Deite cansado.
> Acorde inteiro.

**Botão:** Conhecer os modelos → rola até #modelos

**Destaques (ícone + valor + legenda):**
- ✦ **Ionizado**: camada exclusiva
- ❄ **ActiveCool**: toque mais fresco
- ≈ **Até 20**: tipos de massagem

**Nota:** Os recursos variam conforme o modelo.

> Observação: a ionização aparece **apenas aqui**, na página inteira.

---

## 2. Tecnologia (`#tecnologia`)

**Estrutura:** em cima, título à esquerda e parágrafo à direita. Embaixo, grade de 2 colunas: uma foto grande com texto sobreposto à esquerda e 3 cards escuros empilhados à direita.

**Título:**
> O suporte se adapta ao corpo sem perder estabilidade.

**Parágrafo:**
> Camadas de espuma com densidades diferentes distribuem o apoio ao longo do colchão. Você sente adaptação nas áreas de contato sem depender de uma superfície excessivamente macia ou rígida.

**Texto sobre a foto:**
> **Conforto construído para durar a noite inteira.**
> Espumas de alta resiliência respondem à pressão e recuperam a forma com rapidez, mantendo a sustentação a cada mudança de posição.

**Cards (ícone + título + texto):**
1. **Uma superfície mais fresca ao toque.** Nos modelos com ActiveCool, o revestimento ajuda a reduzir a sensação de calor no contato com o colchão.
2. **Massagem integrada ao seu momento.** Escolha modos, intensidade e duração pelo controle. O próprio colchão participa do seu ritual de relaxamento.
3. **Resposta rápida à pressão.** As espumas de alta resiliência acompanham a mudança de posição e recuperam a forma com agilidade.

---

## 3. Camadas (sem âncora)

**Estrutura:** painel em 2 colunas, com a imagem das camadas de espuma à esquerda e o texto à direita (no celular o texto vem primeiro). O texto termina em uma lista de 3 itens com ícone, separados por linhas.

**Título:**
> Camadas diferentes criam um conforto mais equilibrado.

**Parágrafo:**
> Um colchão feito com uma única densidade entrega uma única resposta. A BionLife combina espumas com funções complementares: adaptação nas áreas de contato, sustentação nas camadas estruturais e estabilidade no conjunto.

**Lista:**
- **Densidade progressiva**: Distribui funções entre as camadas para equilibrar apoio e adaptação.
- **Espumas HR**: Elasticidade, resistência e retorno rápido depois da pressão.
- **Estrutura 100% espuma**: Sustentação uniforme sem depender de molas.

> Observação: os blocos 2 e 3 falam praticamente do mesmo assunto (espuma e suporte).

---

## 4. Massagem (`#massagem`)

**Estrutura:** bloco escuro com a foto do BionLife Elite de um lado e o texto do outro (no celular, a foto fica em cima). O texto tem 2 cards de controle (o segundo com destaque verde-limão), um botão e uma nota.

**Título:**
> Escolha como quer desacelerar.

**Parágrafo:**
> Os modelos com massagem permitem ajustar a experiência ao momento: um ciclo curto no fim do dia, uma intensidade mais leve ou uma programação mais completa.

**Card 1: Life Vibro**
> 8 tipos de massagem e programação de até 15 minutos. Uma operação direta para quem quer relaxar sem configurar demais.
> Etiquetas: `8 modos` `Até 15 min`

**Card 2: Cromos LCD** (destacado)
> 6 motores, 20 tipos de massagem, até 50 minutos de programação, 5 níveis de intensidade e cromoterapia nas versões compatíveis.
> Etiquetas: `20 modos` `5 intensidades` `Até 50 min`

**Botão:** Ver modelos com massagem → #modelos

**Nota:** Controles e funções disponíveis variam conforme o modelo e a configuração escolhida.

---

## 5. Modelos (`#modelos`)

**Estrutura:** título à esquerda e setas ← → à direita. Embaixo, um carrossel horizontal com 3 cards. Cada card tem foto com etiqueta de altura, nome, frase, número (01/02/03), descrição, capacidade de peso com ✓, lista de recursos e o link "Conhecer o [modelo]" (abre o WhatsApp).

**Título:**
> Escolha a combinação certa de altura, suporte e tecnologia.

### 01 · Dream (20 cm)
- **Frase:** Tecnologia essencial sem excessos.
- **Descrição:** Estrutura 100% espuma, densidade progressiva, ActiveCool e opções de massagem em um colchão de perfil mais baixo.
- **✓ Até 130 kg por lado**
- Tecido com tecnologia ActiveCool
- 80 pastilhas magnéticas
- 80 emissores de infravermelho longo
- Controle Life Vibro ou Cromos
- **Link:** Conhecer o Dream

### 02 · Sense Pro (25 cm)
- **Frase:** Mais recursos para personalizar o descanso.
- **Descrição:** Combina três espumas de densidades complementares, revestimento em linho com ActiveCool e as configurações mais completas de massagem da linha.
- **✓ Até 140 kg por lado**
- Sleep Green D33
- ComfyBLU HR Sense D33
- SenseGRAY D28
- 80 pastilhas e 80 emissores
- Life Vibro ou Cromos LCD
- **Link:** Conhecer o Sense Pro

### 03 · Elite (30 cm)
- **Frase:** Mais altura e presença no quarto.
- **Descrição:** O modelo mais alto da linha reúne espumas de densidade progressiva em uma construção mais volumosa, disponível em azul ou cinza.
- **✓ Suporte distribuído**
- 30 cm de altura
- Espumas de densidade progressiva
- Acabamento azul ou cinza
- **Link:** Conhecer o Elite

> Observação: pastilhas magnéticas e infravermelho longo só aparecem aqui, como item de lista, sem nenhuma explicação do benefício. Os cards não citam a ionização.

---

## 6. Orientação (sem âncora)

**Estrutura:** painel com o texto e o botão à esquerda e 3 passos numerados, com ícone, à direita.

**Título:**
> Não escolha seu colchão apenas pela medida.

**Parágrafo:**
> Peso, posição de dormir, sensação de firmeza, altura do colchão e interesse por massagem mudam a escolha. Um consultor BionLife ajuda você a comparar os modelos com base no que pretende sentir e usar todas as noites.

**Botão:** Encontrar meu BionLife → WhatsApp

**Nota:** Receba orientação sobre modelos, medidas, suporte, recursos e disponibilidade.

**Passos:**
1. **Conte como você dorme**: Preferência de firmeza, posição, peso e o que deseja sentir.
2. **Compare as configurações**: Altura, suporte, tecidos e sistemas de massagem disponíveis.
3. **Escolha com orientação**: Entenda qual modelo faz sentido antes de decidir.

---

## 7. Entrega (sem âncora)

**Estrutura:** faixa horizontal com ícone de caixa à esquerda e texto no centro. No desktop grande, aparece também uma pílula "Entrega simplificada" à direita.

**Título:**
> Mais fácil de levar até o quarto.

**Parágrafo:**
> Os colchões BionLife são compactados a vácuo para reduzir o volume durante o transporte. Depois de abertos, recuperam gradualmente o formato e a altura do modelo.

**Frase de fechamento:**
> A embalagem facilita a entrega. A tecnologia dentro do colchão define a experiência.

**Pílula:** Entrega simplificada

---

## 8. Dúvidas (`#duvidas`)

**Estrutura:** 2 colunas. À esquerda ficam o título, o parágrafo e o botão; à direita, o acordeão de perguntas, com a primeira aberta por padrão.

**Título:**
> Dúvidas antes de escolher?

**Parágrafo:**
> Reunimos as respostas que ajudam a comparar tecnologia, conforto e configurações sem transformar a escolha em uma lista de termos técnicos.

**Botão:** Conversar com um especialista → WhatsApp

**Perguntas:**

1. **Todos os colchões BionLife têm massagem?**
   Não. Os controles e recursos variam conforme o modelo e a configuração. Confirme as opções disponíveis antes da compra.

2. **O que significa densidade progressiva?**
   Significa que o colchão combina espumas de densidades diferentes. Cada camada participa da sustentação, da adaptação ou da sensação de conforto.

3. **O ActiveCool deixa o colchão gelado?**
   Não. O revestimento foi desenvolvido para oferecer uma sensação mais fresca ao toque. A percepção térmica varia de acordo com o ambiente, a roupa de cama e cada pessoa.

4. **Qual é a diferença entre Life Vibro e Cromos LCD?**
   O Life Vibro oferece 8 tipos de massagem e ciclos de até 15 minutos. O Cromos LCD oferece 20 tipos, 5 níveis de intensidade, programação de até 50 minutos e cromoterapia nas versões compatíveis.

5. **Quanto tempo o colchão leva para recuperar o formato?**
   A expansão começa depois da abertura e pode levar até 72 horas para ficar completa. Siga as instruções que acompanham o produto.

6. **Quais medidas estão disponíveis?**
   As medidas variam conforme o modelo e a disponibilidade. Consulte um especialista antes da compra.

7. **Os recursos magnéticos e de infravermelho substituem cuidados de saúde?**
   Não. Esses componentes integram a configuração de determinados modelos e são apresentados como recursos de conforto e bem-estar. O colchão não substitui diagnóstico, tratamento ou orientação profissional.

---

## 9. CTA final

**Estrutura:** bloco escuro com uma foto ao fundo que escurece para a esquerda. O texto fica à esquerda, com ícone ✦ verde-limão, título, parágrafo e 2 botões.

**Título:**
> Seu colchão deve combinar com o seu corpo, não o contrário.

**Parágrafo:**
> Compare os modelos BionLife e escolha a configuração de sustentação, conforto térmico e massagem que faz sentido para você.

**Botões:**
- Falar com um consultor → WhatsApp
- Comparar os modelos → #modelos

---

## 10. Rodapé

**Estrutura:** logo e frase à esquerda, links à direita e, embaixo, uma linha com copyright e assinatura.

**Frase:**
> Colchões com tecnologia aplicada ao conforto, à sustentação e ao relaxamento.

**Links:** Tecnologia · Massagem · Modelos · Dúvidas · Fale conosco · Política de privacidade

**Linha final:** © 2026 BionLife. Todos os direitos reservados. · Uma marca Waterfall.

---

## Resumo: onde cada recurso aparece hoje

| Recurso | Onde aparece | Peso na página |
|---|---|---|
| **Ionização** | só o destaque do hero ("Ionizado, camada exclusiva") | mínimo |
| Espumas / densidade / suporte | blocos 2 e 3 inteiros, cards de modelo, FAQ 2 | **o maior** |
| Massagem | bloco 4 inteiro, card do bloco 2, FAQ 1 e 4 | alto |
| ActiveCool | hero, card do bloco 2, modelos, FAQ 3 | médio |
| Pastilhas magnéticas | lista dos modelos Dream e Sense Pro, FAQ 7 | baixo, sem benefício explicado |
| Infravermelho longo | lista dos modelos Dream e Sense Pro, FAQ 7 | baixo, sem benefício explicado |
| Cromoterapia | card Cromos LCD, FAQ 4 | baixo |
| Embalagem a vácuo | bloco 7 inteiro, FAQ 5 | médio |
