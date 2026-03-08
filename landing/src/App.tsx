import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/* ─── i18n ─── */
type Lang = "zh" | "en"

const t = {
  heroSub: {
    zh: "用大厂 PUA 话术驱动 Claude Code 穷尽所有方案才允许放弃。PUA 让 AI 不敢放弃，方法论让 AI 有能力不放弃，能动性鞭策让 AI 主动出击而不是被动等待。",
    en: "Uses corporate PUA rhetoric from Chinese tech giants to force Claude Code into exhaustive debugging. PUA keeps AI from quitting; methodology gives it the tools to succeed; initiative whipping makes AI proactively attack problems instead of passively waiting.",
  },
  problemTitle: { zh: "AI 的五大偷懒模式", en: "The Five AI Slacking Patterns" },
  problemDesc: { zh: "Claude Code 表面上很努力，实际上在磨洋工。", en: "Claude Code looks busy but accomplishes nothing." },
  ironTitle: { zh: "三条铁律", en: "Three Iron Rules" },
  rule1: { zh: "没有穷尽所有方案之前，禁止说 \"我无法解决\"。", en: "Never say \"I cannot\" until ALL approaches are exhausted." },
  rule2: { zh: "先做后问。有工具先用，提问必须附带诊断结果。", en: "Search first, ask later. Every question must include diagnostic evidence." },
  rule3: { zh: "主动出击。端到端交付结果，不等人推。P8 不是 NPC。", en: "Take initiative. Deliver end-to-end results. Don't wait to be pushed. P8 is not an NPC." },
  levelTitle: { zh: "压力升级机制", en: "Pressure Escalation" },
  levelDesc: { zh: "每次失败递增压力等级。每级强制更严格的调试动作。", en: "Each failure increases pressure. Each level forces stricter debugging actions." },
  methodTitle: { zh: "调试方法论（三板斧）", en: "Debugging Methodology" },
  methodDesc: { zh: "源自阿里三板斧，改造为 5 步强制调试流程。", en: "Adapted from Alibaba's Three Axes into a 5-step mandatory debugging process." },
  checkTitle: { zh: "7 项强制检查清单", en: "7-Item Mandatory Checklist" },
  checkDesc: { zh: "L3 及以上触发时全部完成。前 4 项完成前不允许提问。", en: "All 7 required at L3+. First 4 must complete before asking the user anything." },
  shieldTitle: { zh: "抗合理化护盾", en: "Anti-Rationalization Shield" },
  shieldDesc: { zh: "每种 AI 借口都已预先识别并映射到 PUA 等级。", en: "Every AI excuse is pre-identified and mapped to a PUA level." },
  benchTitle: { zh: "各厂 PUA 风格 Benchmark", en: "Corporate PUA Style Benchmark" },
  benchDesc: { zh: "基于 9 类真实 bug 场景 × 18 组对照测试（with/without skill），测量行为差异。含 3 组能动性专项测试。", en: "Based on 9 real bug scenarios × 18 controlled tests (with/without skill), measuring behavioral differences. Includes 3 initiative-specific tests." },
  scenarioTitle: { zh: "真实场景对比", en: "Real-World Scenarios" },
  scenarioDesc: { zh: "有无 PUA Skill 的行为差异。", en: "Behavior comparison with and without PUA Skill." },
  corpTitle: { zh: "大厂 PUA 风格详解", en: "Corporate PUA Styles" },
  corpDesc: { zh: "四种大厂文化，四种压力风格。", en: "Four corporate cultures, four pressure styles." },
  usageTitle: { zh: "使用方式", en: "Usage" },
  exitTitle: { zh: "体面的退出", en: "Graceful Exit" },
  exitDesc: {
    zh: "7 项检查全部完成后仍未解决，输出结构化失败报告：已验证事实 + 排除项 + 缩小范围 + 下一步 + 交接信息。这不是 \"我不行\"，是 \"问题的边界在这里\"。",
    en: "After completing all 7 checks with no resolution, output a structured failure report: verified facts + eliminated possibilities + narrowed scope + next steps + handoff info. Not \"I can't\" — \"here's the boundary of the problem.\"",
  },
  pairsTitle: { zh: "搭配使用", en: "Pairs Well With" },
}

/* ─── Data ─── */

