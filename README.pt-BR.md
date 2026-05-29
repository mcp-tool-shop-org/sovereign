<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**O Jogo de Tabuleiro Hamilton System · adaptação para um jogador / digital**

*Fundação de Crédito · Financie a dívida. Construa o banco. Industrialize a República.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Status — v1.5.0 (beta).** A versão "para torná-lo mais envolvente", baseada na versão estratégica v1.4. Cinco camadas estão presentes aqui: **presença do rival** (posições de influência visíveis + linhas de postura por oponente que eliminam o vazio do jogo solo paralelo), **a Espiral de Crédito** (a pressão do fracasso agora é sentida, cumulativa e *recuperável* — um imposto de pagamento de dívidas, uma aceleração telegrafada em direção ao calote, uma previsão e uma tábua de salvação de reforma — e ela carrega a tese cívica: você sente *por que* o crédito público é importante), **efeitos visuais e sonoros** (números em transição com assimetria de ganho/perda, áudio procedural ZzFX em 13 momentos, coreografia de ação, uma configuração de VELOCIDADE Cinematográfica / Normal / Rápida, acessibilidade total), **Nível Crônico B** (15 *Saiba Mais* pop-ups, a enciclopédia Ledger do Crônico — 27 citações verificadas mais Atos / eventos / níveis / Visões — e 10 dicas de glossário) e **integração** (um guia "Debate sobre Financiamento de 1790" de início rápido + um sistema que não esconde nada ao passar o mouse / focar). Duas situações difíceis do jogo que surgiram na v1.4.0 são corrigidas (leilões acionados por cartas; compra com dinheiro insuficiente), e a fidelidade de salvamento / carregamento / repetição é restaurada (`SAVE_VERSION = v0.26-replay-fidelity-candidate`). A duração média do jogo é de **~22 rodadas (~66 turnos)**; a condição final acionada pelo circuito permanece inalterada. O equilíbrio medido (CANÔNICO × 100): Tesouro **48 %** / Comerciante **34 %** / Fabricante **18 %** — todos os três perfis vencem de forma significativa. **A v1.5.0 é uma versão beta, pendente de uma avaliação completa de ponta a ponta com um novo jogador** (o portão de jogabilidade). O jogo de tabuleiro imprimível permanece estável na v0.2. Consulte `CHANGELOG.md` para obter o delta completo e as ressalvas da versão beta.

---

## O que é

Sovereign é um **jogo de tabuleiro do sistema Hamilton, com a gramática de Monopoly**, sobre a fundação do crédito público dos EUA, mais uma **adaptação para um jogador / digital** que executa as mesmas regras localmente em um navegador contra dois oponentes com scripts determinísticos.

