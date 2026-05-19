<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**“汉密尔顿系统”棋盘游戏 · 单人/数字版本**

*创始基金 · 偿还债务。 建立银行。 推动工业化，建设共和国。*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

## 简介

Sovereign是一款**基于“汉密尔顿系统”的“大富翁”风格棋盘游戏**，讲述的是美国公共信贷的建立，同时还提供一个**完整的单人/数字版本**，它可以在浏览器中本地运行，与两个具有固定行为的AI对手对战。

- **棋盘游戏** — 包含34页的可打印版本。 棋盘包含40个格子，22个房产 + 4条路线 + 2个机构，8种颜色系统，7个国会法案按照固定的历史顺序排列，4种玩家角色，3条共享进度条（公共信贷、公共抵抗、工业能力），12+12张事件卡。 除了财政部，还有两种可行的经济发展路径：商人路径和制造商路径。
- **数字模式** — 单个独立的HTML文件。 完整的状态机，使用确定性 mulberry32 随机数生成器，具有脚本化的AI对手（财政部/金融、商人/基础设施、制造商/工业），支持保存/加载，并具有哈希完整性校验，支持回放，包含批处理模拟工具，以及本地平衡数据统计。
- **平衡基准** — v0.10版本，在经过九个版本的迭代后，基于1000多次确定性模拟游戏进行调整。 财政部占比59%，商人占比25%，制造商占比16%（符合规范，所有三种模式都达到目标范围）。

---

## 快速开始

### 在浏览器中直接玩（无需安装）

```bash
npx @mcptoolshop/sovereign
```

CLI命令可以打开游戏，使用您的默认浏览器。 无需安装，无需服务器，无需连接互联网。

其他模式：

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### 在线游戏

打开位于 **<https://mcp-tool-shop-org.github.io/sovereign/>** 的主页，然后点击进入数字游戏。

### 打印并玩

可打印的棋盘游戏是一个独立的34页HTML文档。 打开 `release/board-game/sovereign-board-game.html` 文件（或从下载的文件中），然后使用 `Cmd/Ctrl-P → 保存为PDF → US Letter → 100% 比例`。 剪切并开始游戏。

### 离线发布包

每个版本都会在GitHub发布页面上附加一个 `sovereign-vX.Y.Z-release.zip` 的发布包。 下载它，解压缩，然后打开 `00-START-HERE.html` 文件，该文件会引导您进入游戏。 整个游戏可以在离线状态下运行。

---

## 设计理念

Sovereign 的核心思想是，**公共信贷和联邦财政**是亚历山大·汉密尔顿最重要的经济杠杆——但一款“汉密尔顿系统”游戏必须允许**商业**和**工业**也成为通往胜利的可行途径。 从 v0.2 到 v0.10 的平衡迭代是一个持续九个版本的、以证据为导向的过程，旨在保持财政部作为最强大的模式（符合历史），同时避免游戏设计陷入单一策略。

请查看 [`CHANGELOG.md`](./CHANGELOG.md) 文件，了解每个版本的详细变化。

---

## 确定性

相同的种子 + 相同的玩家决策 = 跨运行、浏览器和操作系统，账本完全一致。

- 单个随机数生成器：`mulberry32(state.rngSeed)`。
- AI 决策：是基于可见状态的纯函数，并且每个决策都会记录到账本中，并附带触发规则。
- 保存/加载功能会保留状态哈希。
- 回放功能可以从 `initialState(seed) + decisionLog` 重建游戏。
- 在 v0.2 到 v0.10 的平衡迭代过程中，经过了 1000 多次确定性游戏的验证。

---

## 威胁模型与数据处理

Sovereign 是一款独立的、基于浏览器的棋盘游戏。命令行界面会在您的默认浏览器中打开一个本地 HTML 文件。它没有服务器，没有网络调用，没有账户，也没有云同步。

