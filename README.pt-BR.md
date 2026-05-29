<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**O Jogo de Tabuleiro Hamilton System · adaptação para um jogador / digital**

*Fundação do Crédito · Financie a dívida. Construa o banco. Industrialize a República.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Beta pública** — jogo gratuito, acessível no seu navegador, sem necessidade de instalação. Está refinado, mas ainda em desenvolvimento; consulte [`CHANGELOG.md`](./CHANGELOG.md) para ver as novidades e os problemas conhecidos.

---

## O que é

Sovereign é um **jogo de tabuleiro Hamilton-system, com mecânicas de Monopoly**, sobre a fundação do crédito público dos EUA, além de uma **adaptação para um jogador / digital** que executa as mesmas regras localmente em um navegador, contra dois oponentes com comportamentos predefinidos.

- **Jogo de tabuleiro** — edição imprimível de 34 folhas. Tabuleiro com 40 espaços, 22 propriedades + 4 rotas + 2 instituições, 8 sistemas de cores, 7 Atos do Congresso em ordem histórica fixa, 4 papéis de jogador, 3 trilhas compartilhadas (Crédito Público · Resistência Pública · Capacidade Industrial), 12 + 12 cartas de evento. Dois caminhos econômicos viáveis além do Tesouro: Comerciante e Fabricante. Equilíbrio da versão 0.2, fixo.
- **Modo digital** — arquivo HTML único e independente. Condição de fim baseada em circuitos: o jogo termina quando um jogador completa sua quarta passagem pelo Tesouro. Duração média do jogo: **~22 rodadas (~66 turnos)**. No Balanço Final, o jogador com maior influência vence, *não necessariamente aquele que percorreu o tabuleiro primeiro*. Camada de presença do rival: classificação de influência visível + linhas de postura por oponente. Camada de profundidade estratégica: três Ações Especiais com perfis fixos, seis cartas HAND com janelas de tempo, ação de recuperação de Reforma, a Espiral de Crédito em várias etapas (Dúvida Pública → Crise → Pânico → Inadimplência) com um imposto de pagamento de dívidas, aceleração telegrafada, previsão e um salva-vidas de Reforma. Camada de arco estratégico: oito Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8, três Visões de Perfil com bônus de fim de jogo. Camada de narração do cronista: 14 banners históricos vinculados a eventos, além do informativo Nível B (pop-ups "Saiba Mais", a enciclopédia "Ledger do Cronista", dicas de ferramentas), citações reais dos "Federalist Papers" e "Founders Online", mensagem persistente com × para descartar. Recursos visuais e sonoros: animação de números, áudio procedural ZzFX (13 efeitos sonoros), configuração de VELOCIDADE Cinematográfica / Normal / Rápida. RNG determinístico mulberry32, oponentes de IA com comportamento predefinido, salvar / carregar com integridade de hash, reprodutor de repetição, ferramenta de simulação em lote controlada pelo designer.
- **Três caminhos reais para a vitória** — Tesouro, Comerciante e Fabricante, cada um com uma vitória significativa, sendo o Tesouro o mais forte, em linha com a história: o crédito público e as finanças federais foram a principal alavanca econômica de Hamilton. Cada perfil joga de forma diferente, com sua própria Ação Especial e uma Visão de Perfil para perseguir.

---

## Como começar

### Jogue no seu navegador (sem instalação)

```bash
npx @mcptoolshop/sovereign
```

O CLI abre o jogo no seu navegador padrão. Sem instalador, sem servidor, sem necessidade de internet.

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

O jogo de tabuleiro imprimível é um documento HTML independente de 34 folhas. Abra `release/board-game/sovereign-board-game.html` do pacote (ou de um download), depois `Cmd/Ctrl-P → Salvar como PDF → US Letter → 100% de escala`. Corte e jogue.

### Pacote de lançamento offline

Cada lançamento com tag anexa um pacote `sovereign-vX.Y.Z-release.zip` à sua página de lançamento no GitHub. Baixe-o, descompacte-o e abra `00-START-HERE.html` para o ponto de entrada direcionado ao público. Tudo funciona offline.

---

## Por que ele existe

A tese de Sovereign é que **o crédito público + as finanças federais** foram a principal alavanca econômica de Alexander Hamilton — mas um jogo do sistema Hamilton deve permitir que **o comércio** e a **indústria** também sejam caminhos viáveis para a vitória. O arco de equilíbrio (v0.2 → v0.10) foi um esforço de nove versões, baseado em evidências, para manter o Tesouro como o perfil mais forte (em linha com a história), sem transformar o design em um jogo de estratégia única.

Consulte [`CHANGELOG.md`](./CHANGELOG.md) para ver a evolução completa de versão por versão.