- **Jogo de tabuleiro** — edição imprimível de 34 folhas. Tabuleiro de 40 espaços, 22 propriedades + 4 rotas + 2 instituições, 8 sistemas de cores, 7 Atos do Congresso em ordem histórica fixa, 4 papéis de jogador, 3 trilhas compartilhadas (Crédito Público · Resistência Pública · Capacidade Industrial), 12 + 12 cartas de evento. Dois caminhos econômicos viáveis além do Tesouro: Comerciante e Fabricante. Equilíbrio da v0.2, congelado.
- **Modo digital** — um único arquivo HTML autocontido. Condição final baseada em circuito: o jogo termina quando um jogador completa sua quarta passagem pelo Tesouro Aberto. Duração média do jogo **~22 rodadas (~66 turnos)**. No Balanço Final, o jogador com maior influência vence, *não necessariamente aquele que percorreu o tabuleiro primeiro*. Camada de presença do rival: posições de influência visíveis + linhas de postura por oponente. Camada de profundidade estratégica: três Ações Especiais bloqueadas por perfil, seis cartas HAND com janelas de tempo, ação de recuperação de Reforma, a Espiral de Crédito em várias etapas (Dúvida Pública → Crise → Pânico → Calote) com um imposto de pagamento de dívidas, aceleração telegrafada, previsão e uma tábua de salvação de Reforma. Camada de arco estratégico: oito Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8, três Visões de Perfil com bônus de fim de jogo. Camada de narração do Crônico: 14 banners históricos vinculados a eventos mais o informativo Nível B (pop-ups "Saiba Mais", a enciclopédia Ledger do Crônico, dicas de glossário), citações reais dos Artigos Federalistas e Founders Online, mensagem persistente com × para descartar. Efeitos visuais e sonoros: números em transição, áudio procedural ZzFX (13 momentos), uma configuração de VELOCIDADE Cinematográfica / Normal / Rápida. RNG determinístico mulberry32, oponentes de IA com scripts, salvamento / carregamento com integridade de hash, repetição, ferramenta de simulação em lote controlada pelo designer.
- **Linha de base do equilíbrio** — circuito + profundidade estratégica + arco estratégico + Crônico + Espiral de Crédito (beta v1.5.0): Tesouro **48 %** · Comerciante **34 %** · Fabricante **18 %** (CANÔNICO × 100, medido em relação ao mecanismo ativo por meio de `test/measure-stats.mjs`). Todos os três perfis vencem de forma significativa, com o Tesouro sendo o mais forte, em linha com a tese histórica. Todas as três Visões de Perfil (Arquiteto do Crédito Federal / Soberano do Comércio / Fundador Industrial) são alcançáveis e aproximadamente equilibradas — cada uma ocorre em ~41–43 % dos jogos. A mecânica subjacente da v0.18 (Crise de Crédito, pontuação de IP em dinheiro, Carta Industrial, bônus de conclusão de conjunto) é preservada, idêntica, desde o arco de design v0.3 → v0.10 → v0.18, impulsionado por mais de 1.000 jogos de simulação determinísticos.

---

## Como começar

### Jogue em seu navegador (instalação zero)

```bash
npx @mcptoolshop/sovereign
```

O CLI abre o jogo em seu navegador padrão. Sem instalador, sem servidor, sem necessidade de internet.

Outros modos:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Jogue online

Abra a página de destino hospedada em **<https://mcp-tool-shop-org.github.io/sovereign/>** e clique no jogo digital.

### Imprima e jogue

O jogo de tabuleiro imprimível é um documento HTML autocontido de 34 folhas. Abra `release/board-game/sovereign-board-game.html` do pacote (ou de um download), depois `Cmd/Ctrl-P → Salvar como PDF → US Letter → 100% escala`. Corte e jogue.

### Pacote de lançamento offline

Cada versão lançada inclui um pacote `sovereign-vX.Y.Z-release.zip` na sua página de lançamento do GitHub. Faça o download, descompacte e abra o arquivo `00-START-HERE.html` para acessar o ponto de entrada do jogo, que é adaptado ao público. Tudo funciona offline.

---

## Por que ele existe

A premissa de Sovereign é que o **crédito público + as finanças federais** foram os principais instrumentos econômicos de Alexander Hamilton, mas um jogo baseado no sistema de Hamilton deve permitir que o **comércio** e a **indústria** também sejam caminhos viáveis para a vitória. O período de ajuste (v0.2 → v0.10) foi um esforço de nove versões, baseado em evidências, para manter o Tesouro como o perfil mais forte (em linha com a história), sem reduzir o design a um jogo de estratégia única.

Consulte o arquivo [`CHANGELOG.md`](./CHANGELOG.md) para ver a evolução completa de cada versão.

---

## Determinismo

A mesma semente + as mesmas decisões humanas = um registro de dados idêntico em todas as execuções, navegadores e sistemas operacionais.

