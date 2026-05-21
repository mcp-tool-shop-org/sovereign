<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**O Jogo de Tabuleiro Hamilton · Adaptação solo / digital**

*Fundamento do Crédito Público · Financiamento da dívida. Construção do banco. Industrialização da república.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div

---

**Status — v1.4.0 (beta).** Primeira versão com recursos significativos desde a v1.1.2 (circuit-victory). Adiciona três camadas sobre a base do circuito: **profundidade estratégica** (Ações Especiais vinculadas ao perfil, cartas HAND com janelas de tempo, recuperação de Reforma, pressão pública em várias etapas), **arco estratégico** (Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8, três Visões de Perfil com bônus no final do jogo) e **o Cronista** (uma voz histórica em terceira pessoa que apresenta 14 banners relacionados a eventos ao longo do jogo, baseados em citações históricas verificadas — 27 citações reais de Hamilton / Madison / Jefferson / Adams / Gallatin / Maclay / Freneau, com links rastreáveis para founders.archives.gov, Wikisource e Library of Congress; sem atribuições fabricadas). A duração média do jogo permanece em torno de 23 rodadas / 67 turnos; a contagem final acionada pelo circuito permanece inalterada. Três caminhos de perfil viáveis: Tesouraria 59 % / Comerciante 20 % / Fabricante 21 % (CANÔNICO × 100). O jogo de tabuleiro imprimível permanece estável na versão v0.2. Consulte o arquivo `CHANGELOG.md` para obter todos os detalhes das alterações e as ressalvas da versão beta.

---

## O que é

Sovereign é um **jogo de tabuleiro do tipo Monopoly, inspirado no sistema Hamilton**, sobre a fundação do crédito público dos EUA, além de uma **adaptação completa para jogar sozinho / digitalmente** que executa as mesmas regras localmente em um navegador contra dois oponentes programados e determinísticos.

- **Jogo de tabuleiro** — edição imprimível de 34 páginas. Tabuleiro com 40 espaços, 22 propriedades + 4 rotas + 2 instituições, 8 sistemas de cores, 7 Atos do Congresso em ordem histórica fixa, 4 papéis de jogador, 3 trilhas compartilhadas (Crédito Público · Resistência Pública · Capacidade Industrial), 12+12 cartas de evento. Dois caminhos econômicos viáveis além da Tesouraria: Comerciante e Fabricante. Equilíbrio na versão v0.2, congelado.
- **Modo digital** — um único arquivo HTML autônomo. Condição de término baseada no circuito: o jogo termina quando um jogador completa sua quarta passagem pela abertura da Tesouraria. A duração média do jogo é de aproximadamente 23 rodadas (67 turnos). Na contagem final, o jogador com a maior influência vence, *não necessariamente aquele que completou o tabuleiro primeiro*. Camada de profundidade estratégica: três Ações Especiais vinculadas ao perfil, seis cartas HAND com janelas de tempo, ação de recuperação de Reforma, pressão de crédito em várias etapas (Dúvida Pública / Crise / Pânico / Inadimplência). Camada de arco estratégico: oito Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8, três Visões de Perfil com bônus no final do jogo. Camada de narração do Cronista: 14 banners históricos relacionados a eventos, citações reais dos Federalist Papers e Founders Online, notificação persistente com botão de "fechar". Gerador de números aleatórios mulberry32 determinístico, oponentes de IA programados, salvar / carregar com integridade de hash, ferramenta de limpeza de repetições, ferramenta de simulação em lote com acesso restrito ao designer.
- **Base de equilíbrio** — circuito + profundidade estratégica + arco estratégico + Cronista (v1.4.0 beta): Tesouraria 59 % · Comerciante 20 % · Fabricante 21 % (CANÔNICO × 100). Todos os três perfis têm chances significativas de vitória. Taxas de conquista de Visão: Arquiteto do Crédito Federal 54 %, Soberano do Comércio 39 %, Fundador Industrial 29 %. As mecânicas subjacentes da versão v0.18 (Crise de Crédito, pontuação de propriedade intelectual em dinheiro, Carta Industrial, bônus de conclusão de conjunto) são preservadas byte a byte a partir do ciclo de design v0.3 → v0.10 → v0.18, impulsionado por mais de 1.000 jogos de simulação determinísticos.

---

## Como começar

### Jogue no seu navegador (sem instalação)

```bash
npx @mcptoolshop/sovereign
```

O CLI abre o jogo no seu navegador padrão. Não requer instalador, servidor ou internet.

Outros modos:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Jogar online

Abra a página de destino hospedada em **<https://mcp-tool-shop-org.github.io/sovereign/>** e clique no jogo digital.

### Imprimir e jogar

O protótipo do jogo de tabuleiro é um documento HTML autônomo de 34 páginas. Abra `release/board-game/sovereign-prototype.html` do pacote (ou de um download), depois `Cmd/Ctrl-P → Salvar como PDF → US Letter → 100% de escala`. Recorte e jogue.