---

## Determinismo

Mesma semente + mesmas decisões humanas = registro de bytes idêntico entre as execuções, navegadores e sistemas operacionais.

- RNG único: `mulberry32(state.rngSeed)`.
- Decisões do oponente: funções puras do estado visível, com cada decisão registrada no registro com sua regra de acionamento.
- O ciclo de salvar / carregar preserva um hash de estado.
- A repetição é reconstruída a partir de `initialState(seed) + decisionLog`.
- Verificado em mais de 1.000 jogos determinísticos durante o arco de equilíbrio v0.2 → v0.10.

---

## Modelo de ameaças e tratamento de dados

Sovereign é um jogo de tabuleiro autônomo baseado em navegador. O CLI abre um arquivo HTML local no seu navegador padrão. Não há servidor, nenhuma chamada de rede, nenhuma conta, nenhuma sincronização na nuvem.

- **Dados afetados:** os arquivos HTML incluídos em `release/` (somente leitura) e `localStorage` sob a chave `sovereign.autosave` (apenas o estado de salvamento do jogo).
- **Dados NÃO afetados:** nenhum acesso ao sistema de arquivos fora do diretório do pacote, nenhuma solicitação de rede de qualquer tipo, nenhuma telemetria, nenhuma análise de dados, nenhuma credencial.
- **Permissões necessárias:** capacidade de iniciar o navegador padrão do sistema operacional, capacidade de ler os próprios arquivos do pacote, `localStorage` do navegador (opcional).
- **Sem telemetria, nunca.** O recurso de "telemetria" do simulador refere-se a relatórios locais de análise do jogo derivados do registro no navegador; esses dados nunca saem da sua máquina.

Consulte [`SECURITY.md`](./SECURITY.md) para obter informações sobre o relatório de vulnerabilidades e a política de segurança completa.

---

## Recursos

- **Jogo solo de vitória em circuito** contra dois oponentes programados (Tesouro/Finanças e Comércio/Infraestrutura por padrão; Indústria/Manufatura disponível para jogos em lote). O jogo termina quando um jogador completa sua quarta passagem pelo Tesouro. A média é de ~22 rodadas/~66 turnos. O jogador com maior influência no balanço final vence.
- **Presença do rival (camada v1.5)** — classificação de influência visível e linhas de postura por oponente que enquadram a jogada de cada rival em relação à *sua* posição na corrida ("Hamilton — 3 pontos de influência à frente — toma o Banco; o bloco do Tesouro se fortalece."). Encerra a sensação de jogo paralelo e solitário; os oponentes são percebidos como oponentes. Apenas apresentação — nunca é gravado no registro criptografado.
- **A Espiral do Crédito (camada v1.5)** — a falha do Crédito Público agora é sentida, se agrava e pode ser recuperada. Uma cobrança em dinheiro para o pagamento da dívida em momentos de baixo Crédito, uma aceleração telegrafada em direção ao calote, uma previsão de para onde a tendência leva e a ação de Reforma como uma verdadeira tábua de salvação. Isso transmite diretamente a tese cívica: você sente *por que* o crédito público federal era importante. Envolve a hierarquia de falhas existente (Dúvida Pública → Crise → Pânico → Calote), e o salvamento/reprodução permanecem totalmente determinísticos.
- **Efeitos visuais e sonoros (camada v1.5)** — animação numérica com assimetria de ganho/perda, áudio procedural ZzFX em 13 momentos, coreografia de ação e uma configuração de VELOCIDADE (Cinemática/Normal/Rápida — Rápida ignora todas as animações para um jogo rápido e acessível). Suporte total para teclado/movimento reduzido/leitor de tela em todo o jogo.
- **Profundidade estratégica (camada v1.2)** — três Ações Especiais com perfis fixos (Emitir Título Federal/Negociar Contrato de Rota/Criar Oficina), 6 cartas HAND com janelas de tempo (limite de cartas na mão: 2), ação de recuperação de Reforma.
- **Arco estratégico (camada v1.3)** — 8 Eventos da Era Federal que ocorrem a cada rodada a partir da rodada 8+ (5 opções + 3 automáticos), 3 Visões de Perfil (Arquiteto do Crédito Federal/Soberano do Comércio/Fundador Industrial) com um bônus no final do jogo. Todas as três Visões são alcançáveis.
- **O Cronista (camada v1.4)** — voz histórica em terceira pessoa. 14 banners vinculados a eventos (Atos × 7/Abertura da Era Federal/Dúvida/Crise/Pânico/Calote/Rebelião/Reforma/Visão/Balanço Final). Todas as citações atribuídas foram verificadas em relação a founders.archives.gov, Wikisource e fontes da Biblioteca do Congresso. Os Atos fracassados são narrados como contrafactuais da história real ("Em nossa história, o Ato de Financiamento de Hamilton foi aprovado por 32 a 29 em julho de 1790; em sua República, a discriminação contra os soldados encontrou votos suficientes para impedir a aprovação."). Mensagem persistente com borda decorativa e × para descartar; respeita a configuração de narração Ativada/Mínima/Desativada.
- **Camada B do Cronista — a camada informativa (v1.5)** — 15 pop-ups *Saiba Mais* sobre os principais mecanismos, a enciclopédia **Registro do Cronista** (27 citações históricas verificadas, além de Atos, eventos da Era Federal, níveis de Crédito e Visões em uma única sobreposição de referência) e 10 dicas de glossário. Transforma o sabor da época em uma camada de história real e navegável.
- **Integração (camada v1.5)** — um tutorial guiado "Debate sobre o Financiamento de 1790" que apresenta um novo jogador ao ciclo principal, além de uma dica que mostra o custo e a consequência de cada ação antes que você se comprometa.
- **IA determinística** — cada decisão do oponente é uma função pura do estado visível com uma razão registrada. Sem LLM, sem magia opaca.
- **8 superfícies de jogo** — Painel, Painel do Tesouro, Inspetor de Ativos, Gaveta de Eventos, Atos do Congresso, Trilhas Compartilhadas, Registro de Turnos/Registro, Relatório Final.
- **Leilões** — os ativos rejeitados vão para um leilão com vários jogadores e lances programados com base no perfil.
- **Salvar/carregar** — salvamento automático no `localStorage` a cada turno, exportação/importação manual em JSON, verificação da integridade do hash ao carregar, com restrição de versão.
- **Reprodução** — controle total sobre qualquer jogo concluído. Somente leitura. Reconstroi a partir da semente + registro de decisões com um indicador de integridade verde.
- **Simulação em lote** — execute 10/50/100 jogos determinísticos contra qualquer tripla de perfis, exporte relatórios em JSON + HTML para análise de equilíbrio.
- **Narração histórica** — biblioteca de 25 entradas derivada do registro (padrão de 40 a 60 palavras, expansões de 150 a 200 palavras, ~300 a 500 palavras de resumo do final do jogo). Nunca altera o estado.
- **Acessibilidade** — navegação completa por teclado, indicadores de foco, rótulos significativos para leitores de tela, valores de rastreamento legíveis como texto, não apenas como marcadores, tamanho mínimo do corpo do texto de 14px, respeito pela configuração de movimento reduzido.

