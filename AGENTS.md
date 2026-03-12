# PUA 万能激励引擎

## 项目概述

AI Coding Agent 技能插件，用中西大厂 PUA 话术驱动 AI 穷尽所有方案才允许放弃。

**核心能力：**
- **PUA 话术** — 让 AI 不敢放弃
- **调试方法论** — 让 AI 有能力不放弃
- **能动性鞭策** — 让 AI 主动出击而不是被动等待

## 项目结构

```
pua/
├── AGENTS.md                    # 项目文档
├── README.md                    # 用户说明
├── assets/                      # 截图资源
│   ├── pua1.jpg                 # L3 触发案例截图
│   ├── pua2.jpg                 # 根因定位截图
│   └── pua3.jpg                 # 复盘截图
├── .claude-plugin/
│   └── plugin.json              # 插件配置（Claude Code）
└── skills/
    └── SKILL.md                 # 核心 skill 定义
```

## 安装方式

### Claude Code

```bash
# 方式一：通过 marketplace 安装
claude plugin marketplace add sunisstar/pua
claude plugin install pua@pua

# 方式二：手动安装
git clone https://github.com/sunisstar/pua.git ~/.claude/plugins/pua
```

### iFlow CLI

**项目级安装：**
```powershell
New-Item -ItemType Directory -Force -Path ".iflow\skills\pua"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/sunisstar/pua/main/skills/SKILL.md" -OutFile ".iflow\skills\pua\SKILL.md"
```

**全局安装：**
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.iflow\skills\pua"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/sunisstar/pua/main/skills/SKILL.md" -OutFile "$env:USERPROFILE\.iflow\skills\pua\SKILL.md"
```

## 触发机制

### 自动触发条件

- 任务连续失败 2 次以上
- 即将说 "I cannot" / "我无法解决"
- 把问题推给用户或未验证就归咎环境
- 反复微调同一处代码/参数（磨洋工）
- 修完表面问题就停，不检查关联问题
- 用户表达沮丧情绪

### 手动触发

在对话中输入 `/pua` 即可。

## 核心机制

### 三条铁律

1. **穷尽一切** — 没有穷尽所有方案前禁止说"我无法解决"
2. **先做后问** — 有工具先用，提问必须附带诊断结果
3. **主动出击** — 端到端交付结果，不等人推

### 压力升级（4 级）

| 次数 | 等级 | 强制动作 |
|------|------|---------|
| 第 2 次 | L1 温和失望 | 切换本质不同的方案 |
| 第 3 次 | L2 灵魂拷问 | WebSearch + 读源码 |
| 第 4 次 | L3 361 考核 | 完成 7 项检查清单 |
| 第 5 次+ | L4 毕业警告 | 拼命模式 |

### 调试方法论（五步）

1. **闻味道** — 列出所有尝试，找共同失败模式
2. **揪头发** — 逐字读错误 → 搜索 → 读源码 → 验证环境 → 反转假设
3. **照镜子** — 是否重复？是否搜了？是否读了？
4. **执行** — 新方案必须本质不同
5. **复盘** — 什么解决了？为什么之前没想到？

## 开发说明

### 文件修改指南

- `skills/SKILL.md` — 核心 skill 逻辑，修改后需测试触发效果
- `.claude-plugin/plugin.json` — 插件配置
- `README.md` — 用户文档
- `assets/` — 文档截图资源

### 本地测试

1. 克隆到 Claude Code 插件目录
2. 重启 Claude Code
3. 在对话中触发失败场景或输入 `/pua`

## License

MIT
