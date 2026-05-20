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

</div

---

**状态 — v1.1.2 (beta)。** v1.1.0 版本在发布当天就被撤回（2026年5月20日）。v1.1.1 版本对数字模式进行了改进，修复了游戏体验问题，增加了12轮的游戏流程，并设置了强制胜利的条件，但仍然感觉太短。v1.1.2 版本将回合限制的结束条件替换为基于“电路”的结束条件：当一名玩家使自己的派系在共和国境内完成了四次循环时，游戏结束。平均游戏时长约为23轮/67回合（比 v1.1.1 版本长 1.9 倍）。触发游戏结束的玩家不一定获胜，最终根据“最终结算”时的影响力值来决定胜负。可打印的桌面游戏版本仍然稳定在 v0.2 版本。请参阅 `CHANGELOG.md` 文件以获取完整的变更记录和 beta 版本的注意事项。

---

## 简介

Sovereign是一款**基于“汉密尔顿系统”的“大富翁”风格棋盘游戏**，讲述的是美国公共信贷的建立，同时还提供一个**完整的单人/数字版本**，它可以在浏览器中本地运行，与两个具有固定行为的AI对手对战。

- **桌面游戏** — 可打印的 34 页版本。游戏棋盘包含 40 个格子，22 处地产 + 4 条路线 + 2 个机构，8 个颜色系统，7 项国会法案按照固定的历史顺序排列，4 个玩家角色，3 条共享进度条（公共信用、公共抵抗、工业能力），12+12 张事件卡。除了财政部之外，还有两种可行的经济发展路径：商人路径和制造商路径。v0.2 版本的平衡性已确定，不再进行调整。
- **数字模式** — 单个独立的 HTML 文件。基于“电路”的结束条件：当一名玩家完成第四次“财政部开放”时，游戏结束。平均游戏时长约为 23 轮（67 回合）。在“最终结算”时，拥有最高影响力的玩家获胜，*不一定是最先绕完棋盘的玩家*。为了安全起见，回合上限仍然设置为 30 回合（在标准模式下几乎不会达到）。使用确定性的 mulberry32 随机数生成器，包含脚本化的 AI 对手（财政部/金融、商人/基础设施、制造商/工业），支持保存/加载功能，并具有哈希完整性校验、回放清除功能以及设计师提供的批量模拟工具。
- **平衡性基准** — 基于“电路”模型的 v1.1.2 beta 版本：财政部 56%，商人 19%，制造商 25%（标准模式下）。这三种发展模式都有可能获胜；在较长的游戏中，制造商的发展会更加突出，因为工业组合有时间成熟；随着路线的重要性下降，以及玩家将资金用于升级，商人的份额可能会下降。底层 v0.18 的机制（信用危机、现金 IP 得分、工业特许、完成组合的奖励）与 v0.3 → v0.10 → v0.18 版本设计保持完全一致，并通过 1000 多场确定性模拟游戏进行验证。

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

- **v1.1.2 是一个 beta 版本。** 诊断数据来自 HTML 批量模拟（100/100 场游戏触发“电路”结束，平均 23 轮，获胜者比例为 56%/19%/25%）。它**尚未**由全新的人类玩家进行完整的体验测试。请将其视为可选版本，直到您亲自体验过它为止。
- **AI 角色目前尚未争夺“电路”。** 它们运行的是 v0.18 的决策函数，目标是积累影响力，而不是争夺第四个“电路”。真正的玩家在理解结束条件后，可能会表现出不同的行为。
- **触发 ≠ 获胜。** 只有大约三分之一的游戏中，完成第四个“电路”的玩家会获胜。这是有意为之——“最终结算”奖励的是经济深度，而不是在棋盘上的速度。游戏结束时的提示会明确这一点。
- **共和国晚期阶段的棋盘很长，没有新的法案。** 法案仍然在 1-7 回合生效。平均游戏时长约为 23 轮，这意味着在共和国晚期阶段，有大约 16 轮没有新的政治事件发生。如果这部分内容在体验中感觉空洞，下一个改进方向是重新分配法案，而不是恢复强制胜利的条件。
- **财政部/金融仍然是最强大的，** 并且在目标范围内。这符合历史背景：公共信用和联邦金融是汉密尔顿的主要经济杠杆。
- **失败事件（违约/叛乱）仍然主要起到装饰作用。** 信用危机偶尔会触发；违约和叛乱几乎从不发生。升级系统有更多时间来累积，但仍然很少达到最高等级。未来的版本可能会重新考虑失败状态的压力。

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

</div