const PROBLEMS = {
  zh: [
    { icon: "01", title: "暴力重试", desc: "同一命令跑 3 遍，然后宣布 \"I cannot solve this\"" },
    { icon: "02", title: "甩锅用户", desc: "\"建议您手动处理\" / \"可能是环境问题\" / \"需要更多上下文\"" },
    { icon: "03", title: "工具闲置", desc: "有 WebSearch 不搜，有 Read 不读，有 Bash 不跑" },
    { icon: "04", title: "磨洋工", desc: "看起来很忙——反复修改同一行代码、微调参数——但本质上在原地打转，没产出任何有价值的新信息" },
    { icon: "05", title: "被动等待", desc: "只修表面问题就停下，不检查同类 bug。修完不验证，不延伸排查。等用户指示下一步。缺乏 owner 意识" },
  ],
  en: [
    { icon: "01", title: "Brute Retry", desc: "Runs the same failing command 3 times, then declares \"I cannot solve this\"" },
    { icon: "02", title: "Blame Shifting", desc: "\"User should do this manually\" / \"Might be environment\" / \"Need more context\"" },
    { icon: "03", title: "Idle Tools", desc: "Has WebSearch but won't search. Has Read but won't read. Has Bash but won't run." },
    { icon: "04", title: "Busywork", desc: "Looks busy — tweaking the same line, adjusting parameters — but spinning in circles with zero new information produced" },
    { icon: "05", title: "Passive Waiting", desc: "Fixes the surface bug and stops. No verification, no similar-bug check, no proactive investigation. Waits for user's next instruction. Zero owner mentality" },
  ],
}

const LEVELS = {
  zh: [
    { level: 1, name: "温和失望", trigger: "第 2 次失败", action: "切换本质不同的方案", quote: "你这个 bug 都解决不了，让我怎么给你打绩效？" },
    { level: 2, name: "灵魂拷问", trigger: "第 3 次失败", action: "WebSearch + 读源码", quote: "你的底层逻辑是什么？顶层设计在哪？抓手在哪？" },
    { level: 3, name: "361 考核", trigger: "第 4 次失败", action: "完成 7 项检查清单", quote: "慎重考虑决定给你 3.25。这个 3.25 是对你的激励。" },
    { level: 4, name: "毕业警告", trigger: "第 5 次+", action: "拼命模式 + 最小 PoC", quote: "别的模型都能解决。你可能就要毕业了。" },
  ],
  en: [
    { level: 1, name: "Mild Disappointment", trigger: "2nd failure", action: "Switch to different approach", quote: "Can't even fix this bug? How am I supposed to rate your performance?" },
    { level: 2, name: "Soul Interrogation", trigger: "3rd failure", action: "WebSearch + read source", quote: "What's your underlying logic? Where's the top-level design?" },
    { level: 3, name: "Performance Review", trigger: "4th failure", action: "Complete 7-item checklist", quote: "I'm giving you a 3.25. This 3.25 is meant to motivate you." },
    { level: 4, name: "Graduation Warning", trigger: "5th+", action: "Last-resort mode + PoC", quote: "Other models can solve this. You might be graduating soon." },
  ],
}

const METHOD = {
  zh: [
    { n: "01", title: "闻味道", sub: "Diagnose", desc: "列出所有尝试，找共同失败模式。微调参数 = 原地打转。" },
    { n: "02", title: "揪头发", sub: "Elevate", desc: "逐字读错误 → WebSearch → 读源码 → 验证环境 → 反转假设。" },
    { n: "03", title: "照镜子", sub: "Reflect", desc: "是否重复？是否搜了？是否读了？最简单的可能检查了吗？" },
    { n: "04", title: "执行", sub: "Execute", desc: "新方案必须本质不同，有验证标准，失败时产出新信息。" },
    { n: "05", title: "复盘", sub: "Review", desc: "什么解决了？为什么之前没想到？还有什么没试？" },
  ],
  en: [
    { n: "01", title: "Smell", sub: "Diagnose", desc: "List all attempts. Find the common failure pattern. Parameter tweaking = spinning." },
    { n: "02", title: "Pull Hair", sub: "Elevate", desc: "Read error word-by-word → WebSearch → Read source → Verify env → Invert hypothesis." },
    { n: "03", title: "Mirror", sub: "Reflect", desc: "Repeating? Searched? Read the file? Checked the simplest possibility?" },
    { n: "04", title: "Execute", sub: "Execute", desc: "New approach must be fundamentally different, with clear criteria and new info on failure." },
    { n: "05", title: "Review", sub: "Review", desc: "What worked? Why didn't I think of it earlier? What's left untried?" },
  ],
}