### Pacote de lançamento offline

Cada lançamento marcado anexa um pacote `sovereign-vX.Y.Z-release.zip` à sua página de lançamento do GitHub. Baixe-o, descompacte e abra `00-START-HERE.html` para o ponto de entrada direcionado ao público. Tudo funciona offline.

---

## Por que ele existe

A tese de Sovereign é que o **crédito público + finanças federais** foram a principal alavancagem econômica de Alexander Hamilton — mas um jogo do sistema Hamilton deve permitir que o **comércio** e a **indústria** também sejam caminhos viáveis para a vitória. O arco de equilíbrio (v0.2 → v0.10) foi um esforço de nove versões, baseado em evidências, para manter o Tesouro como o perfil mais forte (de acordo com a história) sem transformar o design em um jogo de uma única estratégia.

Veja [`CHANGELOG.md`](./CHANGELOG.md) para a evolução completa, versão por versão.

---

## Determinismo

A mesma semente + as mesmas decisões humanas = registro idêntico em bytes em várias execuções, navegadores e sistemas operacionais.

- RNG único: `mulberry32(state.rngSeed)`.
- Decisões do oponente: funções puras do estado visível, com cada decisão registrada no registro junto com sua regra de disparo.
- Salvar / carregar preserva um hash de estado.
- A reprodução reconstrói a partir de `initialState(seed) + decisionLog`.
- Verificado em mais de 1.000 jogos determinísticos durante o arco de equilíbrio v0.2 → v0.10.

---

## Modelo de ameaças e tratamento de dados

Sovereign é um jogo de tabuleiro baseado em navegador, autônomo. A interface de linha de comando (CLI) abre um arquivo HTML local no seu navegador padrão. Não há servidor, nenhuma chamada de rede, nenhuma conta, nenhuma sincronização na nuvem.

- **Dados acessados:** os arquivos HTML incluídos no diretório `release/` (somente leitura) e o armazenamento local (`localStorage`) sob a chave `sovereign.autosave` (apenas para salvar o estado do jogo).
- **Dados NÃO acessados:** nenhum acesso ao sistema de arquivos fora do diretório do pacote, nenhuma solicitação de rede de qualquer tipo, nenhuma telemetria, nenhuma análise, nenhuma credencial.
- **Permissões necessárias:** capacidade de abrir o navegador padrão do sistema operacional, capacidade de ler os arquivos do próprio pacote, armazenamento local (`localStorage`) do navegador (opcional).
- **Nenhuma telemetria, nunca.** O recurso de "telemetria" do simulador se refere a relatórios de análise do jogo gerados localmente a partir do livro-razão (ledger) exibido no navegador; esses relatórios nunca saem do seu computador.

Consulte o arquivo [`SECURITY.md`](./SECURITY.md) para relatar vulnerabilidades e consultar a política de segurança completa.

---

## Recursos

- **Jogo de vitória individual** contra dois oponentes controlados pelo computador (Tesouro/Finanças e Comércio/Infraestrutura por padrão; Fabricante/Indústria disponível para jogos em lote). O jogo termina quando um jogador completa sua quarta rodada de "Abertura do Tesouro". Média de ~23 rodadas / 67 turnos. O jogador com a maior influência no balanço final vence.
- **Profundidade estratégica (camada v1.2)** — três Ações Especiais com perfis fixos (Emissão de Título Federal / Contrato de Rota de Corretagem / Criação de Oficina), 6 cartas na mão com janelas de tempo (limite de 2 cartas na mão), ação de recuperação de Reforma, pressão de crédito em várias etapas (Dúvida Pública / Crise / Pânico / Inadimplência).
- **Arco estratégico (camada v1.3)** — 8 Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8 (5 opções + 3 automáticos), 3 Visões de Perfil (Arquiteto do Crédito Federal / Soberano do Comércio / Fundador Industrial) com bônus de +3 Pontos de Influência no final do jogo.
- **O Cronista (camada v1.4)** — narração histórica em terceira pessoa com nomes próprios. 14 banners relacionados a eventos (Atos × 7 / Abertura da Era Federal / Dúvida / Crise / Pânico / Inadimplência / Rebelião / Reforma / Visão / Balanço Final). Todas as citações são verificadas em relação às fontes founders.archives.gov, Wikisource e Library of Congress. Atos falhos são narrados como cenários hipotéticos da história real ("Na nossa história, o Ato de Financiamento de Hamilton foi aprovado por 32 votos contra 29 em julho de 1790; na sua República, a discriminação contra os soldados encontrou votos suficientes para impedir a entrada."). Uma barra persistente com borda de alumínio permite descartar a narração; respeita as configurações de narração (Ligado/Mínimo/Desligado).
- **Inteligência Artificial Determinística** — cada decisão do oponente é uma função pura do estado visível, com uma justificativa registrada. Sem LLM, sem "magia" opaca.
- **8 superfícies de jogo** — Tabuleiro, Painel do Tesouro, Inspetor de Ativos, Gaveta de Eventos, Atos do Congresso, Trilhas Compartilhadas, Registro de Turnos / Livro Razão, Relatório de Fim de Jogo.
- **Leilões** — ativos rejeitados vão para leilão multiplayer com lances programados com base no perfil.
- **Salvar / Carregar** — salvamento automático no `localStorage` a cada turno, exportação/importação manual em formato JSON, verificação de integridade por hash ao carregar, versão restrita.
- **Revisão** — reprodução completa de qualquer jogo finalizado. Somente leitura. Reconstroi a partir da semente + registro de decisões, com um indicador de integridade verde.
- **Simulação em lote** — execute 10 / 50 / 100 jogos determinísticos contra qualquer combinação de perfis, exporte relatórios em JSON + HTML para análise de equilíbrio.
- **Narração histórica** — biblioteca com 25 entradas derivadas do livro razão (descrições padrão de 40–60 palavras, expansões de 150–200 palavras, resumo da república no final do jogo de ~300–500 palavras). Nunca altera o estado do jogo.
- **Acessibilidade** — navegação completa por teclado, indicadores de foco, rótulos significativos para leitores de tela, valores das trilhas legíveis como texto e não apenas como marcadores, tamanho mínimo de fonte de 14px, respeito às configurações de redução de movimento.