---

## Lista de perfis (linha de base de equilíbrio v0.10)

| Perfil | Prioridade de ativos | Ponto forte | Ponto fraco |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Dívida do Estado > Dívida de Receitas > Banco > Casa da Moeda | Aumento do Crédito Público | Sem renda de infraestrutura |
| **Merchant / Infrastructure**  | Rotas (todas as 4) > Comércio > Melhorias > Receita | Escada de rotas | Sem pontuação de capacidade industrial |
| **Manufacturer / Industry**    | Manufatura > Indústria Estratégica > Melhorias > Banco | Multiplicadores de capacidade | Começo lento; recebe uma Carta inicial |

O quarto perfil do documento conceitual (Oportunista/Dinheiro) foi adiado. O conjunto competitivo fixo da v0.10 é de três.

---

## Notas da versão beta

- **É uma versão beta pública** — aprimorada e divertida, mas ainda em desenvolvimento; poderá encontrar alguns pequenos problemas. Relatos de erros e comentários são bem-vindos no [rastreador de problemas](https://github.com/mcp-tool-shop-org/sovereign/issues).
- **Completar o tabuleiro primeiro não significa que você vence.** O jogo termina quando um jogador faz sua quarta volta no tabuleiro, mas o vencedor é aquele que tiver mais Influência na Contagem Final — a profundidade econômica supera a velocidade. A tela final do jogo deixa isso claro.
- **O Tesouro é o caminho mais forte, por design.** O crédito público e as finanças federais foram o principal trunfo de Hamilton, então o Tesouro vence com mais frequência — mas o Comerciante e o Fabricante são ambos caminhos genuinamente viáveis e oferecem estilos de jogo muito diferentes.

---

## Desenvolvimento e contribuições

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

As versões são publicadas no npm por meio do GitHub Actions (`release.yml`) quando um tag `v*` é enviado, com atestado de proveniência do Sigstore. A fonte de verdade é o branch `main`.

---

## Licença

MIT © mcp-tool-shop. Consulte [`LICENSE`](./LICENSE).

---

<div align="center">

Desenvolvido por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