- **涉及的数据：** `release/` 目录中的 HTML 文件（只读），以及 `sovereign.autosave` 键下的 `localStorage`（仅用于游戏存档状态）。
- **未涉及的数据：** 不会访问包目录之外的文件系统，不会进行任何类型的网络请求，不会收集任何遥测数据，不会进行任何分析，不会存储任何凭据。
- **所需权限：** 能够启动操作系统默认浏览器，能够读取包自身的配置文件，以及可选的浏览器 `localStorage` 访问权限。
- **绝不收集任何遥测数据。** 模拟器的“遥测”功能指的是从浏览器中的账本中提取的本地游戏分析报告，这些报告永远不会离开您的设备。

请参阅 [`SECURITY.md`](./SECURITY.md) 以获取漏洞报告和完整的安全策略。

---

## 功能

- **单人 7 轮游戏：** 对抗两个预设的对手（默认情况下为财政/金融和商人/基础设施；制造商/工业可用于批量游戏）。
- **确定性人工智能：** 每一个对手的决策都是对可见状态的纯函数运算，并带有账本记录的理由。没有 LLM，没有不透明的魔法。
- **8 个游戏界面：** 棋盘、财政面板、资产检查器、事件抽屉、国会法案、共享轨道、回合日志/账本、游戏结束报告。
- **拍卖：** 放弃的资产将进入多玩家拍卖，采用基于配置文件的预设竞标策略。
- **保存/加载：** 每回合自动保存到 `localStorage`，支持手动导出/导入 JSON 文件，加载时进行哈希完整性检查，并根据版本进行限制。
- **回放：** 可以对任何已完成的游戏进行完整的回放。只读。通过种子值和决策日志进行重建，并带有绿色的完整性验证。
- **批量模拟：** 运行 10/50/100 局确定性游戏，针对任何配置组合，并导出 JSON 和 HTML 报告以进行平衡分析。
- **历史叙述：** 从账本中提取的 25 条条目（默认情况下为 40-60 个单词，扩展为 150-200 个单词，游戏结束时为约 300-500 个单词的共和国总结）。不会改变游戏状态。
- **可访问性：** 完整的键盘导航，焦点指示器，屏幕阅读器友好的标签，可以以文本形式读取的数值（而不是仅作为标记），最小字体为 14px，尊重减少动画设置。

---

## 配置组合 (v0.10)

| 配置 | 资产优先级 | 优势 | 劣势 |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > 州债务 > 财政债务 > 银行 > 铸币厂 | 公共信用增长 | 无基础设施收入 |
| **Merchant / Infrastructure**  | 路线 (全部 4 条) > 商业 > 改进 > 收入 | 路线等级 | 无工业产能评分 |
| **Manufacturer / Industry**    | 制造业 > 战略工业 > 改进 > 银行 | 产能倍数 | 开局较慢；获得初始特许权 |

第四个概念文档配置（机会主义者/现金）已推迟。当前 v0.10 版本中可用的竞争配置为三个。

---

## 已知问题

- **产能阈值在标准游戏中仍然很少出现。** 最终平均产能为 3.49；只有在 4/100 局游戏中达到 ≥ 6。游戏结束时的工业评分仅作为上限，而不是常规的路径。
- **财政/金融配置仍然有意地是最强的，** 处于目标范围内。这符合历史论证：公共信用和联邦财政是汉密尔顿的主要经济杠杆。
- **在 v0.10 版本的测试中，失败事件触发了 0/400 次。** 默认/叛乱/破产威胁目前仅为装饰；未来的版本可能会重新考虑失败状态的压力。
- **仅进行模拟测试。** 平衡是通过对 v0.3 → v0.10 版本中的 1000+ 局确定性游戏进行的验证。尚未进行人类游戏测试；战略偏差可能会改变这些数值。

---

## 构建与贡献

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

通过 GitHub Actions（`release.yml`）在 `v*` 标签推送时，会将版本发布到 npm，并附带 Sigstore 的来源证明。`main` 分支是最终版本来源。

---

## 许可证

MIT © mcp-tool-shop。请参阅 [`LICENSE`](./LICENSE)。

---

<div align="center">

由 <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a> 构建。

</div>