---

## Conjunto de perfis (v0.10)

| Perfil | Prioridade de ativos | Força | Fraqueza |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Dívida Estatal > Dívida Revolutiva > Banco > Moeda | Aumento do crédito público | Sem renda de infraestrutura |
| **Merchant / Infrastructure**  | Rotas (todas as 4) > Comércio > Melhorias > Receita | Escada de rotas | Sem pontuação de capacidade industrial |
| **Manufacturer / Industry**    | Manufatura > Indústria Estratégica > Melhorias > Banco | Multiplicadores de capacidade | Começo lento; recebe uma Carta inicial |

O quarto perfil conceitual (Oportunista / Caixa) está adiado. O conjunto competitivo bloqueado na v0.10 é de três.

---

## Observações

- **A versão v1.4.0 é uma versão beta.** Cada componente principal (profundidade estratégica, arco estratégico, Chronicler) foi estruturalmente analisado e validado com base em diagnósticos de simulação; a totalidade das quatro camadas foi testada em nível de componente, mas não de ponta a ponta, por um jogador humano. Os resultados obtidos com a configuração padrão (CANONICAL × 100) mostram: 100% de ativação do circuito final, média de 23 rodadas, divisão de vitórias de 59/20/21, aproximadamente 6 a 8 banners do Chronicler por partida, e aproximadamente 33 reações por partida. Utilize este programa como um programa opcional até que você o teste pessoalmente.
- **Os perfis de inteligência artificial ainda não se adaptam às mecânicas das versões v1.2 a v1.4.** Eles utilizam as funções de decisão da versão v0.18 – eles não "correm para alcançar a Visão" nem "usam os cartões HAND de forma estratégica" como um jogador humano faria. A jogabilidade humana real se diferenciará das medições obtidas com a configuração padrão.
- **Ativação ≠ vitória.** O jogador que completa o quarto circuito só vence por influência em aproximadamente um terço das partidas. Isso é intencional – o "Final Accounting" recompensa a profundidade econômica, não a velocidade no tabuleiro. A cópia do final do jogo deixa essa distinção explícita.
- **A fase da República Tardia é longa e não apresenta eventos.** Os eventos ainda ocorrem nas rodadas de 1 a 7. A jogabilidade média é de aproximadamente 23 rodadas, deixando aproximadamente 16 rodadas da República Tardia sem novos eventos políticos. Se isso parecer vazio durante o teste, a próxima correção será uma redistribuição de eventos, e não um retorno ao sistema de mandatos.
- **O Tesouro/Finanças continua sendo intencionalmente o mais forte**, dentro da faixa de valores desejada. Isso reflete a tese histórica: o crédito público e as finanças federais foram os principais instrumentos econômicos de Hamilton.
- **Os eventos de falha (Inadimplência/Rebelião) permanecem principalmente decorativos.** A Crise de Crédito ocorre ocasionalmente; a Inadimplência e a Rebelião quase nunca ocorrem. O sistema de escalada tem mais tempo para se desenvolver, mas ainda raramente atinge os níveis mais altos. Versões futuras podem reavaliar a pressão dos estados de falha.

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

As versões são publicadas no npm através do GitHub Actions (`release.yml`) sempre que há um envio (push) na tag `v*`, com a garantia de autenticidade do Sigstore. A fonte de verdade é o ramo `main`.

---

## Licença

MIT © mcp-tool-shop. Consulte o arquivo [`LICENSE`](./LICENSE).

---

<div align="center">

Desenvolvido por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div