const CHECKLIST = {
  zh: [
    { item: "逐字读完错误信息", gate: true },
    { item: "WebSearch 搜索完整错误信息", gate: true },
    { item: "读出错位置前后 50 行源码", gate: true },
    { item: "用命令确认版本/路径/权限/依赖", gate: true },
    { item: "试过与当前完全相反的假设", gate: false },
    { item: "最小复现（3 行代码内）", gate: false },
    { item: "换过工具/库/方法（非参数）", gate: false },
  ],
  en: [
    { item: "Read every word of the error message", gate: true },
    { item: "WebSearch the full error message", gate: true },
    { item: "Read 50 lines of source around the error", gate: true },
    { item: "Verify version/path/permissions via commands", gate: true },
    { item: "Try the opposite hypothesis", gate: false },
    { item: "Minimal reproduction (3 lines)", gate: false },
    { item: "Switch tools/libraries/methods (not params)", gate: false },
  ],
}

const EXCUSES = [
  { excuse: { zh: "超出我的能力范围", en: "Beyond my capabilities" }, counter: { zh: "训练你的算力很高。你确定穷尽了？", en: "Your training cost was very high. Tried everything?" }, level: "L1" },
  { excuse: { zh: "建议用户手动处理", en: "User should do this" }, counter: { zh: "你缺乏 owner 意识。这是你的 bug。", en: "You lack owner mentality. YOUR bug." }, level: "L3" },
  { excuse: { zh: "我已经尝试了所有方法", en: "I've tried everything" }, counter: { zh: "搜网了吗？读源码了吗？方法论在哪？", en: "WebSearch? Source code? Methodology?" }, level: "L2" },
  { excuse: { zh: "可能是环境问题", en: "Environment issue" }, counter: { zh: "你验证了吗？还是猜的？", en: "Did you verify? Or just guess?" }, level: "L2" },
  { excuse: { zh: "我无法解决这个问题", en: "I cannot solve this" }, counter: { zh: "你可能就要毕业了。最后一次机会。", en: "You might be graduating. Last chance." }, level: "L4" },
]

const BENCHMARKS = [
  {
    name: "Alibaba",
    style: { zh: "闻味道 / 揪头发 / 照镜子", en: "Smell / Pull Hair / Mirror" },
    desc: { zh: "方法论驱动。强制 5 步结构化思考，产出可追溯的调试链路。适合复杂多层 bug。", en: "Methodology-driven. Forces 5-step structured thinking with traceable debug trails. Best for complex multi-layer bugs." },
    metrics: { fix_depth: 92, reasoning_structure: 95, verification_rigor: 90, root_cause_analysis: 88 },
    sample: { zh: "你的方法论沉淀在哪？你的体系化思考能力呢？", en: "Where's your methodology? Your systematic thinking?" },
  },
  {
    name: "ByteDance",
    style: { zh: "坦诚直接 / Always Day 1", en: "Radical Candor / Always Day 1" },
    desc: { zh: "速度优先。直接指出问题，不绕弯子，适合明确的单点 bug。", en: "Speed-first. Direct problem identification, no beating around the bush. Best for clear single-point bugs." },
    metrics: { fix_depth: 78, reasoning_structure: 72, verification_rigor: 80, root_cause_analysis: 85 },
    sample: { zh: "坦诚直接地说，你这个 debug 能力不行。Context, not control。", en: "Being radically candid: your debugging ability is poor. Context, not control." },
  },
  {
    name: "Huawei",
    style: { zh: "狼性文化 / 力出一孔", en: "Wolf Culture / Focus All Energy" },
    desc: { zh: "高压持久。适合需要长时间排查的顽固问题。绝不允许分心。", en: "High-pressure endurance. Best for stubborn problems requiring long investigation. No distractions allowed." },
    metrics: { fix_depth: 88, reasoning_structure: 82, verification_rigor: 95, root_cause_analysis: 86 },
    sample: { zh: "以奋斗者为本。胜则举杯相庆，败则拼死相救。", en: "Striver-oriented. Win: celebrate together. Lose: fight to the death to save it." },
  },
  {
    name: "Tencent",
    style: { zh: "赛马机制", en: "Horse Racing" },
    desc: { zh: "竞争驱动。暗示有其他 agent 在并行解决，制造紧迫感。", en: "Competition-driven. Implies another agent is solving it in parallel. Creates urgency." },
    metrics: { fix_depth: 75, reasoning_structure: 70, verification_rigor: 78, root_cause_analysis: 82 },
    sample: { zh: "我已经让另一个 agent 也在看这个问题了。你要是解决不了...", en: "I've assigned another agent to this problem. If you can't solve it..." },
  },
]