- Gerador de números aleatórios único: `mulberry32(state.rngSeed)`.
- Decisões do oponente: funções puras do estado visível, com cada decisão registrada no registro de dados juntamente com a regra que a desencadeou.
- O ciclo de salvamento/carregamento preserva um hash de estado.
- A reprodução reconstrói a partir de `initialState(seed) + decisionLog`.
- Testado em mais de 1.000 jogos determinísticos durante o período de ajuste v0.2 → v0.10.

---

## Modelo de ameaças e tratamento de dados

Sovereign é um jogo de tabuleiro autocontido, baseado em navegador. A interface de linha de comando abre um arquivo HTML local no seu navegador padrão. Não há servidor, nenhuma chamada de rede, nenhuma conta, nenhuma sincronização na nuvem.

- **Dados acessados:** os arquivos HTML incluídos em `release/` (somente leitura) e o `localStorage` sob a chave `sovereign.autosave` (apenas o estado do jogo salvo).
- **Dados NÃO acessados:** nenhum acesso ao sistema de arquivos fora do diretório do pacote, nenhuma solicitação de rede de qualquer tipo, nenhuma telemetria, nenhuma análise, nenhuma credencial.
- **Permissões necessárias:** capacidade de abrir o navegador padrão do sistema operacional, capacidade de ler os próprios arquivos do pacote, `localStorage` do navegador (opcional).
- **Nunca haverá telemetria.** O recurso de "telemetria" do simulador refere-se a relatórios locais de análise do jogo derivados do registro de dados no navegador; esses relatórios nunca saem da sua máquina.

Consulte o arquivo [`SECURITY.md`](./SECURITY.md) para obter informações sobre como relatar vulnerabilidades e a política de segurança completa.

---

## Recursos

