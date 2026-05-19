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

</div>

---

## O que é

Sovereign é um **jogo de tabuleiro do tipo Monopoly, inspirado no sistema Hamilton**, sobre a fundação do crédito público dos EUA, além de uma **adaptação completa para jogar sozinho / digitalmente** que executa as mesmas regras localmente em um navegador contra dois oponentes programados e determinísticos.

- **Jogo de tabuleiro** — protótipo imprimível em 34 páginas. Tabuleiro com 40 espaços, 22 propriedades + 4 rotas + 2 instituições, 8 sistemas de cores, 7 Atos do Congresso em ordem histórica fixa, 4 papéis de jogador, 3 trilhas compartilhadas (Crédito Público · Resistência Pública · Capacidade Industrial), 12+12 cartas de evento. Dois caminhos econômicos viáveis além do Tesouro: Comércio e Indústria.
- **Modo digital** — um único arquivo HTML autônomo. Máquina de estados completa, RNG determinístico mulberry32, oponentes de IA programados (Tesouro / Finanças, Comércio / Infraestrutura, Indústria / Indústria), salvar / carregar com integridade de hash, ferramenta de reprodução, ferramenta de simulação em lote, telemetria local de equilíbrio.
- **Equilíbrio base** — v0.10, congelado após um arco de nove versões impulsionado por mais de 1.000 jogos de simulação determinísticos. Tesouro 59% · Comércio 25% · Indústria 16% (CANÔNICO × 100, a faixa alvo foi atingida para todos os três perfis).

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

- **Jogo solo de 7 voltas** contra dois oponentes programados (Treasury / Finance e Merchant / Infrastructure por padrão; Manufacturer / Industry disponível para jogos em lote).
- **Inteligência artificial determinística** — cada decisão do oponente é uma função pura do estado visível, com uma justificativa registrada no livro-razão. Sem LLM (Large Language Model), sem "magia" obscura.
- **8 superfícies de jogo** — Quadro, Painel do Tesouro, Inspetor de Ativos, Painel de Eventos, Atos do Congresso, Trilhas Compartilhadas, Registro de Turnos / Livro-Razão, Relatório de Fim de Jogo.
- **Leilões** — ativos rejeitados vão para leilão multiplayer com lances programados baseados no perfil.
- **Salvar / carregar** — salvamento automático no `localStorage` a cada turno, exportação/importação manual em formato JSON, verificação de integridade por hash ao carregar, versão controlada.
- **Revisão** — reprodução completa de qualquer jogo concluído. Somente leitura. Reconstroi a partir da semente (seed) + registro de decisões, com uma verificação de integridade.
- **Simulação em lote** — execute 10/50/100 jogos determinísticos contra qualquer combinação de perfis, exporte relatórios em formato JSON + HTML para análise de equilíbrio.
- **Narração histórica** — biblioteca de 25 entradas derivada do livro-razão (descrições padrão de 40 a 60 palavras, expansões de 150 a 200 palavras, resumo da república no final do jogo com aproximadamente 300 a 500 palavras). Nunca altera o estado do jogo.
- **Acessibilidade** — navegação completa por teclado, indicadores de foco, rótulos significativos para leitores de tela, valores das trilhas legíveis como texto e não apenas como marcadores, tamanho mínimo de fonte de 14px, respeito às configurações de redução de animações.

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

- **Os limites de capacidade permanecem raros no jogo padrão.** A capacidade final média é de 3,49; ≥ 6 é alcançada em apenas 4/100 jogos. A pontuação industrial no final do jogo existe como um limite máximo, não como um caminho comum.
- **O perfil Treasury / Finance permanece intencionalmente o mais forte**, dentro da faixa alvo. Isso corresponde à tese histórica: o crédito público + as finanças federais eram o principal instrumento econômico de Hamilton.
- **Eventos de falha ocorreram 0 / 400 vezes** na versão de teste da v0.10. As ameaças de falha (default, rebelião, falência) são atualmente decorativas; uma versão futura pode reavaliar a pressão para atingir um estado de falha.
- **Testado apenas em simulação.** O equilíbrio é validado contra mais de 1.000 jogos determinísticos no intervalo v0.3 → v0.10. Ainda não foi testado com jogadores humanos; desvios estratégicos podem alterar essas taxas.

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

</div>