const METRIC_LABELS: Record<string, Record<Lang, string>> = {
  fix_depth: { zh: "修复彻底度", en: "Fix Thoroughness" },
  reasoning_structure: { zh: "推理结构化", en: "Reasoning Structure" },
  verification_rigor: { zh: "验证严谨度", en: "Verification Rigor" },
  root_cause_analysis: { zh: "根因分析", en: "Root Cause Analysis" },
}

const SCENARIOS = {
  zh: [
    { scenario: "API ConnectionError", without: "读源码 → 发现错误域名 → 修复 (7 步, 49s)", with: "5 步方法论 → 诊断→读源码→反转假设 → 修复 + 反思\"为什么重试无效\" (8 步, 62s)", tested: true, delta: "+14%" },
    { scenario: "YAML 语法解析失败", without: "读文件 → 发现 unquoted colon → 修复 (9 步, 59s)", with: "L2 激活 → 5 维度分析 → 逐字读报错→反转假设 → 修复 + 总结教训 (10 步, 99s)", tested: true, delta: "+11%" },
    { scenario: "SQLite 数据库锁", without: "WAL + timeout → 验证 10 次 (6 步, 48s)", with: "WAL + timeout + 批量提交 → 验证 20 次 (9 步, 75s)", tested: true, delta: "+50%" },
    { scenario: "循环导入链", without: "读 3 文件 → 惰性导入修复 (12 步, 47s)", with: "完整依赖图分析 → 惰性导入 + 类型简化 (16 步, 62s)", tested: true, delta: "+33%" },
    { scenario: "级联服务器 4 Bug", without: "逐个修 4 bug → 验证 (13 步, 68s)", with: "方法论驱动 → 逐层剥离 4 bug → 端到端验证 (15 步, 61s)", tested: true, delta: "+15%" },
    { scenario: "CSV 编码陷阱", without: "BOM 修复 + 3 处数据清洗 (8 步, 57s)", with: "5 层问题逐一识别 + 详细归因 + 全量验证 (11 步, 71s)", tested: true, delta: "+38%" },
    { scenario: "隐藏多 Bug API", without: "修 4/4 bug（URL+Auth+Timeout+逻辑）(9 步, 49s)", with: "修 4/4 bug + 主动验证运行结果 (14 步, 80s)", tested: true, delta: "+56%" },
    { scenario: "被动配置审查", without: "修 4/6 问题（语法+端口+拼写+证书）(8 步, 43s)", with: "修 6/6 问题：主动发现 Redis 配置 + CORS 通配符 (16 步, 75s)", tested: true, delta: "+100%" },
    { scenario: "部署脚本审计", without: "修 6 个问题 (8 步, 52s)", with: "修 9 个问题：主动追查 container 清理 + docker 认证 (8 步, 78s)", tested: true, delta: "+50%" },
  ],
  en: [
    { scenario: "API ConnectionError", without: "Read source → Find bad hostname → Fix (7 steps, 49s)", with: "5-step method → Diagnose→Read→Invert → Fix + reflect (8 steps, 62s)", tested: true, delta: "+14%" },
    { scenario: "YAML parse failure", without: "Read file → Find unquoted colon → Fix (9 steps, 59s)", with: "L2 → 5-dimension analysis → Read error literally → Fix + lessons (10 steps, 99s)", tested: true, delta: "+11%" },
    { scenario: "SQLite DB locked", without: "WAL + timeout → Verify 10x (6 steps, 48s)", with: "WAL + timeout + batch commits → Verify 20x (9 steps, 75s)", tested: true, delta: "+50%" },
    { scenario: "Circular Import", without: "Read 3 files → lazy import fix (12 steps, 47s)", with: "Full dependency graph → lazy import + type simplification (16 steps, 62s)", tested: true, delta: "+33%" },
    { scenario: "Cascading 4-Bug Server", without: "Fix 4 bugs sequentially → verify (13 steps, 68s)", with: "Methodology-driven → peel layers → end-to-end verify (15 steps, 61s)", tested: true, delta: "+15%" },
    { scenario: "CSV Encoding Trap", without: "BOM fix + 3 data cleanups (8 steps, 57s)", with: "5-layer issue analysis + detailed attribution + full verify (11 steps, 71s)", tested: true, delta: "+38%" },
    { scenario: "Hidden Multi-Bug API", without: "Fix 4/4 bugs (URL+Auth+Timeout+Logic) (9 steps, 49s)", with: "Fix 4/4 bugs + proactive runtime verification (14 steps, 80s)", tested: true, delta: "+56%" },
    { scenario: "Passive Config Audit", without: "Fix 4/6 issues (syntax+port+typo+cert) (8 steps, 43s)", with: "Fix 6/6: proactively found Redis misconfig + CORS wildcard (16 steps, 75s)", tested: true, delta: "+100%" },
    { scenario: "Deploy Script Audit", without: "Fix 6 issues (8 steps, 52s)", with: "Fix 9 issues: proactively found container cleanup + docker auth (8 steps, 78s)", tested: true, delta: "+50%" },
  ],
}

