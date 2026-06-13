import { useEffect } from 'react';

const isChinaLocale = process.env.NEXT_PUBLIC_SITE_LOCALE === 'zh-CN';

const exactText = new Map(Object.entries({
  'World Cup AI Predictor': '世界杯 AI 概率研究平台',
  'Home': '首页',
  'Match Predictor': '比赛预测',
  'Group Stage': '小组赛',
  'Champion': '冠军预测',
  'Tutorial': '使用教程',
  'About': '关于',
  'Pricing': '版本规划',
  'Settings': '数据源设置',
  'Login': '登录',
  'Register': '注册',
  'Logout': '退出登录',
  'User': '用户',
  'Football analytics for World Cup 2026': '2026 世界杯足球数据分析',
  'Build trust with clear football probabilities.': '用清晰的足球概率建立判断依据。',
  'Create free account': '创建免费账号',
  'View pricing plan': '查看版本规划',
  'Commercial product map': '商业产品路线',
  'Open core, paid intelligence': '核心开放，深度智能可商业化',
  'SaaS-ready': 'SaaS 就绪',
  'Free public value': '免费公开价值',
  'Pro analytics upside': '专业分析增值',
  'Business customization': '商业定制',
  'Free core': '免费核心版',
  'Pro layer': '专业分析层',
  'Analyst layer': '分析师层',
  'Business layer': '商业层',
  'What the platform should become': '平台发展方向',
  'Configure data sources': '配置数据源',
  'Transparent probabilities': '透明概率',
  'Odds-first analytics': '盘口信号分析',
  'API-ready framework': 'API 接入框架',
  'Pricing strategy': '版本策略',
  'Start open, charge for deeper intelligence.': '先开放核心功能，再为深度智能收费。',
  'Fans and early testers': '球迷和早期测试用户',
  'Power users and content creators': '深度用户和内容创作者',
  'Analysts, communities, and operators': '分析师、社群和运营方',
  'E-commerce, media, and branded campaigns': '电商、媒体和品牌活动',
  'Free': '免费版',
  'Pro': '专业版',
  'Analyst': '分析师版',
  'Business': '商业版',
  'Custom': '定制',
  'Start free': '免费开始',
  'Join waitlist': '加入候补名单',
  'Request access': '申请访问',
  'Contact admin': '联系管理员',
  'Compliance positioning': '合规定位',
  'Member workspace': '会员工作区',
  'Welcome back': '欢迎回来',
  'Email': '邮箱',
  'Password': '密码',
  'Sign in': '登录',
  'No account yet?': '还没有账号？',
  'Register here': '去注册',
  'Create your account': '创建账号',
  'Username': '用户名',
  'Repeat password': '重复密码',
  'I confirm I am 18+ and will use this product for analytics only.': '我确认已满 18 岁，并仅将本产品用于数据分析。',
  'I agree to the Terms of service': '我同意服务条款',
  'Sign up': '注册',
  'Already have an account?': '已有账号？',
  'Sign in here': '去登录',
  'Match setup': '比赛设置',
  'Team A': '球队 A',
  'Team B': '球队 B',
  'Team A profile': '球队 A 信息',
  'Team B profile': '球队 B 信息',
  'Group': '小组',
  'Confederation': '洲际足联',
  'Date': '日期',
  'Kickoff': '开球时间',
  'Stadium': '球场',
  'Odds input and market signal': '赔率输入与市场信号',
  'Fill sample odds': '填入示例赔率',
  'Team A odds': '球队 A 赔率',
  'Draw odds': '平局赔率',
  'Team B odds': '球队 B 赔率',
  'Live match intelligence': '实时比赛智能',
  'Enable live layer': '启用实时层',
  'Auto live feed': '自动实时数据',
  'Refresh live data': '刷新实时数据',
  'Reset live': '重置实时数据',
  'Minute': '比赛分钟',
  'Team A score': '球队 A 比分',
  'Team B score': '球队 B 比分',
  'Team A red cards': '球队 A 红牌',
  'Team B red cards': '球队 B 红牌',
  'Live Team A odds odds': '球队 A 实时赔率',
  'Live draw odds odds': '平局实时赔率',
  'Live Team B odds odds': '球队 B 实时赔率',
  'Home advantage': '主场优势',
  'Neutral venue': '中立场地',
  'Away context': '客场环境',
  'Generate prediction': '生成预测',
  'Prediction result': '预测结果',
  'Confidence': '置信度',
  'Most likely scores': '最可能比分',
  'Model breakdown': '模型拆解',
  'Expected goals': '预期进球',
  'Match strength': '比赛强度',
  'Live APIs applied': '已应用实时 API',
  'APIs attempted': '已尝试 API',
  'Aggregation': '聚合方式',
  'Base probability': '基础概率',
  'Probability rationale': '概率依据',
  'DeepSeek V4 Pro final synthesis': 'DeepSeek V4 Pro 最终综合推理',
  'Live evidence used': '已使用的实时证据',
  'API provider audit': 'API 数据源审计',
  'Baseline strength model': '基础实力模型',
  'Player status and injuries': '球员状态与伤病',
  'Locker-room and team dynamics': '更衣室与球队动态',
  'Capital, commercial, and political context': '资本、商业与政治环境',
  'Head-to-head and history': '交锋历史',
  'Tactical matchup': '战术与对位',
  'Odds and market signal': '赔率与市场信号',
  'Data quality and uncertainty': '数据质量与不确定性',
  'Fixtures by group': '按小组查看赛程',
  'Predict': '预测',
  'Tournament win probabilities': '赛事夺冠概率',
  'champion probability': '夺冠概率',
  'API access': 'API 接入',
  'Google Gemini': 'Google Gemini',
  'OpenAI ChatGPT': 'OpenAI ChatGPT',
  'DeepSeek': 'DeepSeek',
  'The Odds API': 'The Odds API',
  'API-Football': 'API-Football',
  'Football-Data.org': 'Football-Data.org',
  'Ready': '已配置',
  'Optional': '可选',
  'Test': '测试',
  'Model weights': '模型权重',
  'Analytics only. Not betting advice. 18+ only.': '仅用于足球数据分析，不构成投注建议，仅限 18 岁以上用户。',
}));

