# PDV Reporter — Ideias de Design

## Contexto
Aplicativo mobile-first para analistas de campo registrarem pontos de venda não credenciados (Feira Livre, Varejista, Banca de Rua, Hortifruti). O uso principal é em campo, ao ar livre, com o celular na mão.

---

<response>
<text>

## Ideia 1 — "Field Ops" (Operacional de Campo)

**Design Movement:** Material Design 3 + Utility Industrial
**Probabilidade:** 0.08

**Core Principles:**
- Clareza máxima para uso ao ar livre (alto contraste)
- Hierarquia de informação imediata — o analista não tem tempo a perder
- Feedback visual rápido e inequívoco
- Formulários otimizados para toque com dedos

**Color Philosophy:**
- Laranja vibrante (#F97316) como cor primária — energia, campo, ação
- Fundo branco puro com cards cinza-claro — legibilidade ao sol
- Verde (#22C55E) para sucesso, vermelho (#EF4444) para erros
- Intenção: confiança operacional, não corporativo frio

**Layout Paradigm:**
- Bottom navigation bar fixa para acesso rápido
- Cards empilhados verticalmente com swipe
- Formulário em etapas (stepper) para não sobrecarregar
- FAB (Floating Action Button) laranja para novo registro

**Signature Elements:**
- Ícones de categoria com cores distintas por tipo de PDV
- Badges de status (Enviado, Pendente, Erro)
- Progress bar no topo do formulário

**Interaction Philosophy:**
- Toque único para as ações mais comuns
- Confirmação visual imediata após salvar
- Modo offline com sincronização posterior

**Animation:**
- Slide-in de baixo para cima ao abrir formulário
- Fade suave entre etapas do stepper
- Shake leve em campos obrigatórios não preenchidos

**Typography System:**
- Títulos: Inter Bold 700
- Corpo: Inter Regular 400
- Labels: Inter Medium 500, uppercase com letter-spacing

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Ideia 2 — "Verde Campo" (Escolhida)

**Design Movement:** Organic Field + Clean Data Entry
**Probabilidade:** 0.07

**Core Principles:**
- Verde como identidade — campo, natureza, hortifruti
- Formulário limpo e direto, sem distrações
- Mobile-first absoluto — tudo pensado para polegar
- Dados organizados em seções colapsáveis

**Color Philosophy:**
- Verde escuro (#166534) como cor primária — autoridade, campo, confiança
- Verde médio (#16A34A) como accent — ações positivas
- Fundo off-white (#F8FAF8) — suave, não cansa os olhos
- Cinza quente (#6B7280) para textos secundários
- Intenção: profissional de campo, não escritório

**Layout Paradigm:**
- Header compacto com logo + título da tela
- Seções com cards separados por tipo de dado
- Formulário em scroll vertical contínuo com seções agrupadas
- Sticky footer com botão de salvar/exportar

**Signature Elements:**
- Ícones de estabelecimento coloridos (cada tipo tem sua cor)
- Chip/badge de tipo de PDV selecionado no topo
- Mapa miniatura inline para confirmar localização GPS

**Interaction Philosophy:**
- Seleção de tipo de PDV com cards visuais grandes (fácil de tocar)
- GPS com um toque — feedback imediato
- Câmera integrada com preview da foto

**Animation:**
- Cards de tipo de PDV com scale ao selecionar
- Seções que expandem suavemente
- Checkmark animado ao salvar com sucesso

**Typography System:**
- Títulos: Poppins SemiBold 600
- Corpo: Inter Regular 400
- Labels: Inter Medium 500
- Números/dados: Poppins Mono ou tabular nums

</text>
<probability>0.07</probability>
</response>

---

<response>
<text>

## Ideia 3 — "Relatório Técnico" (Corporativo Moderno)

**Design Movement:** Enterprise Minimal + Data-Forward
**Probabilidade>0.06

**Core Principles:**
- Azul corporativo como identidade — profissionalismo, dados
- Densidade de informação alta — analistas experientes
- Tabelas e listas como padrão de visualização
- Exportação como feature central

**Color Philosophy:**
- Azul (#1D4ED8) como primário — corporativo, dados, confiança
- Fundo branco puro com bordas sutis
- Amarelo (#F59E0B) para alertas e destaques
- Intenção: relatório técnico, auditoria, compliance

**Layout Paradigm:**
- Sidebar colapsável com navegação
- Tabela de registros como tela principal
- Modal para novo registro
- Dashboard com métricas no topo

**Signature Elements:**
- Tabela de dados com filtros e ordenação
- Status pills coloridos
- Gráfico de barras de registros por tipo

**Interaction Philosophy:**
- Filtros avançados para analistas experientes
- Exportação em múltiplos formatos
- Busca rápida por qualquer campo

**Animation:**
- Transições de página suaves
- Skeleton loading para dados
- Toast notifications para feedback

**Typography System:**
- Títulos: IBM Plex Sans Bold
- Corpo: IBM Plex Sans Regular
- Dados: IBM Plex Mono

</text>
<probability>0.06</probability>
</response>

---

## Decisão Final

**Escolhida: Ideia 2 — "Verde Campo"**

Motivo: O aplicativo será usado por analistas em campo (feiras livres, ruas, mercados). O verde remete diretamente ao contexto de hortifruti e campo. O design é limpo, mobile-first e otimizado para uso com uma mão, ao ar livre.