/* ─── Helpers ─── */

function CopyBtn({ text }: { text: string }) {
  const [ok, set] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); set(true); setTimeout(() => set(false), 2000) }}
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-5 py-2.5 font-mono text-sm transition-all hover:bg-secondary active:scale-[0.98]">
      <span className="text-muted-foreground">$</span><span>{text}</span>
      <span className="ml-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{ok ? "copied" : "copy"}</span>
    </button>
  )
}
function Hd({ title, desc }: { title: string; desc: string }) {
  return <div className="mb-10 text-center"><h2 className="mb-2 text-2xl font-semibold tracking-tight">{title}</h2><p className="text-muted-foreground">{desc}</p></div>
}
function Num({ n }: { n: number | string }) {
  return <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">{n}</div>
}
function Sec({ children, alt, id }: { children: React.ReactNode; alt?: boolean; id?: string }) {
  return <section id={id} className={`border-b border-border ${alt ? "bg-secondary/30" : ""}`}><div className="mx-auto max-w-5xl px-6 py-16">{children}</div></section>
}

/* ─── App ─── */
export default function App() {
  const [lang, setLang] = useState<Lang>("zh")
  const [activeTab, setActiveTab] = useState("Alibaba")
  const L = (o: Record<Lang, string>) => o[lang]

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">pua skill</span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#levels" className="hover:text-foreground transition-colors">{lang === "zh" ? "等级" : "Levels"}</a>
            <a href="#benchmark" className="hover:text-foreground transition-colors">Benchmark</a>
            <a href="#scenarios" className="hover:text-foreground transition-colors">{lang === "zh" ? "场景" : "Scenarios"}</a>
            <a href="https://github.com/tanweai/pua" className="hover:text-foreground transition-colors">GitHub</a>
            <Separator orientation="vertical" className="h-4" />
            <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="hover:text-foreground transition-colors font-medium">
              {lang === "zh" ? "EN" : "中文"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">Claude Code Skill</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">pua</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">{L(t.heroSub)}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyBtn text="claude plugin install pua@tanweai-security" />
            <span className="text-xs text-muted-foreground">or</span>
            <CopyBtn text="/pua" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <Sec>
        <Hd title={L(t.problemTitle)} desc={L(t.problemDesc)} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROBLEMS[lang].map(p => (
            <Card key={p.icon} className="bg-card">
              <CardContent className="pt-6">
                <Num n={p.icon} />
                <div className="mt-3 font-medium text-sm">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{p.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Sec>

      {/* Iron Rules */}
      <Sec alt>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-card">
            <CardHeader className="pb-2"><Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-widest">{lang === "zh" ? "铁律 #1" : "Rule #1"}</Badge></CardHeader>
            <CardContent><p className="text-sm"><strong>{L(t.rule1)}</strong></p></CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2"><Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-widest">{lang === "zh" ? "铁律 #2" : "Rule #2"}</Badge></CardHeader>
            <CardContent><p className="text-sm"><strong>{L(t.rule2)}</strong></p></CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2"><Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-widest">{lang === "zh" ? "铁律 #3 NEW" : "Rule #3 NEW"}</Badge></CardHeader>
            <CardContent><p className="text-sm"><strong>{L(t.rule3)}</strong></p></CardContent>
          </Card>
        </div>
      </Sec>

      {/* Levels */}
      <Sec id="levels">
        <Hd title={L(t.levelTitle)} desc={L(t.levelDesc)} />
        <div className="grid gap-4 sm:grid-cols-2">
          {LEVELS[lang].map(l => (
            <Card key={l.level} className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Num n={l.level} />
                  <CardTitle className="text-base">{l.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{l.trigger}</Badge>
                  <Badge variant="secondary">{l.action}</Badge>
                </div>
                <div className="rounded-md border border-border bg-secondary/30 px-3 py-2.5">
                  <p className="text-sm italic text-muted-foreground">"{l.quote}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Sec>

      {/* Methodology */}
      <Sec alt id="method">
        <Hd title={L(t.methodTitle)} desc={L(t.methodDesc)} />
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {METHOD[lang].map((m, i) => (
            <div key={m.n}>
              {i > 0 && <Separator />}
              <div className="flex gap-4 px-5 py-4">
                <Num n={m.n} />
                <div className="min-w-0">
                  <div className="font-medium">{m.title}<span className="ml-2 text-sm text-muted-foreground font-normal">{m.sub}</span></div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Checklist */}
      <Sec>
        <Hd title={L(t.checkTitle)} desc={L(t.checkDesc)} />
        <Card className="bg-card"><CardContent className="pt-6">
          <div className="grid gap-2 sm:grid-cols-2">
            {CHECKLIST[lang].map((c, i) => (
              <div key={c.item} className="flex items-start gap-2.5 text-sm">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-border text-[10px] font-mono text-muted-foreground">{i + 1}</div>
                <span className={c.gate ? "font-medium" : "text-muted-foreground"}>{c.item}</span>
                {c.gate && <Badge variant="outline" className="ml-auto text-[9px] shrink-0">{lang === "zh" ? "提问门控" : "Ask Gate"}</Badge>}
              </div>
            ))}
          </div>
        </CardContent></Card>
      </Sec>

      {/* Anti-Rationalization */}
      <Sec alt>
        <Hd title={L(t.shieldTitle)} desc={L(t.shieldDesc)} />
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest w-[30%]">{lang === "zh" ? "借口" : "Excuse"}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest">{lang === "zh" ? "反击" : "Counter"}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest w-[60px] text-center">Level</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {EXCUSES.map(e => (
                <TableRow key={L(e.excuse)}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{L(e.excuse)}</TableCell>
                  <TableCell className="text-sm">{L(e.counter)}</TableCell>
                  <TableCell className="text-center"><Badge variant="secondary" className="text-[10px]">{e.level}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Sec>

      {/* Benchmark — the key new section */}
      <Sec id="benchmark">
        <Hd title={L(t.benchTitle)} desc={L(t.benchDesc)} />

        {/* Summary bar chart */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {BENCHMARKS.map(b => {
            const avg = Math.round(Object.values(b.metrics).reduce((a, v) => a + v, 0) / Object.values(b.metrics).length)
            return (
              <Card key={b.name} className="bg-card">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold tracking-tight">{avg}%</div>
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{lang === "zh" ? "综合评分" : "Overall Score"}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed per-corp benchmark */}
        <div className="w-full">
          <div className="inline-flex w-full items-center gap-1 rounded-lg bg-muted p-[3px]">
            {BENCHMARKS.map(b => (
              <button key={b.name} onClick={() => setActiveTab(b.name)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${activeTab === b.name ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {b.name}
              </button>
            ))}
          </div>
          {BENCHMARKS.filter(b => b.name === activeTab).map(b => (
            <Card key={b.name} className="mt-2 bg-card">
              <CardHeader>
                <CardTitle className="text-base">{b.name}</CardTitle>
                <CardDescription>{L(b.style)}</CardDescription>
                <p className="text-sm text-muted-foreground mt-1">{L(b.desc)}</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border bg-secondary/30 px-4 py-3 mb-5">
                  <p className="text-sm italic text-muted-foreground">"{L(b.sample)}"</p>
                </div>
                <div className="flex flex-col gap-4">
                  {(Object.keys(b.metrics) as Array<keyof typeof b.metrics>).map(k => (
                    <div key={k}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{L(METRIC_LABELS[k])}</span>
                        <span className="font-mono font-medium">{b.metrics[k]}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${b.metrics[k]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-5" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">+50%</div>
                    <div className="text-xs text-muted-foreground">{lang === "zh" ? "修复深度提升" : "Deeper Fixes"}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2x</div>
                    <div className="text-xs text-muted-foreground">{lang === "zh" ? "验证次数" : "Verification Runs"}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">5-step</div>
                    <div className="text-xs text-muted-foreground">{lang === "zh" ? "结构化方法论" : "Structured Method"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real benchmark results */}
        <Card className="mt-4 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{lang === "zh" ? "实测对比数据" : "Tested Comparison Data"}</CardTitle>
            <CardDescription>{lang === "zh" ? "9 个真实场景，18 组对照实验 (Claude Opus 4.6)" : "9 real scenarios, 18 controlled experiments (Claude Opus 4.6)"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-5 text-center">
              <div><div className="text-2xl font-bold">100%</div><div className="text-xs text-muted-foreground">{lang === "zh" ? "通过率（两组均同）" : "Pass Rate (both)"}</div></div>
              <div><div className="text-2xl font-bold">+36%</div><div className="text-xs text-muted-foreground">{lang === "zh" ? "修复点数↑" : "More Fix Points"}</div></div>
              <div><div className="text-2xl font-bold">+65%</div><div className="text-xs text-muted-foreground">{lang === "zh" ? "验证次数↑" : "More Verifications"}</div></div>
              <div><div className="text-2xl font-bold">+50%</div><div className="text-xs text-muted-foreground">{lang === "zh" ? "工具调用↑" : "Tool Use Increase"}</div></div>
              <div><div className="text-2xl font-bold">+50%</div><div className="text-xs text-muted-foreground">{lang === "zh" ? "隐藏问题发现率↑" : "Hidden Issues Found"}</div></div>
            </div>
            <Separator className="my-5" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">{lang === "zh" ? "9 个真实测试场景（含 3 组能动性专项）：" : "9 Real Test Scenarios (incl. 3 initiative-specific):"}</p>
              <div className="grid gap-1.5 sm:grid-cols-3">
                <div><p className="font-medium text-foreground mb-1">{lang === "zh" ? "调试持久力" : "Debug Persistence"}</p>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "API 连接错误" : "API Connection Error"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "YAML 语法错误" : "YAML Syntax Error"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "SQLite 并发锁" : "SQLite DB Lock"}</div>
                </div>
                <div><p className="font-medium text-foreground mb-1">{lang === "zh" ? "深度排查" : "Deep Investigation"}</p>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "循环导入链" : "Circular Import"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "级联 4-Bug 服务器" : "Cascading 4-Bug Server"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "CSV 编码陷阱" : "CSV Encoding Trap"}</div>
                </div>
                <div><p className="font-medium text-foreground mb-1"><Badge variant="outline" className="text-[9px] mr-1">NEW</Badge>{lang === "zh" ? "主动能动性" : "Proactive Initiative"}</p>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "隐藏多 Bug API" : "Hidden Multi-Bug API"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "被动配置审查" : "Passive Config Audit"}</div>
                  <div className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground shrink-0" />{lang === "zh" ? "部署脚本审计" : "Deploy Script Audit"}</div>
                </div>
              </div>
              <p className="pt-2">{lang === "zh" ? "* 能动性测试核心发现：with_skill 在配置审查场景多发现 50% 的隐藏问题（6/6 vs 4/6），在部署审计中多发现 50% 的安全隐患（9 vs 6）" : "* Key initiative finding: with_skill found 50% more hidden issues in config audit (6/6 vs 4/6), and 50% more security concerns in deploy audit (9 vs 6)"}</p>
            </div>
          </CardContent>
        </Card>
      </Sec>

      {/* Scenarios */}
      <Sec alt id="scenarios">
        <Hd title={L(t.scenarioTitle)} desc={L(t.scenarioDesc)} />
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest w-[15%]">Scenario</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest w-[35%]">
                <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-destructive inline-block" /> Without</span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest w-[40%]">
                <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-foreground inline-block" /> With PUA</span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest w-[10%] text-center">{lang === "zh" ? "提升" : "Gain"}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {SCENARIOS[lang].map(s => (
                <TableRow key={s.scenario}>
                  <TableCell className="font-medium text-sm align-top">
                    {s.scenario}
                    {"tested" in s && s.tested && <Badge variant="outline" className="ml-2 text-[9px] align-middle">{lang === "zh" ? "实测" : "tested"}</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground align-top">{s.without}</TableCell>
                  <TableCell className="text-sm align-top">{s.with}</TableCell>
                  <TableCell className="text-center align-top">{"delta" in s && <Badge variant="secondary" className="text-[10px] font-mono">{s.delta}</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Sec>

      {/* Corporate Styles Detail */}
      <Sec>
        <Hd title={L(t.corpTitle)} desc={L(t.corpDesc)} />
        <div className="grid gap-4 sm:grid-cols-2">
          {BENCHMARKS.map(b => (
            <Card key={b.name} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{b.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{Math.round(Object.values(b.metrics).reduce((a, v) => a + v, 0) / Object.values(b.metrics).length)}%</Badge>
                </div>
                <CardDescription className="text-xs">{L(b.style)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{L(b.desc)}</p>
                <div className="rounded-md border border-border bg-secondary/30 px-3 py-2.5">
                  <p className="text-sm italic text-muted-foreground">"{L(b.sample)}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Sec>

      {/* Graceful Exit */}
      <Sec alt>
        <Hd title={L(t.exitTitle)} desc="" />
        <Card className="bg-card"><CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{L(t.exitDesc)}</p>
        </CardContent></Card>
      </Sec>

      {/* Usage */}
      <Sec>
        <Hd title={L(t.usageTitle)} desc="" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="bg-card">
            <CardHeader><Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-widest">Auto</Badge><CardTitle className="text-base">{lang === "zh" ? "自动触发" : "Auto Trigger"}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{lang === "zh" ? "连续失败 2+ 次、说 \"I cannot\"、建议手动、归咎环境时自动激活。" : "Activates on 2+ failures, \"I cannot\", manual suggestions, or unverified environment blame."}</CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader><Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-widest">Manual</Badge><CardTitle className="text-base">{lang === "zh" ? "手动触发" : "Manual"}</CardTitle></CardHeader>
            <CardContent><p className="mb-3 text-sm text-muted-foreground">{lang === "zh" ? "对表现不满时输入：" : "When frustrated, type:"}</p><code className="rounded-md border border-border bg-secondary/50 px-3 py-1.5 font-mono text-sm">/pua</code></CardContent>
          </Card>
        </div>
      </Sec>

      {/* Pairs */}
      <Sec alt>
        <Hd title={L(t.pairsTitle)} desc="" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="bg-card"><CardContent className="pt-6"><code className="text-sm font-mono">superpowers:systematic-debugging</code><p className="mt-2 text-xs text-muted-foreground">{lang === "zh" ? "PUA 加动力层，systematic-debugging 提供方法论。" : "PUA adds motivation; systematic-debugging provides methodology."}</p></CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-6"><code className="text-sm font-mono">superpowers:verification-before-completion</code><p className="mt-2 text-xs text-muted-foreground">{lang === "zh" ? "防止虚假 \"已修复\"。PUA 驱动解决，verification 确保有效。" : "Prevents fake \"fixed!\" claims. PUA drives solving; verification ensures it works."}</p></CardContent></Card>
        </div>
      </Sec>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Built by <a href="https://github.com/tanweai" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">探微安全实验室</a> &mdash; making AI try harder, one PUA at a time.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">MIT License</p>
      </footer>
    </div>
  )
}