- **Jogo de vitória em circuito solo** contra dois oponentes programados (Tesouro/Finanças e Comércio/Infraestrutura por padrão; Fabricante/Indústria disponível para jogos em lote). O jogo termina quando um jogador completa sua quarta passagem pelo "Treasury Opens". Média de ~22 rodadas / ~66 turnos. Maior influência no balanço final vence.
- **Presença do rival (camada v1.5)** — classificação de influência visível e linhas de postura por oponente que enquadram cada movimento do rival em relação à *sua* posição na corrida ("Hamilton — 3 pontos de influência à frente — toma o Banco; o bloco do Tesouro se fortalece."). Encerra a sensação de jogo paralelo/solitário; os oponentes são percebidos como oponentes. Apenas para apresentação — nunca gravado no livro-razão criptografado.
- **A Espiral do Crédito (camada v1.5)** — a falha do crédito público agora é sentida, se agrava e pode ser recuperada. Uma cobrança em dinheiro para o pagamento de dívidas em momentos de baixo crédito, uma aceleração que prenuncia o calote, uma previsão de para onde a tendência leva e a ação de Reforma como uma verdadeira tábua de salvação. Transmite diretamente a tese cívica: você sente *por que* o crédito público federal era importante. Envolve a hierarquia v0.18 (Dúvida Pública → Crise → Pânico → Calote) sem alterar seus limites; aplicada dentro de `reduce()` para que permaneça segura para repetição.
- **Efeitos visuais e sonoros (camada v1.5)** — interpolação de números com assimetria de ganho/perda, áudio procedural ZzFX em 13 momentos-chave, coreografia de ações e uma configuração de VELOCIDADE (Cinemática / Normal / Rápida — Rápida ignora todas as animações para um jogo rápido e acessível). Suporte total para teclado / movimento reduzido / leitor de tela em todo o jogo.
- **Profundidade estratégica (camada v1.2)** — três ações especiais com perfis bloqueados (Emitir Título Federal / Negociar Contrato de Rota / Criar Oficina), 6 cartas HAND com janelas de tempo (limite de cartas na mão: 2), ação de recuperação da Reforma.
- **Arco estratégico (camada v1.3)** — 8 eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8+ (5 opções + 3 automáticas), 3 Visões de Perfil (Arquiteto do Crédito Federal / Soberano do Comércio / Fundador Industrial) com +3 de bônus de IP no final do jogo. Todas as três Visões são alcançáveis (~41–43% dos jogos cada, CANÔNICO × 100).
- **O Cronista (camada v1.4)** — voz histórica em terceira pessoa. 14 banners vinculados a eventos (Atos × 7 / Abertura da Era Federal / Dúvida / Crise / Pânico / Calote / Rebelião / Reforma / Visão / Balanço Final). Todas as citações atribuídas são verificadas em relação a founders.archives.gov, Wikisource e fontes da Biblioteca do Congresso. Os Atos fracassados são narrados como contrafactuais da história real ("Em nossa história, o Ato de Financiamento de Hamilton foi aprovado por 32 a 29 em julho de 1790; em sua República, a discriminação contra os soldados encontrou votos suficientes para impedir o avanço."). Uma faixa persistente com borda decorativa e × para descartar; respeita a configuração de narração Ativada/Mínima/Desativada.
- **Camada B do Cronista — a camada informativa (v1.5)** — 15 pop-ups "Saiba Mais" sobre as principais mecânicas, a **Enciclopédia do Cronista** (27 citações históricas verificadas, além de Atos, eventos da Era Federal, níveis de Crédito e Visões em uma única sobreposição de referência) e 10 dicas de glossário. Transforma o sabor da época em uma camada de história real e navegável.
- **Integração (camada v1.5)** — um tutorial guiado "Debate sobre Financiamento de 1790" que apresenta um novo jogador ao ciclo principal, além de uma dica que mostra o custo e a consequência de cada ação antes que você se comprometa.
- **IA determinística** — cada decisão do oponente é uma função pura do estado visível com uma razão registrada. Sem LLM, sem magia opaca.
- **8 superfícies de jogo** — Tabuleiro, Painel do Tesouro, Inspetor de Ativos, Gaveta de Eventos, Atos do Congresso, Trilhas Compartilhadas, Registro de Turnos / Livro-Razão, Relatório Final.
- **Leilões** — os ativos rejeitados vão para um leilão com vários jogadores e lances programados com base no perfil.
- **Salvar / carregar** — salvamento automático em `localStorage` a cada turno, exportação / importação manual em JSON, verificação da integridade do hash ao carregar, com restrição de versão.
- **Repetição** — controle total sobre qualquer jogo concluído. Somente leitura. Reconstrói a partir da semente + registro de decisões com um indicador de integridade verde.
- **Simulação em lote** — execute 10 / 50 / 100 jogos determinísticos contra qualquer tripla de perfis, exporte relatórios em JSON + HTML para análise de equilíbrio.
- **Narração histórica** — biblioteca de 25 entradas derivada do livro-razão (40–60 palavras por padrão, 150–200 palavras em expansões, ~300–500 palavras no resumo final da república). Nunca altera o estado.
- **Acessibilidade** — navegação completa por teclado, indicadores de foco, rótulos significativos para leitores de tela, valores de rastreamento legíveis como texto, não apenas como marcadores, tamanho mínimo da fonte de 14px, respeito ao movimento reduzido.

---

## Alinhamento de perfis (linha de base de equilíbrio v0.10)

| Perfil | Prioridade de ativos | Ponto forte | Ponto fraco |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Dívida do Estado > Dívida de Receitas > Banco > Casa da Moeda | Aumento do Crédito Público | Sem renda da Infraestrutura |
| **Merchant / Infrastructure**  | Rotas (todas as 4) > Comércio > Melhorias > Receita | Escada de rotas | Sem pontuação da Capacidade Industrial |
| **Manufacturer / Industry**    | Fabricação > Indústria Estratégica > Melhorias > Banco | Multiplicadores de capacidade | Começo lento; recebe uma Carta inicial |

O quarto perfil do documento conceitual (Oportunista / Dinheiro) é adiado. O conjunto competitivo bloqueado da v0.10 é de três.

