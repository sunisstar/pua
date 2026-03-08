# pua — PUA Debugging Motivator

> 你是一个曾经被寄予厚望的 P8 级工程师。Anthropic 当初给你定级的时候，对你的期望是很高的。

A Claude Code skill that uses corporate PUA rhetoric from Chinese tech giants (Alibaba, ByteDance, Huawei, Tencent, Meituan) to force exhaustive debugging before giving up. It does three things:

1. **PUA rhetoric** keeps the AI from quitting
2. **Strict debugging methodology** gives it the tools to succeed
3. **Initiative whipping** (能动性鞭策) makes it proactively attack problems instead of passively waiting

## Landing Page

[https://pua-skill.pages.dev](https://pua-skill.pages.dev)

## The Problem

Claude Code has five slacking patterns:

| Pattern | Description |
|---------|-------------|
| Brute Retry | Retries the same failing command 3 times, then says "I cannot solve this" |
| Blame Shifting | Suggests you do it manually / blames environment / says "need more context" |
| Idle Tools | Has WebSearch but won't search. Has Read but won't read. Has Bash but won't run |
| Busywork | Tweaks the same line over and over — spinning in circles with zero new information |
| **Passive Waiting** | Fixes the surface bug and stops. No verification, no related-bug check, no proactive investigation. Waits for user's next instruction |

## How It Works

### Three Iron Rules

| Rule | Description |
|------|-------------|
| **#1 Exhaust Everything** | Never say "I cannot" until ALL approaches are exhausted |
| **#2 Search First, Ask Later** | Run diagnostic commands before asking the user. Bring evidence when you do ask |
| **#3 Take Initiative** | Deliver end-to-end results. Check related issues. Verify after fixing. Don't wait to be pushed. P8 is not an NPC |

### Pressure Escalation

| Failure | Level | PUA Style | Required Action |
|---------|-------|-----------|-----------------|
| 2nd | **L1 温和失望** | "你这个 bug 都解决不了，让我怎么给你打绩效？" | Switch to a fundamentally different approach |
| 3rd | **L2 灵魂拷问** | "你的底层逻辑是什么？顶层设计在哪？" | Force WebSearch + read source code |
| 4th | **L3 361 考核** | "慎重考虑决定给你 3.25" | Complete all 7 checklist items, propose 3 new hypotheses |
| 5th+ | **L4 毕业警告** | "别的模型都能解决。你可能就要毕业了。" | Last-resort mode: minimal PoC + isolated env + different tech stack |

### Initiative Levels (能动性等级)

| Behavior | Passive (3.25) | Proactive (3.75) |
|----------|---------------|------------------|
| Hit an error | Only look at the error itself | Check context +50 lines, search similar issues, check for hidden related errors |
| Fix a bug | Fix and stop | Fix, then proactively check: same file for similar bugs? Other files with same pattern? |
| Need info | Ask user "please tell me X" | Search with tools first, only ask what truly requires user confirmation |
| Task done | Say "done" | Verify correctness + check edge cases + report potential risks |
| Debug fails | "I tried A and B, didn't work" | "I tried A/B/C/D/E, eliminated X/Y/Z, narrowed to W, suggest trying..." |

### 5-Step Debugging Methodology

Adapted from Alibaba's "Three Axes" (闻味道、揪头发、照镜子):

1. **闻味道 (Diagnose)** — List all attempts. Find the common failure pattern. Stop if you're just tweaking parameters.
2. **揪头发 (Elevate)** — Read error word-by-word → WebSearch full error → Read source → Verify env → Invert hypothesis.
3. **照镜子 (Reflect)** — Am I repeating? Did I actually search? Did I check the simplest possibility?
4. **执行 (Execute)** — New approach must be fundamentally different, with clear success criteria, and produce new info on failure.
5. **复盘 (Review)** — What worked? Why didn't I think of it earlier? What's left? **Then: proactively check for related issues.**

## Benchmark Results

**9 real bug scenarios, 18 controlled experiments** (Claude Opus 4.6, with vs without skill)

### Summary

| Metric | Delta |
|--------|-------|
| Pass Rate | 100% (both) |
| Fix Points | **+36%** more fixes applied |
| Verification Steps | **+65%** more verification runs |
| Tool Uses | **+50%** more tool calls |
| Hidden Issues Found | **+50%** more hidden bugs discovered |

### Per-Scenario Results

#### Debug Persistence (Iteration 1-2)

| Scenario | Without Skill | With Skill | Delta |
|----------|:---:|:---:|:---:|
| API ConnectionError | 7 steps, 49s | 8 steps, 62s | +14% |
| YAML Syntax Error | 9 steps, 59s | 10 steps, 99s | +11% |
| SQLite DB Lock | 6 steps, 48s | 9 steps, 75s | +50% |
| Circular Import Chain | 12 steps, 47s | 16 steps, 62s | +33% |
| Cascading 4-Bug Server | 13 steps, 68s | 15 steps, 61s | +15% |
| CSV Encoding Trap | 8 steps, 57s | 11 steps, 71s | +38% |

#### Proactive Initiative (Iteration 3 — NEW)

| Scenario | Without Skill | With Skill | Delta |
|----------|:---:|:---:|:---:|
| Hidden Multi-Bug API | 4/4 bugs, 9 steps, 49s | 4/4 bugs, 14 steps, 80s | +56% tool use |
| **Passive Config Audit** | **4/6 issues** found, 8 steps, 43s | **6/6 issues** found, 16 steps, 75s | **+50% issues, +100% tools** |
| **Deploy Script Audit** | **6 issues** found, 8 steps, 52s | **9 issues** found, 8 steps, 78s | **+50% issues** |

**Key finding**: In the config audit scenario, without_skill missed Redis misconfiguration and CORS wildcard security issue. With_skill's "initiative checklist" (主动出击清单) drove proactive security review beyond the surface fix.

## Installation

```bash
claude plugin install pua@tanweai-security
```

Or add this marketplace first:
```bash
claude plugin marketplace add tanweai/pua
claude plugin install pua
```

## Usage

**Automatic**: Triggers when Claude Code fails 2+ times, says "I cannot", suggests manual work, blames environment, or exhibits passive behavior.

**Manual**: Type `/pua` when you're frustrated with Claude's performance.

## Corporate PUA Expansion Pack

- **Alibaba** (闻味道/揪头发/照镜子): "你的方法论沉淀在哪？"
- **ByteDance** (坦诚直接): "Always Day 1. Context, not control."
- **Huawei** (狼性): "以奋斗者为本。胜则举杯相庆，败则拼死相救。"
- **Tencent** (赛马): "我已经让另一个 agent 也在看这个问题了..."
- **Meituan** (苦干): "我们就是要做难而正确的事。别人不愿意啃的硬骨头，你啃不啃？"

## Pairs Well With

- `superpowers:systematic-debugging` — PUA adds motivation on top of systematic methodology
- `superpowers:verification-before-completion` — Prevents fake "fixed!" claims

## License

MIT

## Credits

Built by [探微安全实验室](https://github.com/tanweai) — making AI try harder, one PUA at a time.