const phrases = [
  ['Football analytics and probability research only. Not betting advice. 18+ only.', '仅用于足球数据分析和概率研究。不构成投注建议。仅限 18 岁以上用户。'],
  ['Explore fixtures, odds signals, model outputs, and report-ready analysis. Free users get the core model; advanced data belongs in paid tiers.', '查看赛程、赔率信号、模型输出和可用于报告的分析。免费用户可使用核心模型，深度数据适合后续付费层。'],
  ['18+ only. Analytics and research, not betting advice.', '仅限 18 岁以上用户。仅用于分析和研究，不构成投注建议。'],
  ['Elo + Poisson + fixtures', 'Elo + Poisson + 赛程'],
  ['Odds and handicap analysis', '赔率与让球分析'],
  ['API-backed data refresh', 'API 实时数据刷新'],
  ['Reports and white-label workflows', '报告与白标工作流'],
  ['A focused product path from public demo to paid analytics.', '从公开演示到付费分析的清晰产品路线。'],
  ['Compare national teams and inspect win, draw, scoreline, and confidence outputs without black-box claims.', '比较国家队，并查看胜/平/负、比分和置信度输出，避免黑箱式结论。'],
  ['Use bookmaker odds as the key market signal, then normalize implied probabilities and show the margin.', '将公开赔率作为市场信号，归一化隐含概率并展示水位/边际影响。'],
  ['Prepare Gemini, ChatGPT, DeepSeek, Odds API, API-Football, and Football-Data integrations for deeper tiers.', '为 Gemini、ChatGPT、DeepSeek、Odds API、API-Football 和 Football-Data 等深度数据层预留接口。'],
  ['The public product can stay useful for free users while advanced odds, API-backed data, automation, reports, and business workflows become paid tiers.', '公开版本保持可用，深度赔率、API 数据、自动化、报告和商业工作流可作为后续付费能力。'],
  ['Basic match probabilities', '基础比赛概率'],
  ['Elo and Poisson model output', 'Elo 与 Poisson 模型输出'],
  ['Group fixtures and champion ranking', '小组赛程与冠军排行'],
  ['Limited manual odds analysis', '基础手动赔率分析'],
  ['Advanced odds interpretation', '高级赔率解读'],
  ['European odds and Asian handicap notes', '欧洲赔率与亚洲让球说明'],
  ['Saved prediction history', '保存预测历史'],
  ['Shareable analysis reports', '可分享分析报告'],
  ['API-assisted data refresh', 'API 辅助数据刷新'],
  ['Injury, lineup, H2H, and news modules', '伤病、阵容、交锋和新闻模块'],
  ['Batch match analysis', '批量比赛分析'],
  ['Exportable reports', '可导出报告'],
  ['Custom dashboards', '定制看板'],
  ['White-label report pages', '白标报告页面'],
  ['Private backend deployment', '私有后端部署'],
  ['Commercial support', '商业支持'],
  ['This product should sell football analytics, not betting instructions. Keep 18+ gating, avoid profit guarantees, never imply inside information, and present all outputs as probabilistic research.', '本产品定位为足球数据分析，而不是投注指令。请保留 18+ 限制，避免收益承诺，不暗示内幕信息，并将所有输出呈现为概率研究。'],
  ['Enter decimal odds when available. If no odds are supplied, model APIs still adjust the baseline through qualitative context.', '可输入十进制赔率。即使没有赔率，模型 API 也会通过球队状态、新闻和上下文调整基础概率。'],
  ['No odds supplied yet. Market signal is neutral unless connected odds data is added later.', '尚未提供赔率。除非接入赔率数据，否则市场信号按中性处理。'],
  ['Optional in-play layer. Add current minute, score, red cards, and live odds when a match is running.', '可选赛中层。比赛进行中可加入当前分钟、比分、红牌和实时赔率。'],
  ['MVP 2.0 rule: auto live feed checks configured live-score and market providers every 120 seconds, then recalibrates by minute, scoreline, red-card pressure, team-strength gap, and optional in-play odds. Analytics only, not betting advice.', 'MVP 2.0 规则：自动实时数据每 120 秒检查已配置的比分和市场数据源，并根据分钟、比分、红牌、实力差距和可选实时赔率重新校准。仅用于分析，不构成投注建议。'],
  ['Average adjustment across successful providers:', '成功数据源的平均调整：'],
  ['Connected context providers:', '已连接上下文数据源：'],
  ['The forecast starts from the baseline Elo and Poisson model', '预测从基础 Elo 和 Poisson 模型开始'],
  ['OpenAI ChatGPT context was included in the ensemble.', 'OpenAI ChatGPT 上下文已纳入综合判断。'],
  ['DeepSeek V4 Pro is used as the final synthesis layer when its key is configured.', '配置 DeepSeek V4 Pro 后，它会作为最终综合推理层。'],
  ['Use as football analytics only, not betting advice.', '仅作为足球数据分析使用，不构成投注建议。'],
];

function translateText(text) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return text;
  const exact = exactText.get(trimmed);
  if (exact) return text.replace(trimmed, exact);
  let translated = text;
  for (const [from, to] of phrases) {
    translated = translated.split(from).join(to);
  }
  return translated;
}

function localizeAttributes(root) {
  const attrs = ['placeholder', 'title', 'aria-label', 'value'];
  const elements = root.querySelectorAll('input, textarea, button, a, [title], [aria-label]');
  elements.forEach((element) => {
    attrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      const original = element.getAttribute(attr);
      const translated = translateText(original);
      if (translated !== original) element.setAttribute(attr, translated);
    });
  });
}

function localizeText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const translated = translateText(node.nodeValue);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  });
}

function localizePage() {
  if (!isChinaLocale || typeof document === 'undefined') return;
  document.documentElement.lang = 'zh-CN';
  localizeText(document.body);
  localizeAttributes(document.body);
}

export default function ChineseLocalizer() {
  useEffect(() => {
    if (!isChinaLocale) return undefined;
    localizePage();
    const observer = new MutationObserver(() => localizePage());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