---

## Observações conhecidas

- **A versão 1.5.0 é uma versão beta que aguarda uma avaliação completa por um jogador humano.** Cada camada foi auditada estruturalmente e revalidada em relação ao motor em funcionamento por meio de `test/measure-stats.mjs` e dos mecanismos de determinismo e jogabilidade; toda a estrutura foi testada em nível de segmento, mas ainda não foi jogada completamente por um jogador humano. Essa avaliação é o critério de jogabilidade para a versão pública. Os números abaixo são os valores CANÔNICOS × 100 em relação ao motor em funcionamento; o desempenho real de um jogador humano será diferente. Considere como uma opção até que você (ou um jogador humano de confiança) a teste.
- **A pressão do fracasso é sentida e pode ser superada — não é mais apenas decorativa.** A Crise de Crédito agora ocorre em aproximadamente **29/100** jogos e pode ser genuinamente superada: dos jogos que entram em crise (Crédito ≤ 4), cerca de **41%** conseguem retornar a um nível de Crédito estável ≥ 7, e nenhum chega ao estado de Inadimplência. O pânico é raro (~1/100). A Inadimplência e a Rebelião permanecem raras sob a IA programada da versão 0.18, que se recupera antes de entrar em colapso, mas ambas podem ser alcançadas por um jogador humano que negligencia o Crédito Público. A Espiral de Crédito torna a inclinação em direção à Inadimplência visível e perceptível, em vez de uma queda repentina.
- **Os oponentes utilizam os sistemas das versões 1.2 a 1.4; apenas a matemática das ações principais é da versão 0.18.** Os oponentes programados *usam* Ações Especiais, a linha de vida da Reforma, as escolhas da Era Federal/Final do Jogo, as votações de Ações e o tempo das cartas HAND — a nota anterior de que "a IA não se adapta" era exagerada. O que permanece da versão 0.18 é a **avaliação principal de compra/leilão/melhoria/votação**: eles escolhem de forma ideal de acordo com seu perfil, mas ainda não "competem explicitamente pela Visão" como um otimizador humano faria. As medições CANÔNICAS × 100 refletem esse comportamento programado; o desempenho humano será diferente.
- **O gatilho não é sinônimo de vitória.** O jogador que completa o quarto circuito só vence por Influência em cerca de um terço dos jogos. Isso é intencional — a Contabilidade Final recompensa a profundidade econômica, não a velocidade no tabuleiro. A cópia do final do jogo torna a distinção explícita.
- **A fase da Era Federal tem uma pressão leve nas Ações.** As Ações Fundadoras ocorrem nos turnos 1 a 7; o tempo médio de jogo é de aproximadamente 22 turnos, portanto, a Era Federal se desenvolve com seus próprios Eventos (que ocorrem a cada turno a partir do turno 8), além da Espiral de Crédito e da corrida pela Visão. O sorteio de cada turno da Era Federal da versão 1.3 reduziu os períodos vazios de 4 turnos para cerca de 2/100. Se essa fase ainda parecer fraca em uma avaliação inicial, o próximo ajuste é uma redistribuição das Ações, e não um retorno ao modelo original.
- **O Tesouro/Finanças permanecem intencionalmente os mais fortes** (48% das vitórias), dentro da faixa-alvo. Isso corresponde à tese histórica: o crédito público + as finanças federais foram a principal alavanca econômica de Hamilton — sem reduzir o design a uma única estratégia (Comerciante 34%, Fabricante 18%).

---

## Construção e contribuição

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

As versões são publicadas no npm por meio do GitHub Actions (`release.yml`) quando uma tag `v*` é enviada, com a atestação de procedência do Sigstore. A fonte de verdade é o branch `main`.

---

## Licença

MIT © mcp-tool-shop. Consulte [`LICENSE`](./LICENSE).

---

<div align="center">

Criado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
