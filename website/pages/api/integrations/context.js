const GEMINI_MODEL = 'gemini-2.5-flash';
const QWEN_DEFAULT_MODEL = 'qwen3.7-plus';
const SITE_LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE || '';

function isChinaLocale() {
  return /^zh/i.test(SITE_LOCALE);
}

function synthesisLanguageInstruction() {
  return isChinaLocale()
    ? '所有面向用户的最终综合解析必须使用简体中文。不要直接复制英文 provider context；必须把英文材料翻译并归纳为中文。球队名、模型名、API 名、百分比和来源标题可以保留原文。不要输出英文说明句。'
    : 'All user-facing synthesis fields must be written in English.';
}
function cnText(text) {
  const value = publicReasoningText(text || '', 3000);
  if (!isChinaLocale()) return value;
  return value
    .replace(/The forecast starts from the baseline Elo and Poisson model, then adds a live-context ensemble across the connected APIs\.?/gi, '预测先以 Elo 强度和 Poisson 进球分布作为基础，再融合已连接 API 的实时上下文。')
    .replace(/The current successful-provider average adjusts the baseline by/gi, '当前成功返回的数据源对基础概率的平均修正为')
    .replace(/That creates a small contextual lean toward ([^,]+), but not enough to treat the match as one-sided\.?/gi, '这形成了对 $1 的小幅上下文倾向，但不足以把比赛判断为单边。')
    .replace(/That keeps the match in a close range rather than creating a strong one-sided call\.?/gi, '这说明比赛仍处于接近区间，并没有形成强单边判断。')
    .replace(/Dimension review:/gi, '维度解析：')
    .replace(/Player status\/injuries:/gi, '球员状态与伤病：')
    .replace(/Qualitative context:/gi, '定性上下文：')
    .replace(/Locker-room\/team dynamics:/gi, '更衣室与团队动态：')
    .replace(/Capital\/commercial\/political context:/gi, '资本、商业和政治因素：')
    .replace(/Head-to-head\/history:/gi, '交锋历史：')
    .replace(/Tactical matchup:/gi, '战术打法与对位：')
    .replace(/Odds\/market:/gi, '盘口和市场信号：')
    .replace(/No live source returned specific named-player injury evidence for this run\.?/gi, '本场暂未返回具体具名球员伤病证据。')
    .replace(/No live source returned specific capital\/commercial\/political news evidence for this run\.?/gi, '本场暂未返回具体资本、商业或政治新闻证据。')
    .replace(/No live source returned specific H2H score evidence for this run\.?/gi, '本场暂未返回具体交锋比分证据。')
    .replace(/OpenAI Web Research was attempted but did not return usable source-backed evidence/gi, 'OpenAI Web Research 已尝试调用，但没有返回可用的来源证据')
    .replace(/Fixture matched in Football-Data\.org/gi, 'Football-Data.org 匹配到赛程')
    .replace(/Matched H2H market/gi, '匹配到交锋盘口市场')
    .replace(/No-vig probabilities/gi, '去水后概率')
    .replace(/home/gi, '主队')
    .replace(/draw/gi, '平局')
    .replace(/away/gi, '客队')
    .replace(/Status: TIMED/gi, '状态：未开赛')
    .replace(/Score: ---/gi, '比分：暂无')
    .replace(/Teams:/gi, '球队：');
}







































const TEAM_ALIASES = {



















  'south korea': ['korea republic', 'republic of korea', 'korea south'],



















  'czech republic': ['czechia'],



















  'united states': ['usa', 'u.s.a.', 'usmnt'],



















  'england': ['england national team'],



















  'bosnia and herzegovina': ['bosnia-herzegovina', 'bosnia'],



















};







































function buildContextPrompt(homeTeam, awayTeam) {



















  return [



















    'You are part of a football analytics and probability research engine. This is analytics only, not betting advice.',



















    'Return exactly one valid JSON object only. No markdown, no commentary, no code fence.',


















    'JSON keys must be: summary, home_adjustment, away_adjustment, draw_adjustment, confidence_delta.',



















    'home_adjustment, away_adjustment, draw_adjustment are decimal probability deltas between -0.05 and 0.05.',



















    'confidence_delta is between -5 and 5.',









    'Example JSON shape: {"summary":"Short evidence-based match read.","home_adjustment":0.01,"away_adjustment":-0.01,"draw_adjustment":0,"confidence_delta":1}.',



















    'Use public football context: injuries, squad depth, coach style, motivation, travel, venue pressure, market psychology, political/commercial uncertainty, locker-room risk.',



















    'Do not give betting instructions. Do not return all zeros unless there is truly no contextual edge.',



















    'Match: ' + homeTeam + ' vs ' + awayTeam + '.',



















  ].join('\n');



















}







































function clamp(value, min, max) {



















  return Math.min(max, Math.max(min, value));



















}







































function normalizeName(value) {



















  return String(value || '')



















    .toLowerCase()



















    .replace(/&/g, 'and')



















    .replace(/[^a-z0-9]+/g, ' ')



















    .replace(/\s+/g, ' ')



















    .trim();



















}







































function namesMatch(source, target) {



















  const sourceName = normalizeName(source);



















  const targetName = normalizeName(target);



















  if (!sourceName || !targetName) return false;



















  if (sourceName === targetName) return true;



















  if (sourceName.includes(targetName) || targetName.includes(sourceName)) return true;



















  const aliases = TEAM_ALIASES[targetName] || [];



















  return aliases.some((alias) => sourceName === normalizeName(alias) || sourceName.includes(normalizeName(alias)));



















}







































function providerContext(provider, model, summary, home = 0, draw = 0, away = 0, confidence = 0, signal = 'neutral', evidenceItems = []) {



















  return {



















    provider,



















    model,



















    signal,



















    summary,



















    home_adjustment: clamp(Number(home) || 0, -0.05, 0.05),



















    draw_adjustment: clamp(Number(draw) || 0, -0.04, 0.04),



















    away_adjustment: clamp(Number(away) || 0, -0.05, 0.05),



















    confidence_delta: clamp(Number(confidence) || 0, -5, 5),
    evidence_items: Array.isArray(evidenceItems) ? evidenceItems.slice(0, 12) : [],



















  };



















}







































function parseJsonText(output) {






  const raw = typeof output === 'string' ? output : JSON.stringify(output || '');






  const text = raw






    .replace(/\`\`\`json/gi, '')






    .replace(/\`\`\`/g, '')






    .replace(/^\s*json\s*:/i, '')






    .trim();













  try {






    return JSON.parse(text);






  } catch (_) {}













  const first = text.indexOf('{');






  if (first === -1) throw new Error('Model did not return JSON.');













  let depth = 0;






  let inString = false;






  let escaped = false;













  for (let i = first; i < text.length; i += 1) {






    const ch = text[i];













    if (inString) {






      if (escaped) {






        escaped = false;






      } else if (ch === '\\\\') {






        escaped = true;






      } else if (ch === '"') {






        inString = false;






      }






      continue;






    }













    if (ch === '"') {






      inString = true;






    } else if (ch === '{') {






      depth += 1;






    } else if (ch === '}') {






      depth -= 1;






      if (depth === 0) {






        const candidate = text.slice(first, i + 1);






        try {






          return JSON.parse(candidate);






        } catch (error) {






          throw new Error('Model returned malformed JSON: ' + error.message);






        }






      }






    }






  }













  throw new Error('Model did not return complete JSON.');






}













function extractOpenAiMessageText(message) {






  if (!message) return '';






  if (typeof message.content === 'string' && message.content.trim()) return message.content;






  if (Array.isArray(message.content)) {






    return message.content






      .map((part) => {






        if (typeof part === 'string') return part;






        return part?.text || part?.content || '';






      })






      .filter(Boolean)






      .join('\n');






  }






  if (typeof message.reasoning_content === 'string' && message.reasoning_content.trim()) {






    return message.reasoning_content;






  }






  return '';






}













function extractGeminiCandidateText(candidate) {





  const parts = candidate?.content?.parts || [];





  const fromParts = parts





    .map((part) => part.text || part.inlineData?.data || '')





    .filter(Boolean)





    .join('\n');





  if (fromParts.trim()) return fromParts;





  return JSON.stringify(candidate || {});





}











function cleanSynthesisProse(output, homeTeam, awayTeam) {




  let text = String(output || '').replace(/\s+/g, ' ').trim();









  const removeInstructionNoise = (value) => String(value || '')




    .replace(/You are the final reasoning layer[^.]*\./gi, '')




    .replace(/Fuse the provider contexts[^.]*\./gi, '')




    .replace(/provider contexts into one concise explanation[^.]*\./gi, '')




    .replace(/Return valid compact JSON only[^.]*\./gi, '')




    .replace(/Return exactly[^.]*\./gi, '')




    .replace(/compact JSON[^.]*\./gi, '')




    .replace(/JSON object[^.]*\./gi, '')




    .replace(/JSON keys[^.]*\./gi, '')




    .replace(/with keys:?\s*headline[^.]*\./gi, '')




    .replace(/key_factors must[^.]*\./gi, '')




    .replace(/The key_factors[^.]*\./gi, '')




    .replace(/The input is a fusion of provider contexts[^.]*\./gi, '')




    .replace(/Look at the provider contexts:?\s*/gi, '')




    .replace(/Provider contexts:?\s*/gi, '')




    .replace(/^[\s:;,.\-]+/, '')




    .replace(/\s+/g, ' ')




    .trim();









  text = removeInstructionNoise(text);









  const lower = text.toLowerCase();




  const startMarkers = [




    homeTeam.toLowerCase() + ' vs ' + awayTeam.toLowerCase(),




    'gemini',




    'chatgpt',




    'oddsapi',




    'odds api',




    'football-data',




    'the forecast',




    'mexico',




    'south korea',




  ];




  const starts = startMarkers.map((marker) => lower.indexOf(marker)).filter((index) => index >= 0);




  if (starts.length && Math.min(...starts) > 0) {




    text = text.slice(Math.min(...starts)).trim();




  }









  text = removeInstructionNoise(text)




    .replace(/\bhome_adjustment\s*:\s*[-0-9.]+\b/gi, '')




    .replace(/\bdraw_adjustment\s*:\s*[-0-9.]+\b/gi, '')




    .replace(/\baway_adjustment\s*:\s*[-0-9.]+\b/gi, '')




    .replace(/\bconfidence_delta\s*:\s*[-0-9.]+\b/gi, '')




    .replace(/\s+,/g, ',')




    .replace(/\s+/g, ' ')




    .trim();









  if (!text || text.length < 80) {




    text = homeTeam + ' vs ' + awayTeam + ' is interpreted as a close probability forecast. Connected model and market contexts suggest only small adjustments, with venue support, squad depth, injury uncertainty, and neutral political or capital signals treated as limited evidence rather than decisive factors.';




  }









  return text.slice(0, 720);




}









function extractLooseSummary(text) {




  const raw = String(text || '');




  try {




    const parsed = parseJsonText(raw);




    if (parsed?.summary) return String(parsed.summary);




  } catch (_) {}









  const match = raw.match(/["']summary["']\s*:\s*["']([^"']+)/i);




  if (match) {




    return match[1]




      .replace(/\\n/g, ' ')




      .replace(/\\r/g, ' ')




      .replace(/\\t/g, ' ')




      .replace(/\\(["'\\])/g, '$1')




      .replace(/\s+/g, ' ')




      .trim();




  }









  return '';




}









function normalizeModelContext(provider, output, model) {






  const parsed = parseJsonText(output);













  return providerContext(






    provider,






    model,






    parsed.summary || provider + ' context loaded.',






    parsed.home_adjustment,






    parsed.draw_adjustment,






    parsed.away_adjustment,






    parsed.confidence_delta,






    parsed.signal || 'directional'






  );






}













function explainNetworkError(error) {






  const parts = [];






  if (error?.message) parts.push(error.message);






  if (error?.cause?.code) parts.push(error.cause.code);






  if (error?.cause?.message) parts.push(error.cause.message);






  if (error?.code) parts.push(error.code);






  return Array.from(new Set(parts.filter(Boolean))).join(' | ') || String(error);






}













async function fetchText(url, options = {}, timeoutMs = 18000) {






  const controller = new AbortController();






  const timer = setTimeout(() => controller.abort(), timeoutMs);













  try {






    const response = await fetch(url, { ...options, signal: controller.signal });






    const text = await response.text();






    return { response, text };






  } finally {






    clearTimeout(timer);






  }






}













async function getQwenContext(apiKey, homeTeam, awayTeam, model = QWEN_DEFAULT_MODEL) {
  const selectedModel = model || QWEN_DEFAULT_MODEL;
  const cn = isChinaLocale();
  const payload = {
    model: selectedModel,
    messages: [
      {
        role: 'system',
        content: cn
          ? [
              '你是世界杯足球概率研究平台的中文实时上下文模型。',
              '只返回严格 JSON，不要 Markdown。',
              '必须围绕伤病/球员状态、更衣室/团队动态、战术对位、近期状态/阵容深度、资本商业政治新闻、盘口市场、赛程场地压力、数据质量这些维度输出。',
              '没有实时证据就明确写“未返回具体证据”，不要编造。',
              '这是足球分析和赛前/赛中报告，不是投注建议，不承诺收益。',
            ].join(' ')
          : [
              'You are a football analytics context model for a probability research SaaS.',
              'Return valid compact JSON only.',
              'Do not provide betting advice or profit claims.',
              'Use cautious public-evidence language when discussing injuries, lineups, locker-room, political, commercial, or capital context.',
            ].join(' '),
      },
      { role: 'user', content: buildContextPrompt(homeTeam, awayTeam) },
    ],
    temperature: 0.12,
    max_tokens: 1400,
    response_format: { type: 'json_object' },
  };

  try {
    const { response, text } = await fetchText('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(payload),
    }, 60000);
    if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 300));
    const data = JSON.parse(text);
    const output = data?.choices?.[0]?.message?.content || '';
    return normalizeModelContext('qwen', output, selectedModel);
  } catch (error) {
    throw new Error('Qwen ' + selectedModel + ' request failed: ' + explainNetworkError(error));
  }
}



function buildQwenEvidencePrompt(homeTeam, awayTeam, contexts) {
  const contextPacket = contexts.map((item) => ({
    provider: item.provider,
    model: item.model,
    signal: item.signal,
    summary: item.summary,
    home_adjustment: item.home_adjustment,
    draw_adjustment: item.draw_adjustment,
    away_adjustment: item.away_adjustment,
    confidence_delta: item.confidence_delta,
    evidence_items: Array.isArray(item.evidence_items) ? item.evidence_items.slice(0, 10) : [],
  }));

  return [
    '你是世界杯足球概率研究平台的中文证据综合模型。',
    '任务：只基于下面已经由 API、新闻源或模型返回的 provider contexts，整理 ' + homeTeam + ' vs ' + awayTeam + ' 的实时证据摘要，并给出谨慎的概率修正。',
    '必须覆盖：球员状态与伤病、更衣室/团队动态、战术打法与对位、近期状态/阵容深度、资本/商业/政治新闻、盘口市场、赛程/场地/旅行压力、数据质量限制。',
    '如果某个维度没有具体球员、新闻、比分、盘口或来源，请写“未返回具体证据”，严禁编造。',
    '返回严格 JSON，字段：summary, signal, home_adjustment, draw_adjustment, away_adjustment, confidence_delta, evidence_items。',
    'evidence_items 必须是 6 到 10 个对象，每个对象字段：category, source, detail, impact。',
    'category 只能使用：player_status_injury, locker_room_team_dynamics, tactical_matchup, recent_form_squad_depth, capital_commercial_political_news, odds_market, fixture_status, data_quality。',
    'home_adjustment/draw_adjustment/away_adjustment 范围 -0.03 到 0.03；confidence_delta 范围 -3 到 3。',
    '产品定位：足球概率研究和赛前/赛中分析报告，不是投注建议，不承诺收益。',
    'Provider contexts JSON:',
    JSON.stringify(contextPacket).slice(0, 26000),
  ].join('\n');
}

async function getQwenEvidenceSynthesis(apiKey, homeTeam, awayTeam, model = QWEN_DEFAULT_MODEL, contexts = []) {
  const selectedModel = model || QWEN_DEFAULT_MODEL;
  const payload = {
    model: selectedModel,
    messages: [
      {
        role: 'system',
        content: [
          '你是中文足球概率研究证据综合模型。',
          '只能使用用户提供的 provider contexts，不要编造实时事实。',
          '所有面向用户的 summary、detail、impact 必须使用简体中文。',
          '必须返回严格 JSON，不要 Markdown，不要额外解释。',
        ].join(' '),
      },
      { role: 'user', content: buildQwenEvidencePrompt(homeTeam, awayTeam, contexts) },
    ],
    temperature: 0.1,
    max_tokens: 2200,
    response_format: { type: 'json_object' },
  };

  try {
    const { response, text } = await fetchText('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(payload),
    }, 90000);
    if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 300));
    const data = JSON.parse(text);
    const parsed = parseJsonText(data?.choices?.[0]?.message?.content || '');
    const evidenceItems = Array.isArray(parsed.evidence_items)
      ? parsed.evidence_items.map((item) => ({
          category: item.category || 'data_quality',
          source: item.source || 'Qwen evidence synthesis',
          detail: item.detail || '',
          impact: item.impact || '作为实时证据综合输入，谨慎影响概率修正。',
        })).filter((item) => item.detail).slice(0, 10)
      : [];

    return providerContext(
      'qwen',
      selectedModel + '-evidence-synthesis',
      parsed.summary || '千问已基于成功返回的数据源完成中文实时证据综合。',
      parsed.home_adjustment,
      parsed.draw_adjustment,
      parsed.away_adjustment,
      parsed.confidence_delta,
      parsed.signal || 'directional',
      evidenceItems
    );
  } catch (error) {
    throw new Error('Qwen evidence synthesis failed: ' + explainNetworkError(error));
  }
}

async function getGeminiContext(apiKey, homeTeam, awayTeam) {



















  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';



















  const payload = {



















    contents: [{ parts: [{ text: buildContextPrompt(homeTeam, awayTeam) }] }],



















    generationConfig: {

















      maxOutputTokens: 512,

















      temperature: 0.1,

















      responseMimeType: 'application/json',

















    },



















  };







































  try {



















    const { response, text } = await fetchText(url + '?key=' + encodeURIComponent(apiKey), {



















      method: 'POST',



















      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },



















      body: JSON.stringify(payload),



















    });



















    if (!response.ok) {









      if (response.status === 503) {









        return providerContext(









          'gemini',









          GEMINI_MODEL,









          'Gemini reached Google but the model is temporarily overloaded. It is included as a neutral signal for this run.',









          0,









          0,









          0,









          0,









          'neutral'









        );









      }









      throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 300));









    }



















    const data = JSON.parse(text);



















    const output = extractGeminiCandidateText(data?.candidates?.[0]);
















    try {
















      return normalizeModelContext('gemini', output, GEMINI_MODEL);
















    } catch (parseError) {
















      const preview = String(output || text).replace(/\s+/g, ' ').slice(0, 260);





      let summaryOnly = extractLooseSummary(output || text);





      return providerContext(





        'gemini',





        GEMINI_MODEL,





        summaryOnly || ('Gemini is reachable, but returned non-standard context for this fixture. Preview: ' + preview),





        summaryOnly ? 0.006 : 0,





        0,





        summaryOnly ? -0.006 : 0,





        summaryOnly ? 0.4 : 0,





        summaryOnly ? 'directional' : 'neutral'





      );
















    }



















  } catch (error) {



















    throw new Error('Gemini ' + GEMINI_MODEL + ' request failed: ' + explainNetworkError(error));



















  }



















}







































async function getOpenAIContext(apiKey, homeTeam, awayTeam) {



















  const { response, text } = await fetchText('https://api.openai.com/v1/chat/completions', {



















    method: 'POST',



















    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },



















    body: JSON.stringify({



















      model: 'gpt-4o-mini',



















      messages: [



















        { role: 'system', content: 'Return compact JSON only. Football analytics only, not betting advice.' },



















        { role: 'user', content: buildContextPrompt(homeTeam, awayTeam) },



















      ],



















      max_tokens: 1800,









      temperature: 0.1,



















      response_format: { type: 'json_object' },



















    }),



















  });



















  if (!response.ok) throw new Error('OpenAI HTTP ' + response.status + ': ' + text.slice(0, 220));



















  const data = JSON.parse(text);



















  return normalizeModelContext('chatgpt', extractOpenAiMessageText(data?.choices?.[0]?.message), 'gpt-4o-mini');



















}








































function responseOutputText(data) {
  if (typeof data?.output_text === 'string') return data.output_text;
  const parts = [];
  const output = Array.isArray(data?.output) ? data.output : [];
  output.forEach((item) => {
    const content = Array.isArray(item?.content) ? item.content : [];
    content.forEach((part) => {
      if (typeof part?.text === 'string') parts.push(part.text);
      if (typeof part?.content === 'string') parts.push(part.content);
    });
  });
  return parts.join('\n').trim();
}

function normalizeWebEvidenceItem(item, fallbackProvider = 'OpenAI Web Research') {
  return {
    category: item?.category || item?.dimension || 'provider_context',
    source: item?.source || item?.source_title || fallbackProvider,
    detail: [
      item?.detail || item?.finding || item?.summary || '',
      item?.published_date ? 'Published: ' + item.published_date : '',
      item?.source_url ? 'URL: ' + item.source_url : '',
    ].filter(Boolean).join(' | '),
    impact: item?.impact || 'Public web research evidence used as context, not as betting advice.',
  };
}

function buildOpenAIWebResearchPrompt(homeTeam, awayTeam) {
  return [
    'You are a football analytics research assistant for an 18+ analytics-only SaaS. This is not betting advice.',
    'Use web search to gather current, source-backed public information for ' + homeTeam + ' vs ' + awayTeam + '.',
    'Return one compact JSON object only. No markdown.',
    'Required keys: summary, home_adjustment, draw_adjustment, away_adjustment, confidence_delta, evidence_items.',
    'home_adjustment/draw_adjustment/away_adjustment must be decimal probabilities between -0.03 and 0.03. confidence_delta must be between -3 and 3.',
    'evidence_items must be 6 to 10 objects with keys: category, source, detail, source_url, published_date, impact.',
    'Cover these categories when public sources exist: player_status_injury, head_to_head, tactical_matchup, locker_room_team_dynamics, capital_commercial_political_news, venue_travel_pressure.',
    'Use concrete named facts when available: named injuries or absences, recent H2H scores, tactical matchup notes, credible team news, public commercial/political/FIFA/host context.',
    'If no credible source is found for a category, include an evidence item saying no specific public source was found for that category. Do not invent private locker-room information.',
    'Keep source titles and URLs in the evidence items.',
  ].join('\n');
}

async function postOpenAIResponses(apiKey, body, timeoutMs = 30000) {
  const { response, text } = await fetchText('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify(body),
  }, timeoutMs);
  if (!response.ok) throw new Error('OpenAI Responses HTTP ' + response.status + ': ' + text.slice(0, 260));
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error('OpenAI Responses returned non-JSON transport body: ' + text.slice(0, 160));
  }
}

async function getOpenAIWebResearchContext(apiKey, homeTeam, awayTeam) {
  const prompt = buildOpenAIWebResearchPrompt(homeTeam, awayTeam);
  const attempts = [
    {
      model: 'gpt-4.1-mini',
      body: {
        model: 'gpt-4.1-mini',
        input: prompt,
        tools: [{ type: 'web_search' }],
        tool_choice: { type: 'web_search' },
        temperature: 0.2,
        max_output_tokens: 2600,
      },
    },
    {
      model: 'gpt-4o-mini',
      body: {
        model: 'gpt-4o-mini',
        input: prompt,
        tools: [{ type: 'web_search_preview' }],
        tool_choice: { type: 'web_search_preview' },
        temperature: 0.2,
        max_output_tokens: 2600,
      },
    },
  ];

  const errors = [];
  for (const attempt of attempts) {
    try {
      const data = await postOpenAIResponses(apiKey, attempt.body, 35000);
      const outputText = responseOutputText(data);
      const parsed = parseJsonText(outputText);
      const evidenceItems = Array.isArray(parsed.evidence_items)
        ? parsed.evidence_items.map((item) => normalizeWebEvidenceItem(item, 'OpenAI Web Research')).filter((item) => item.detail).slice(0, 12)
        : [];

      if (!evidenceItems.length) {
        evidenceItems.push({
          category: 'data_quality',
          source: 'OpenAI Web Research',
          detail: 'OpenAI web research returned text but no structured evidence_items. Preview: ' + publicProviderSummary(outputText).slice(0, 300),
          impact: 'The web research layer is treated as limited for this run.',
        });
      }

      return providerContext(
        'openaiWebResearch',
        attempt.model + ' + web_search',
        parsed.summary || 'OpenAI Web Research returned public source-backed context for ' + homeTeam + ' vs ' + awayTeam + '.',
        parsed.home_adjustment,
        parsed.draw_adjustment,
        parsed.away_adjustment,
        parsed.confidence_delta,
        evidenceItems.length ? 'directional' : 'neutral',
        evidenceItems
      );
    } catch (error) {
      errors.push(attempt.model + ': ' + explainNetworkError(error));
    }
  }

  return providerContext('openaiWebResearch', 'responses-web-search', 'OpenAI Web Research was attempted but did not return usable source-backed evidence: ' + errors.join(' | '), 0, 0, 0, 0, 'neutral', [{
    category: 'data_quality',
    source: 'OpenAI Web Research',
    detail: 'OpenAI web research failed or was unavailable: ' + errors.join(' | '),
    impact: 'This source-backed web evidence layer was not used for probability movement.',
  }]);
}


async function getDeepSeekContext(apiKey, homeTeam, awayTeam) {



















  const { response, text } = await fetchText('https://api.deepseek.com/chat/completions', {



















    method: 'POST',



















    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },



















    body: JSON.stringify({



















      model: 'deepseek-v4-pro',















      thinking: { type: 'enabled' },















      reasoning_effort: 'high',







      messages: [



















        { role: 'system', content: 'Return compact JSON only. Football analytics only, not betting advice.' },



















        { role: 'user', content: buildContextPrompt(homeTeam, awayTeam) },



















      ],



















      max_tokens: 1800,









      temperature: 0.1,



















    }),



















  });



















  if (!response.ok) throw new Error('DeepSeek HTTP ' + response.status + ': ' + text.slice(0, 220));



















  const data = JSON.parse(text);



















  return normalizeModelContext('deepseek', extractOpenAiMessageText(data?.choices?.[0]?.message), 'deepseek-v4-pro');



















}







































function normalizeOddsMarket(outcomes, homeTeam, awayTeam) {



















  const homeOutcome = outcomes.find((item) => namesMatch(item.name, homeTeam));



















  const awayOutcome = outcomes.find((item) => namesMatch(item.name, awayTeam));



















  const drawOutcome = outcomes.find((item) => normalizeName(item.name) === 'draw');



















  if (!homeOutcome || !awayOutcome || !drawOutcome) return null;







































  const raw = {



















    home: 1 / Number(homeOutcome.price),



















    draw: 1 / Number(drawOutcome.price),



















    away: 1 / Number(awayOutcome.price),



















  };



















  const total = raw.home + raw.draw + raw.away;



















  if (!Number.isFinite(total) || total <= 0) return null;



















  return { home: raw.home / total, draw: raw.draw / total, away: raw.away / total };



















}







































function oddsToContext(prob, homeTeam, awayTeam) {



















  const homeEdge = (prob.home - 1 / 3) * 0.18;



















  const drawEdge = (prob.draw - 1 / 3) * 0.14;



















  const awayEdge = (prob.away - 1 / 3) * 0.18;



















  return providerContext(



















    'oddsApi',



















    'h2h-market',



















    'The Odds API returned a matching H2H market for ' + homeTeam + ' vs ' + awayTeam + '. No-vig market probabilities: home ' + Math.round(prob.home * 10000) / 100 + '%, draw ' + Math.round(prob.draw * 10000) / 100 + '%, away ' + Math.round(prob.away * 10000) / 100 + '%.',



















    homeEdge,



















    drawEdge,



















    awayEdge,



















    1.5,



















    'directional',
    [{
      category: 'odds_market',
      source: 'The Odds API',
      detail: 'Matched H2H market. No-vig probabilities: home ' + Math.round(prob.home * 10000) / 100 + '%, draw ' + Math.round(prob.draw * 10000) / 100 + '%, away ' + Math.round(prob.away * 10000) / 100 + '%.',
      impact: 'Market signal included in the probability adjustment.',
    }]
  );



















}







































function buildFallbackSynthesis(homeTeam, awayTeam, contexts, synthesisError = null) {








  const providers = contexts.map((item) => item.provider + (item.model ? ' / ' + item.model : '')).join(', ');








  const directional = contexts.filter((item) => item.signal !== 'neutral');








  const neutral = contexts.filter((item) => item.signal === 'neutral');








  const avg = contexts.reduce((acc, item) => ({








    home: acc.home + (Number(item.home_adjustment) || 0),








    draw: acc.draw + (Number(item.draw_adjustment) || 0),








    away: acc.away + (Number(item.away_adjustment) || 0),








  }), { home: 0, draw: 0, away: 0 });








  const count = Math.max(1, contexts.length);








  const homeEdge = Math.round((avg.home / count) * 10000) / 100;








  const drawEdge = Math.round((avg.draw / count) * 10000) / 100;








  const awayEdge = Math.round((avg.away / count) * 10000) / 100;

















  return {








    provider: 'system',








    model: synthesisError ? 'fallback-rationale-after-deepseek-timeout' : 'provider-context-summary',








    role: 'final-synthesis-fallback',








    headline: homeTeam + ' vs ' + awayTeam + ' probability rationale',








    probability_rationale: 'The forecast blends baseline Elo and Poisson output with connected provider context. Successful providers were: ' + providers + '. Average context adjustment is Home ' + homeEdge + '%, Draw ' + drawEdge + '%, Away ' + awayEdge + '%. This is analytics only, not betting advice.',








    key_factors: [








      {








        factor: 'Player availability and injuries',








        read: 'Live injury and squad signals are considered when supplied by model or football-data providers; otherwise this factor remains limited.',








        impact: neutral.length ? 'Limited live confirmation' : 'Context-dependent',








      },








      {








        factor: 'Locker-room and team dynamics',








        read: 'Qualitative model context is used to detect motivation, stability, and squad-depth signals without claiming insider information.',








        impact: directional.length ? 'Included in qualitative adjustment' : 'No strong signal',








      },








      {








        factor: 'Odds and market signal',








        read: 'Bookmaker odds are converted into implied probabilities when a matching market is available, then treated as one ensemble signal.',








        impact: contexts.some((item) => item.provider === 'oddsApi') ? 'Market signal included' : 'No matching odds market',








      },








      {








        factor: 'Political, commercial, and capital context',








        read: 'The model only treats this as meaningful when providers return evidence-tagged uncertainty; otherwise it remains neutral.',








        impact: 'Neutral unless evidence-backed',








      },








      {








        factor: 'Data quality and uncertainty',








        read: synthesisError ? 'DeepSeek V4 Pro synthesis did not return a usable final explanation: ' + synthesisError : 'Provider context was available for the explanation layer.',








        impact: synthesisError ? 'Fallback rationale shown' : 'Explanation available',








      },








    ],








    uncertainty_notes: synthesisError ? 'DeepSeek V4 Pro final synthesis failed, so this fallback summarizes the successful provider contexts. Reason: ' + synthesisError : 'Live data availability varies by provider and fixture.',








    data_basis: 'Elo, Poisson, connected API context, odds market signal when matched, and football data signals when available.',








  };








}

















function formatPct(value) {

  const number = Math.round((Number(value) || 0) * 10000) / 100;

  return (number > 0 ? '+' : '') + number + '%';

}



function getProviderContext(contexts, provider) {

  return contexts.find((item) => item.provider === provider) || null;

}



function stripSourceReferences(text) {
  return String(text || '')
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, '$1')
    .replace(/\(([a-z0-9.-]+\.[a-z]{2,})(?:\/[^)]*)?\)\(https?:\/\/[^)]+\)/gi, '')
    .replace(/https?:\/\/[^\s)]+/gi, '')
    .replace(/\bURL:\s*[^\s]+/gi, '')
    .replace(/\bPublished:\s*\d{4}-\d{2}-\d{2}\b/gi, '')
    .replace(/\bSeen:\s*\d{8,14}\b/gi, '')
    .replace(/\(([a-z0-9.-]+\.[a-z]{2,})(?:\/[^)]*)?\)/gi, '')
    .replace(/\s+\|\s+/g, ' | ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\(\s*\)/g, '')
    .trim();
}

function publicReasoningText(text, maxLength = 8000) {
  const cleaned = stripSourceReferences(text);
  return maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

function sanitizeSynthesisForDisplay(synthesis) {
  if (!synthesis || typeof synthesis !== 'object') return synthesis;

  return {
    ...synthesis,
    probability_rationale: publicReasoningText(synthesis.probability_rationale, 12000),
    uncertainty_notes: publicReasoningText(synthesis.uncertainty_notes, 2400),
    data_basis: publicReasoningText(synthesis.data_basis, 3000),
    key_factors: Array.isArray(synthesis.key_factors)
      ? synthesis.key_factors.map((item) => ({
        ...item,
        read: publicReasoningText(item.read, 1600),
        impact: publicReasoningText(item.impact, 1000),
      }))
      : synthesis.key_factors,
  };
}

function publicProviderSummary(summary) {

  let text = String(summary || '').replace(/\s+/g, ' ').trim();

  text = text

    .replace(/\bfetch failed\b/gi, 'data request unavailable')

    .replace(/\bUND_ERR_[A-Z_]+\b/g, 'provider connection unavailable')

    .replace(/\bECONNRESET\b|\bETIMEDOUT\b|\bEAI_AGAIN\b|\bENOTFOUND\b/gi, 'provider connection unavailable')

    .replace(/Connect Timeout Error[^.]*\.?/gi, 'provider data was unavailable for this run.')

    .replace(/attempted address:[^)\.]+\)?/gi, '')

    .replace(/api\.[a-z0-9.-]+:\d+/gi, 'the provider endpoint')

    .replace(/timeout:?\s*\d+ms/gi, '')

    .replace(/\s+\|\s+/g, ' ')

    .replace(/\s+/g, ' ')

    .trim();



  if (/fixture lookup failed/i.test(text)) {

    text = 'Football-data fixture confirmation was unavailable for this run, so that source is treated as neutral.';

  }



  return text;

}



function collectEvidenceItems(contexts) {
  const direct = contexts.flatMap((item) => Array.isArray(item.evidence_items)
    ? item.evidence_items.map((evidence) => ({
      provider: item.provider,
      model: item.model,
      category: evidence.category || 'general',
      source: evidence.source || item.provider,
      detail: publicProviderSummary(evidence.detail || item.summary || ''),
      impact: evidence.impact || 'Context evidence used as an ensemble input.',
    }))
    : []);

  if (direct.length) return direct.slice(0, 24);

  return contexts.map((item) => ({
    provider: item.provider,
    model: item.model,
    category: item.provider === 'oddsApi' ? 'odds_market' : 'provider_context',
    source: item.provider,
    detail: publicProviderSummary(item.summary || ''),
    impact: item.signal === 'directional' ? 'Directional provider context.' : 'Neutral provider context.',
  })).filter((item) => item.detail).slice(0, 16);
}

function evidenceFor(evidenceItems, category) {
  return evidenceItems.filter((item) => item.category === category);
}

function firstEvidenceText(evidenceItems, categories, fallback) {
  const item = evidenceItems.find((entry) => categories.includes(entry.category));
  return item ? item.detail : fallback;
}

function providerAuditText(contexts) {

  const connected = contexts.map((item) => item.provider + (item.model ? ' / ' + item.model : ''));

  const hasChatGpt = contexts.some((item) => item.provider === 'chatgpt');
  const hasOpenAIWeb = contexts.some((item) => item.provider === 'openaiWebResearch');

  return [

    connected.length ? 'Connected context providers: ' + connected.join(', ') + '.' : 'No live context provider returned a usable signal.',

    hasChatGpt ? 'OpenAI ChatGPT context was included in the ensemble.' : 'OpenAI ChatGPT was not part of the successful context set for this run.',
    hasOpenAIWeb ? 'OpenAI Web Research provided source-backed evidence items.' : 'OpenAI Web Research did not return source-backed evidence for this run.',

    'DeepSeek V4 Pro is used as the final synthesis layer when its key is configured.',

  ].join(' ');

}



function strongestProviderRead(contexts) {

  const ordered = ['openaiWebResearch', 'gemini', 'chatgpt', 'oddsApi', 'sportmonks', 'footballData', 'apiFootball', 'gdeltNews'];

  for (const provider of ordered) {

    const item = getProviderContext(contexts, provider);

    const summary = publicProviderSummary(item?.summary);

    if (summary) return summary;

  }

  const fallback = contexts.find((item) => item?.summary)?.summary || '';

  return publicProviderSummary(fallback);

}



function buildChineseReasoningSummary(homeTeam, awayTeam, contexts, parsed = {}) {
  const count = Math.max(1, contexts.length);
  const totals = contexts.reduce((acc, item) => ({
    home: acc.home + (Number(item.home_adjustment) || 0),
    draw: acc.draw + (Number(item.draw_adjustment) || 0),
    away: acc.away + (Number(item.away_adjustment) || 0),
    confidence: acc.confidence + (Number(item.confidence_delta) || 0),
  }), { home: 0, draw: 0, away: 0, confidence: 0 });

  const avg = {
    home: totals.home / count,
    draw: totals.draw / count,
    away: totals.away / count,
    confidence: totals.confidence / count,
  };

  const qwen = getProviderContext(contexts, 'qwen');
  const gemini = getProviderContext(contexts, 'gemini');
  const chatgpt = getProviderContext(contexts, 'chatgpt');
  const openaiWeb = getProviderContext(contexts, 'openaiWebResearch');
  const odds = getProviderContext(contexts, 'oddsApi');
  const footballData = getProviderContext(contexts, 'footballData') || getProviderContext(contexts, 'apiFootball');

  const qwenRead = publicProviderSummary(qwen?.summary);
  const geminiRead = publicProviderSummary(gemini?.summary);
  const chatgptRead = publicProviderSummary(chatgpt?.summary);
  const openaiWebRead = publicProviderSummary(openaiWeb?.summary);
  const oddsRead = publicProviderSummary(odds?.summary) || '没有匹配到强盘口信号，市场层保持接近中性。';
  const dataRead = publicProviderSummary(footballData?.summary) || '赛程和历史数据确认有限，数据层不额外制造强倾向。';
  const qualitativeRead = [qwenRead, openaiWebRead, geminiRead, chatgptRead].filter(Boolean).join(' ') || strongestProviderRead(contexts) || '定性模型上下文有限，因此球队新闻、更衣室因素和临场状态按谨慎中性处理。';

  const evidenceItems = collectEvidenceItems(contexts);
  const injuryEvidence = firstEvidenceText(evidenceItems, ['player_status_injury'], '本场暂未返回具体具名球员伤病证据。');
  const h2hEvidence = firstEvidenceText(evidenceItems, ['head_to_head', 'fixture_status'], '本场暂未返回具体交锋比分或历史对战证据。');
  const newsEvidence = firstEvidenceText(evidenceItems, ['capital_commercial_political_news'], '本场暂未返回具体资本、商业或政治新闻证据。');
  const oddsEvidence = firstEvidenceText(evidenceItems, ['odds_market'], oddsRead);
  const tacticalEvidence = firstEvidenceText(evidenceItems, ['tactical_matchup'], '') || qwenRead || openaiWebRead || chatgptRead || geminiRead || '本场暂未返回具体战术对位证据。';

  const lean = avg.home > 0.004 ? homeTeam : avg.away > 0.004 ? awayTeam : '均衡';
  const connected = contexts.map((item) => item.provider + (item.model ? ' / ' + item.model : '')).join(', ');

  const dimensionSummary = [
    '球员状态与伤病：' + injuryEvidence + ' 定性上下文：' + qualitativeRead,
    '更衣室与团队动态：士气、阵容稳定性、教练压力、核心球员领导力和内部波动只在供应商证据支持时计入，否则保持谨慎。',
    '资本、商业和政治因素：' + newsEvidence,
    '交锋历史：' + h2hEvidence,
    '战术打法与对位：' + tacticalEvidence,
    '盘口和市场信号：' + oddsEvidence,
    '赛程/场地/旅行压力：' + dataRead,
  ].join(' ');

  const rationale = [
    connected ? '已接入并成功返回的上下文来源包括：' + connected + '。' : '本次没有实时上下文来源返回可用信号。',
    '模型先以 Elo 强度和 Poisson 进球分布作为基础概率，再融合已连接 API 的实时上下文。',
    '当前成功供应商的平均修正为：主队 ' + formatPct(avg.home) + '，平局 ' + formatPct(avg.draw) + '，客队 ' + formatPct(avg.away) + '。',
    lean === '均衡'
      ? '这说明模型没有得到足够证据把比赛推向单边判断，整体仍属于接近区间。'
      : '这给 ' + lean + ' 带来小幅上下文倾向，但幅度不足以说明比赛已经单边化。',
    '维度解析：' + dimensionSummary,
    '结论仅用于足球概率研究和赛前/赛中报告，不是投注建议，也不承诺收益。',
  ].join(' ');

  return {
    headline: parsed.headline && !/^final probability rationale$/i.test(parsed.headline)
      ? parsed.headline
      : homeTeam + ' vs ' + awayTeam + ' 概率推理总结',
    probability_rationale: cnText(rationale),
    key_factors: [
      {
        factor: 'API 来源审计',
        read: cnText(connected ? '成功接入：' + connected + '。DeepSeek V4 Pro 作为最终综合层。' : '没有实时上下文来源返回可用信号。'),
        impact: '确认哪些来源参与了本次集成判断。',
      },
      {
        factor: '基础强度模型',
        read: 'Elo 和 Poisson 先生成基础胜平负概率，再由实时上下文进行小幅修正。',
        impact: '决定主胜、平局、客胜的基础分布。',
      },
      {
        factor: '球员状态与伤病',
        read: cnText(injuryEvidence),
        impact: injuryEvidence.includes('暂未') ? '暂无具名球员证据，保持谨慎。' : '已纳入具名球员状态证据。',
      },
      {
        factor: '更衣室与团队动态',
        read: cnText(qualitativeRead),
        impact: '作为软信号参与修正，但不会被当作内幕消息。',
      },
      {
        factor: '资本、商业和政治因素',
        read: cnText(newsEvidence),
        impact: newsEvidence.includes('暂未') ? '无具体新闻证据时保持中性。' : '具体新闻证据进入风险/动机评估。',
      },
      {
        factor: '交锋历史',
        read: cnText(h2hEvidence),
        impact: h2hEvidence.includes('暂未') ? '无具体交锋证据时不强行加权。' : '已纳入具体交锋或赛程证据。',
      },
      {
        factor: '战术打法与对位优势',
        read: cnText(tacticalEvidence),
        impact: tacticalEvidence.includes('暂未') ? '战术证据不足时谨慎处理。' : '战术/对位信息已进入定性修正。',
      },
      {
        factor: '盘口和市场信号',
        read: cnText(oddsEvidence),
        impact: odds ? '市场信号作为集成输入之一。' : '没有匹配盘口时保持中性。',
      },
      {
        factor: '场地、旅行和压力',
        read: cnText(dataRead),
        impact: Math.abs(avg.home) > 0.003 || Math.abs(avg.away) > 0.003 ? '形成小幅上下文修正。' : '整体接近中性。',
      },
      {
        factor: '数据质量与不确定性',
        read: '如果供应商超时、无权限或数据不完整，系统会把它处理为可见的不确定性，而不是隐藏提高置信度。',
        impact: '让预测更保守、更透明。',
      },
    ].slice(0, 10),
    uncertainty_notes: '实时 API 覆盖会因比赛、地区和供应商权限变化。本产品仅用于足球分析和概率研究，不构成投注建议。',
    evidence_items: evidenceItems,
    data_basis: publicReasoningText('数据依据：Elo/Poisson 基础模型、已连接 API 的平均上下文修正、可匹配盘口信号、Football-Data 赛程状态、Sportmonks/API-Football 可用时的球员和交锋证据，以及 Qwen 对已返回实时证据的中文综合整理。未返回来源的伤病、更衣室或资本政治信息不会被编造。', 3000),
  };
}


function buildReasoningSummary(homeTeam, awayTeam, contexts, parsed = {}) {
  if (isChinaLocale()) return buildChineseReasoningSummary(homeTeam, awayTeam, contexts, parsed);
  if (isChinaLocale()) return buildChineseReasoningSummary(homeTeam, awayTeam, contexts, parsed);

  const count = Math.max(1, contexts.length);

  const totals = contexts.reduce((acc, item) => ({

    home: acc.home + (Number(item.home_adjustment) || 0),

    draw: acc.draw + (Number(item.draw_adjustment) || 0),

    away: acc.away + (Number(item.away_adjustment) || 0),

    confidence: acc.confidence + (Number(item.confidence_delta) || 0),

  }), { home: 0, draw: 0, away: 0, confidence: 0 });



  const avg = {

    home: totals.home / count,

    draw: totals.draw / count,

    away: totals.away / count,

    confidence: totals.confidence / count,

  };



  const qwen = getProviderContext(contexts, 'qwen');
  const gemini = getProviderContext(contexts, 'gemini');

  const chatgpt = getProviderContext(contexts, 'chatgpt');
  const openaiWeb = getProviderContext(contexts, 'openaiWebResearch');

  const odds = getProviderContext(contexts, 'oddsApi');

  const footballData = getProviderContext(contexts, 'footballData') || getProviderContext(contexts, 'apiFootball');



  const qwenRead = publicProviderSummary(qwen?.summary);
  const geminiRead = publicProviderSummary(gemini?.summary);

  const chatgptRead = publicProviderSummary(chatgpt?.summary);
  const openaiWebRead = publicProviderSummary(openaiWeb?.summary);

  const oddsRead = publicProviderSummary(odds?.summary) || 'No strong bookmaker market edge was available, so the market layer stays close to neutral.';

  const dataRead = publicProviderSummary(footballData?.summary) || 'Fixture and historical-data confirmation is limited, so the data layer does not add a decisive edge.';

  const qualitativeRead = [qwenRead, openaiWebRead, geminiRead, chatgptRead].filter(Boolean).join(' ') || strongestProviderRead(contexts) || 'Qualitative model context is limited, so team-news and locker-room factors are treated cautiously.';
  const evidenceItems = collectEvidenceItems(contexts);
  const injuryEvidence = firstEvidenceText(evidenceItems, ['player_status_injury'], 'No live source returned specific named-player injury evidence for this run.');
  const h2hEvidence = firstEvidenceText(evidenceItems, ['head_to_head', 'fixture_status'], 'No live source returned specific H2H score evidence for this run.');
  const newsEvidence = firstEvidenceText(evidenceItems, ['capital_commercial_political_news'], 'No live source returned specific capital/commercial/political news evidence for this run.');
  const oddsEvidence = firstEvidenceText(evidenceItems, ['odds_market'], oddsRead);
  const tacticalEvidence = firstEvidenceText(evidenceItems, ['tactical_matchup'], '') || qwenRead || openaiWebRead || chatgptRead || geminiRead || 'No connected source returned a specific tactical matchup note for this run.';



  const lean = avg.home > 0.004

    ? homeTeam

    : avg.away > 0.004

      ? awayTeam

      : 'balanced';



  const dimensionSummary = [

    'Player status/injuries: ' + injuryEvidence + ' Qualitative context: ' + qualitativeRead,

    'Locker-room/team dynamics: motivation, squad stability, coach pressure, and dressing-room risk are treated as soft signals unless provider context gives stronger evidence.',

    'Capital/commercial/political context: ' + newsEvidence,

    'Head-to-head/history: ' + h2hEvidence,

    'Tactical matchup: ' + tacticalEvidence,

    'Odds/market: ' + oddsEvidence,

  ].join(' ');



  const rationale = [

    providerAuditText(contexts),

    'The forecast starts from the baseline Elo and Poisson model, then adds a live-context ensemble across the connected APIs.',

    'The current successful-provider average adjusts the baseline by Home ' + formatPct(avg.home) + ', Draw ' + formatPct(avg.draw) + ', Away ' + formatPct(avg.away) + '.',

    lean === 'balanced'

      ? 'That keeps the match in a close range rather than creating a strong one-sided call.'

      : 'That creates a small contextual lean toward ' + lean + ', but not enough to treat the match as one-sided.',

    'Dimension review: ' + dimensionSummary,

  ].join(' ');



  return {

    headline: parsed.headline && !/^final probability rationale$/i.test(parsed.headline)

      ? parsed.headline

      : homeTeam + ' vs ' + awayTeam + ' probability reasoning summary',

    probability_rationale: cnText(rationale),

    key_factors: [

      {

        factor: 'API provider audit',

        read: publicReasoningText(providerAuditText(contexts), 1600),

        impact: 'Confirms which sources fed the ensemble and that DeepSeek V4 Pro is the final synthesis layer.',

      },

      {

        factor: 'Baseline strength model',

        read: 'Elo and Poisson provide the starting probability shape before live context is added.',

        impact: 'Sets the base home/draw/away distribution.',

      },

      {

        factor: 'Player status and injuries',

        read: cnText(injuryEvidence),
        impact: injuryEvidence.includes('No live source') ? 'Specific player-status evidence unavailable' : 'Named player-status evidence included',

      },

      {

        factor: 'Locker-room and team dynamics',

        read: 'Motivation, squad stability, coach pressure, leadership continuity, and dressing-room risk are treated as soft signals unless providers return stronger evidence.',

        impact: qualitativeRead ? 'Soft qualitative adjustment' : 'Neutral without evidence',

      },

      {

        factor: 'Capital, commercial, and political context',

        read: cnText(newsEvidence),
        impact: newsEvidence.includes('No live source') ? 'Neutral without specific news evidence' : 'Specific news evidence listed for review',

      },

      {

        factor: 'Head-to-head and historical pattern',

        read: cnText(h2hEvidence),
        impact: h2hEvidence.includes('No live source') ? 'Specific H2H evidence unavailable' : 'Specific fixture/H2H evidence included',

      },

      {

        factor: 'Tactical style and matchup advantages',

        read: cnText(tacticalEvidence),
        impact: tacticalEvidence.includes('No connected source') ? 'Specific tactical evidence unavailable' : 'Tactical source context included',

      },

      {

        factor: 'Odds and market signal',

        read: cnText(oddsEvidence),
        impact: odds ? 'Market signal included as one ensemble input' : 'Neutral without a matching market',

      },

      {

        factor: 'Venue, travel, and pressure',

        read: publicReasoningText(strongestProviderRead(contexts), 900) || 'Venue support, travel load, climate, crowd pressure, and schedule pressure are applied only when the live context indicates a measurable edge.',

        impact: Math.abs(avg.home) > 0.003 || Math.abs(avg.away) > 0.003 ? 'Small contextual adjustment' : 'Mostly neutral',

      },

      {

        factor: 'Data quality and uncertainty',

        read: 'Provider outages or incomplete fixture data are converted into neutral availability limits instead of hidden confidence.',

        impact: 'Keeps the forecast conservative',

      },

    ].slice(0, 10),

    uncertainty_notes: 'Live API coverage can vary by fixture. This is football analytics and probability research only, not betting advice.',

    evidence_items: evidenceItems,
    data_basis: publicReasoningText(providerAuditText(contexts) + ' Data basis: Elo and Poisson baseline, averaged live provider context, odds market signal when matched, Football-Data fixture status, Sportmonks/API-Football H2H and player-status evidence when available, OpenAI Web Research source-backed public evidence, and GDELT public news evidence when available.', 3000),

  };

}



function forceChineseSynthesis(homeTeam, awayTeam, contexts, currentSynthesis = null) {
  const chinese = buildChineseReasoningSummary(homeTeam, awayTeam, contexts, currentSynthesis || {});
  return sanitizeSynthesisForDisplay({
    provider: currentSynthesis?.provider || 'system',
    model: currentSynthesis?.model === 'deepseek-v4-pro' ? 'deepseek-v4-pro-cn' : 'cn-localized-synthesis',
    role: 'final-synthesis',
    headline: chinese.headline,
    probability_rationale: chinese.probability_rationale,
    key_factors: chinese.key_factors,
    uncertainty_notes: chinese.uncertainty_notes,
    evidence_items: Array.isArray(currentSynthesis?.evidence_items) && currentSynthesis.evidence_items.length
      ? currentSynthesis.evidence_items
      : chinese.evidence_items,
    data_basis: chinese.data_basis,
  });
}

function isGenericSynthesis(parsed) {

  const rationale = String(parsed?.probability_rationale || '');

  const headline = String(parsed?.headline || '');

  const factors = Array.isArray(parsed?.key_factors) ? parsed.key_factors : [];



  if (rationale.length < 360) return true;

  if (/baseline model output with connected provider context/i.test(rationale)) return true;

  if (/^final probability rationale$/i.test(headline)) return true;

  if (factors.length < 8) return true;

  return false;

}



async function getDeepSeekSynthesis(apiKey, homeTeam, awayTeam, contexts) {






  if (!apiKey || !Array.isArray(contexts) || contexts.length === 0) return null;













  const evidence = contexts.map((item) => ({






    provider: item.provider,






    model: item.model,






    signal: item.signal,






    summary: publicReasoningText(item.summary || '', 1400),






    home_adjustment: item.home_adjustment,






    draw_adjustment: item.draw_adjustment,






    away_adjustment: item.away_adjustment,






    confidence_delta: item.confidence_delta,






  }));













  const synthesisPrompt = [






    'You are the final reasoning layer for a football analytics / probability research SaaS. Analytics only, not betting advice.',






    'Fuse the provider contexts into one complete but readable explanation for a match probability forecast.',






    'Consider player availability and injuries, form and squad depth, locker-room/team dynamics, tactical matchup, travel/venue pressure, odds and market signal, political/commercial/capital uncertainty, and data-quality limitations.',






    'Do not invent insider information. If a factor is uncertain or unavailable, say it is limited or neutral.',






    synthesisLanguageInstruction(),
    synthesisLanguageInstruction(),
    isChinaLocale() ? '返回一个有效 JSON 对象。probability_rationale 必须用简体中文完整解释具体证据如何影响概率，不要复制 provider 原文，不要输出英文长段。' : 'Return exactly one valid JSON object only. Never mention JSON, keys, schema, prompt, or provider-context instructions inside the values. The probability_rationale value can be 900 to 1600 words when evidence is rich; do not truncate the reasoning.',






    'Use user-facing football analysis in the values: injuries, squad depth, team dynamics, odds signal, venue/travel, political or capital uncertainty, and data quality.',
    isChinaLocale() ? 'For Chinese locale, translate and summarize all provider evidence into Chinese. Do not paste English provider sentences into probability_rationale, key_factors, uncertainty_notes, or data_basis.' : '',
    isChinaLocale() ? 'For Chinese locale, translate and summarize all provider evidence into Chinese. Do not paste English provider sentences into probability_rationale, key_factors, uncertainty_notes, or data_basis.' : '',






    'Match: ' + homeTeam + ' vs ' + awayTeam + '.',






    'Provider contexts: ' + JSON.stringify(evidence),






  ].join('\n');













  const { response, text } = await fetchText('https://api.deepseek.com/chat/completions', {






    method: 'POST',






    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },






    body: JSON.stringify({






      model: 'deepseek-v4-pro',






      thinking: { type: 'enabled' },






      reasoning_effort: 'high',






      messages: [






        { role: 'system', content: 'Return valid compact JSON only. This is analytics only, not betting advice. ' + synthesisLanguageInstruction() },






        { role: 'user', content: synthesisPrompt },






      ],






      max_tokens: 1800,






      temperature: 0.1,






      response_format: { type: 'json_object' },






    }),






  }, 75000);













  if (!response.ok) throw new Error('DeepSeek synthesis HTTP ' + response.status + ': ' + text.slice(0, 260));













  const data = JSON.parse(text);






  const output = extractOpenAiMessageText(data?.choices?.[0]?.message);













  let parsed;






  try {






    parsed = parseJsonText(output);






  } catch (error) {






    const plain = cleanSynthesisProse(output, homeTeam, awayTeam);





    if (!plain) throw error;






    parsed = {






      headline: isChinaLocale() ? homeTeam + ' vs ' + awayTeam + ' 最终概率解析' : homeTeam + ' vs ' + awayTeam + ' final probability rationale',






      probability_rationale: plain,






      key_factors: [






        {






          factor: isChinaLocale() ? 'DeepSeek V4 Pro 最终综合' : 'DeepSeek V4 Pro synthesis',






          read: plain.slice(0, 220),






          impact: isChinaLocale() ? '最终推理模型返回了可用文本但不是严格 JSON，系统已规范化并保留展示。' : 'The final reasoning model returned prose instead of strict JSON; the prose was normalized and kept visible.',






        },






        {






          factor: isChinaLocale() ? '数据质量与不确定性' : 'Data quality and uncertainty',






          read: isChinaLocale() ? '该解析基于已成功返回的供应商上下文，不声称拥有内幕信息。' : 'The explanation is based on successful provider contexts and does not claim insider information.',






          impact: isChinaLocale() ? '仅用于足球数据分析，不构成投注建议。' : 'Use as football analytics only, not betting advice.',






        },






      ],






      uncertainty_notes: isChinaLocale() ? 'DeepSeek V4 Pro 返回了可用文本但不是严格 JSON，已规范化用于展示。' : 'DeepSeek V4 Pro response was usable prose but not strict JSON, so it was normalized for display.',






      data_basis: isChinaLocale() ? '已连接的数据上下文加 DeepSeek V4 Pro 最终综合。' : 'Connected provider context plus DeepSeek V4 Pro final synthesis.',






    };






  }













  const enriched = isGenericSynthesis(parsed) ? buildReasoningSummary(homeTeam, awayTeam, contexts, parsed) : parsed;







  return sanitizeSynthesisForDisplay({



    provider: 'deepseek',



    model: 'deepseek-v4-pro',



    role: 'final-synthesis',



    headline: enriched.headline || homeTeam + ' vs ' + awayTeam + ' probability reasoning summary',



    probability_rationale: cnText(enriched.probability_rationale || buildReasoningSummary(homeTeam, awayTeam, contexts, enriched).probability_rationale),



    key_factors: Array.isArray(enriched.key_factors) ? enriched.key_factors.slice(0, 10) : buildReasoningSummary(homeTeam, awayTeam, contexts, enriched).key_factors,



    uncertainty_notes: cnText(enriched.uncertainty_notes || (isChinaLocale() ? '实时 API 覆盖会因比赛和供应商权限变化。本产品仅用于足球分析和概率研究，不构成投注建议。' : 'Live API coverage can vary by fixture. This is football analytics and probability research only, not betting advice.')),



    evidence_items: Array.isArray(enriched.evidence_items) ? enriched.evidence_items.slice(0, 24) : collectEvidenceItems(contexts),
    data_basis: cnText(enriched.data_basis || (isChinaLocale() ? 'Elo 和 Poisson 基础模型、实时上下文平均修正、匹配盘口信号以及可用的数据源证据。' : 'Elo and Poisson baseline, averaged live provider context, odds market signal when matched, and connected evidence sources when available.')),



  });






}













async function getOddsApiContext(apiKey, homeTeam, awayTeam) {



















  const sportKeys = ['soccer_fifa_world_cup', 'soccer_fifa_world_cup_winner'];



















  const errors = [];







































  for (const sport of sportKeys) {



















    try {



















      const url = 'https://api.the-odds-api.com/v4/sports/' + sport + '/odds?apiKey=' + encodeURIComponent(apiKey) + '&regions=us,uk,eu,au&markets=h2h&oddsFormat=decimal';



















      const { response, text } = await fetchText(url, {}, 15000);



















      if (!response.ok) {



















        errors.push('HTTP ' + response.status + ': ' + text.slice(0, 160));



















        continue;



















      }



















      const events = JSON.parse(text);



















      if (!Array.isArray(events)) continue;



















      for (const event of events) {



















        const eventHasHome = namesMatch(event.home_team, homeTeam) || namesMatch(event.away_team, homeTeam);



















        const eventHasAway = namesMatch(event.home_team, awayTeam) || namesMatch(event.away_team, awayTeam);



















        if (!eventHasHome || !eventHasAway) continue;



















        const markets = (event.bookmakers || []).flatMap((book) => book.markets || []).filter((market) => market.key === 'h2h');



















        const probs = markets.map((market) => normalizeOddsMarket(market.outcomes || [], homeTeam, awayTeam)).filter(Boolean);



















        if (!probs.length) continue;



















        const avg = probs.reduce((acc, item) => ({



















          home: acc.home + item.home,



















          draw: acc.draw + item.draw,



















          away: acc.away + item.away,



















        }), { home: 0, draw: 0, away: 0 });



















        return oddsToContext({ home: avg.home / probs.length, draw: avg.draw / probs.length, away: avg.away / probs.length }, homeTeam, awayTeam);



















      }



















    } catch (error) {



















      errors.push(explainNetworkError(error));



















    }



















  }







































  if (errors.length) {



















    return providerContext('oddsApi', 'h2h-market', 'The Odds API key is connected, but no matching H2H market was found for this fixture. Treated as neutral data signal. Last check: ' + errors[0], 0, 0, 0, 0, 'neutral');



















  }



















  return providerContext('oddsApi', 'h2h-market', 'The Odds API is connected, but no matching H2H market is currently available for this fixture. Treated as neutral data signal.', 0, 0, 0, 0, 'neutral');



















}







































async function getFootballDataContext(apiKey, homeTeam, awayTeam) {



















  const url = 'https://api.football-data.org/v4/competitions/WC/matches?dateFrom=2026-06-01&dateTo=2026-07-31';



















  try {



















    const { response, text } = await fetchText(url, { headers: { 'X-Auth-Token': apiKey } }, 15000);



















    if (!response.ok) {



















      return providerContext('footballData', 'competition-matches', 'Football-Data.org is connected, but World Cup match data is not available from this endpoint right now. Treated as neutral data signal. HTTP ' + response.status + '.', 0, 0, 0, 0, 'neutral');



















    }



















    const data = JSON.parse(text);



















    const matches = Array.isArray(data.matches) ? data.matches : [];



















    const match = matches.find((item) => {



















      const home = item.homeTeam?.name || item.homeTeam?.shortName || '';



















      const away = item.awayTeam?.name || item.awayTeam?.shortName || '';



















      return (namesMatch(home, homeTeam) && namesMatch(away, awayTeam)) || (namesMatch(home, awayTeam) && namesMatch(away, homeTeam));



















    });



















    if (!match) {



















      return providerContext('footballData', 'competition-matches', 'Football-Data.org is connected, but no matching World Cup fixture was found for ' + homeTeam + ' vs ' + awayTeam + '. Treated as neutral data signal.', 0, 0, 0, 0, 'neutral');



















    }



















    const score = match.score?.fullTime ? String(match.score.fullTime.home ?? '-') + '-' + String(match.score.fullTime.away ?? '-') : 'not played / no score yet';
    const fixtureDetail = [
      'Fixture matched in Football-Data.org.',
      'Date: ' + (match.utcDate || 'unknown'),
      'Status: ' + (match.status || 'unknown'),
      'Score: ' + score,
      'Teams: ' + (match.homeTeam?.name || homeTeam) + ' vs ' + (match.awayTeam?.name || awayTeam),
    ].join(' ');
    return providerContext(
      'footballData',
      'competition-matches',
      fixtureDetail + ' No score/form edge is available yet, so it is kept as a neutral schedule confirmation.',
      0,
      0,
      0,
      0.5,
      'neutral',
      [{
        category: 'fixture_status',
        source: 'Football-Data.org',
        detail: fixtureDetail,
        impact: 'Confirms schedule/status; neutral unless score or form evidence is available.',
      }]
    );



















  } catch (error) {



















    return providerContext('footballData', 'competition-matches', 'Football-data fixture confirmation was unavailable for this run, so that source is treated as neutral.', 0, 0, 0, 0, 'neutral');



















  }



















}







































async function apiFootballJson(apiKey, endpoint, timeoutMs = 12000) {
  const { response, text } = await fetchText('https://v3.football.api-sports.io' + endpoint, {
    headers: { 'x-apisports-key': apiKey },
  }, timeoutMs);
  if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 160));
  return JSON.parse(text);
}

function pickApiFootballTeam(data, teamName) {
  const rows = Array.isArray(data?.response) ? data.response : [];
  const normalized = normalizeName(teamName);
  return rows.find((row) => normalizeName(row.team?.name) === normalized)
    || rows.find((row) => normalizeName(row.team?.name).includes(normalized) || normalized.includes(normalizeName(row.team?.name)))
    || rows[0]
    || null;
}

function formatApiFootballFixture(row) {
  const fixture = row.fixture || {};
  const teams = row.teams || {};
  const goals = row.goals || {};
  const home = teams.home?.name || 'Home';
  const away = teams.away?.name || 'Away';
  const score = (goals.home ?? '-') + '-' + (goals.away ?? '-');
  const date = fixture.date ? String(fixture.date).slice(0, 10) : 'date unknown';
  return date + ': ' + home + ' ' + score + ' ' + away;
}

function formatApiFootballInjury(row) {
  const player = row.player?.name || 'Unknown player';
  const team = row.team?.name ? row.team.name + ' - ' : '';
  const reason = row.player?.reason || row.player?.type || row.fixture?.status?.long || 'listed injury/status';
  return team + player + ': ' + reason;
}

async function gdeltJsonFirstOk(queries, timeoutMs = 12000) {
  const errors = [];
  for (const query of queries) {
    const modes = ['ArtList', 'artlist'];
    for (const mode of modes) {
      const url = 'https://api.gdeltproject.org/api/v2/doc/doc?mode=' + mode + '&format=json&maxrecords=6&sort=HybridRel&timespan=3months&query=' + encodeURIComponent(query);
      try {
        const { response, text } = await fetchText(url, {}, timeoutMs);
        if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 180));
        let data = {};
        try {
          data = JSON.parse(text);
        } catch (_) {
          throw new Error('non-JSON response: ' + text.slice(0, 120));
        }
        return { data, query, mode, errors };
      } catch (error) {
        errors.push(mode + ' / ' + query + ' -> ' + explainNetworkError(error));
      }
    }
  }
  throw new Error(errors.slice(0, 4).join(' | '));
}

async function getGdeltNewsContext(homeTeam, awayTeam) {
  const queries = [
    '"' + homeTeam + '" "' + awayTeam + '" World Cup football',
    homeTeam + ' ' + awayTeam + ' football',
    homeTeam + ' FIFA World Cup',
    awayTeam + ' FIFA World Cup',
    homeTeam + ' football sponsor politics commercial',
    awayTeam + ' football sponsor politics commercial',
  ];

  try {
    const result = await gdeltJsonFirstOk(queries, 12000);
    const rows = Array.isArray(result.data.articles) ? result.data.articles : [];
    const articles = [];
    rows.forEach((article) => {
      const title = article.title || article.seendate || article.url;
      if (!title) return;
      const key = normalizeName(title + ' ' + (article.domain || ''));
      if (articles.some((item) => item.key === key)) return;
      articles.push({ ...article, key });
    });

    const evidence = articles.slice(0, 8).map((article) => ({
      category: 'capital_commercial_political_news',
      source: article.domain ? 'GDELT / ' + article.domain : 'GDELT',
      detail: (article.title || 'Untitled article') + (article.seendate ? ' | Seen: ' + article.seendate : '') + (article.url ? ' | URL: ' + article.url : ''),
      impact: 'Public news evidence for commercial, political, host-country, sponsor, federation, or capital context; treated as neutral unless direction is clear.',
    }));

    if (!evidence.length) {
      evidence.push({
        category: 'capital_commercial_political_news',
        source: 'GDELT',
        detail: 'GDELT responded, but returned no article rows for the successful query: ' + result.query,
        impact: 'This dimension remains neutral rather than invented.',
      });
    }

    if (result.errors.length) {
      evidence.push({
        category: 'data_quality',
        source: 'GDELT',
        detail: 'GDELT succeeded after retrying simpler DOC queries. Successful query: ' + result.query,
        impact: 'News evidence is included only from successful public article responses.',
      });
    }

    return providerContext(
      'gdeltNews',
      'gdelt-doc-news',
      articles.length
        ? 'GDELT returned ' + articles.length + ' public news item(s). Top item: ' + (articles[0].title || 'Untitled') + '.'
        : 'GDELT responded but returned no specific public news item for this fixture; this dimension remains neutral.',
      0,
      0,
      0,
      articles.length ? 0.3 : 0,
      'neutral',
      evidence
    );
  } catch (error) {
    return providerContext('gdeltNews', 'gdelt-doc-news', 'GDELT news scan was unavailable for this run. Capital/commercial/political evidence is treated as neutral. ' + explainNetworkError(error), 0, 0, 0, 0, 'neutral', [{
      category: 'capital_commercial_political_news',
      source: 'GDELT',
      detail: 'News scan unavailable from the public GDELT endpoint during this run: ' + explainNetworkError(error),
      impact: 'This dimension remains neutral rather than invented.',
    }]);
  }
}


async function sportmonksJson(apiKey, apiPath, timeoutMs = 12000) {
  const separator = apiPath.includes('?') ? '&' : '?';
  const url = 'https://api.sportmonks.com/v3/football' + apiPath + separator + 'api_token=' + encodeURIComponent(apiKey);
  const { response, text } = await fetchText(url, {}, timeoutMs);
  if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + text.slice(0, 180));
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error('Sportmonks returned non-JSON response: ' + text.slice(0, 120));
  }
}

async function sportmonksJsonFirstOk(apiKey, apiPaths, timeoutMs = 12000) {
  const errors = [];
  for (const apiPath of apiPaths) {
    try {
      return { data: await sportmonksJson(apiKey, apiPath, timeoutMs), path: apiPath, errors };
    } catch (error) {
      errors.push(apiPath + ' -> ' + explainNetworkError(error));
    }
  }
  throw new Error(errors.join(' | '));
}

function sportmonksName(entity) {
  return entity?.name || entity?.common_name || entity?.short_code || entity?.display_name || '';
}

function sportmonksArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function sportmonksSearchCandidates(teamName) {
  const normalized = normalizeName(teamName);
  const aliases = TEAM_ALIASES[normalized] || [];
  const manual = {
    'south korea': ['Korea Republic', 'Republic of Korea', 'Korea South'],
    'united states': ['USA', 'United States', 'USMNT'],
    'czech republic': ['Czechia', 'Czech Republic'],
    'bosnia and herzegovina': ['Bosnia and Herzegovina', 'Bosnia-Herzegovina', 'Bosnia'],
  }[normalized] || [];

  return Array.from(new Set([teamName, ...manual, ...aliases].filter(Boolean)));
}

async function searchSportmonksTeam(apiKey, teamName) {
  const errors = [];
  for (const candidate of sportmonksSearchCandidates(teamName)) {
    try {
      const data = await sportmonksJson(apiKey, '/teams/search/' + encodeURIComponent(candidate) + '?include=country;venue&per_page=10', 12000);
      const teams = sportmonksArray(data?.data);
      if (!teams.length) {
        errors.push(candidate + ' -> empty');
        continue;
      }
      const exact = teams.find((team) => namesMatch(sportmonksName(team), teamName));
      const nationalish = teams.find((team) => /national|country|federation|republic/i.test([sportmonksName(team), team.type, team.gender, team.country?.name].filter(Boolean).join(' ')));
      const picked = exact || nationalish || teams[0];
      return { team: picked, candidate, count: teams.length, errors };
    } catch (error) {
      errors.push(candidate + ' -> ' + explainNetworkError(error));
    }
  }
  return { team: null, candidate: '', count: 0, errors };
}

function formatSportmonksFixture(row) {
  const participants = sportmonksArray(row.participants);
  const home = participants.find((team) => team?.meta?.location === 'home') || participants[0] || {};
  const away = participants.find((team) => team?.meta?.location === 'away') || participants[1] || {};
  const scores = sportmonksArray(row.scores);
  const scoreByParticipant = {};
  scores.forEach((score) => {
    const id = score.participant_id || score.team_id;
    const goals = score.score?.goals ?? score.score?.participant ?? score.goals ?? score.value;
    if (id && goals !== undefined) scoreByParticipant[id] = goals;
  });
  const homeGoals = scoreByParticipant[home.id] ?? '-';
  const awayGoals = scoreByParticipant[away.id] ?? '-';
  const date = row.starting_at || row.starting_at_timestamp || 'date unavailable';
  const status = row.state?.name || row.state?.short_name || row.status || 'status unavailable';
  return String(date).slice(0, 10) + ' | ' + sportmonksName(home) + ' ' + homeGoals + '-' + awayGoals + ' ' + sportmonksName(away) + ' | ' + status;
}

function collectSportmonksSidelined(teamName, sources) {
  const rows = sources.flatMap((source) => [
    ...sportmonksArray(source?.sidelined),
    ...sportmonksArray(source?.injuries),
    ...sportmonksArray(source?.absences),
  ]);

  return rows.slice(0, 6).map((row) => {
    const player = row.player?.display_name || row.player?.name || row.player_name || row.name || 'Unnamed player';
    const reason = row.reason || row.type || row.category || row.status || 'status unavailable';
    const until = row.end_date || row.expected_return || row.until || row.created_at || '';
    return teamName + ': ' + player + ' - ' + reason + (until ? ' | ' + String(until).slice(0, 10) : '');
  });
}

async function getSportmonksContext(apiKey, homeTeam, awayTeam) {
  const evidence = [];

  try {
    const homeSearch = await searchSportmonksTeam(apiKey, homeTeam);
    const awaySearch = await searchSportmonksTeam(apiKey, awayTeam);
    const home = homeSearch.team;
    const away = awaySearch.team;

    if (!home?.id || !away?.id) {
      return providerContext('sportmonks', 'football-v3-evidence', 'Sportmonks is connected, but national-team mapping did not return both teams for ' + homeTeam + ' vs ' + awayTeam + '.', 0, 0, 0, 0, 'neutral', [{
        category: 'team_mapping',
        source: 'Sportmonks',
        detail: 'Team mapping incomplete. ' + homeTeam + ' search: ' + (homeSearch.errors.slice(0, 3).join(' | ') || 'no error detail') + '. ' + awayTeam + ' search: ' + (awaySearch.errors.slice(0, 3).join(' | ') || 'no error detail') + '.',
        impact: 'Sportmonks evidence was not used for probability movement.',
      }]);
    }

    evidence.push({
      category: 'team_mapping',
      source: 'Sportmonks',
      detail: 'Mapped ' + homeTeam + ' to ' + sportmonksName(home) + ' (id ' + home.id + ', search "' + homeSearch.candidate + '") and ' + awayTeam + ' to ' + sportmonksName(away) + ' (id ' + away.id + ', search "' + awaySearch.candidate + '").',
      impact: 'Confirms the Sportmonks team IDs used for evidence lookup.',
    });

    let h2hCount = 0;
    let h2hErrors = [];
    let fixtures = [];
    try {
      const h2hAttempt = await sportmonksJsonFirstOk(apiKey, [
        '/fixtures/head-to-head/' + home.id + '/' + away.id + '?include=participants;scores;state;venue&per_page=5',
        '/fixtures/head-to-head/' + home.id + '/' + away.id + '?include=participants;scores&per_page=5',
        '/fixtures/head-to-head/' + home.id + '/' + away.id + '?per_page=5',
      ]);
      fixtures = sportmonksArray(h2hAttempt.data?.data).slice(0, 5);
      h2hErrors = h2hAttempt.errors;
      fixtures.forEach((fixture) => {
        h2hCount += 1;
        evidence.push({
          category: 'head_to_head',
          source: 'Sportmonks',
          detail: formatSportmonksFixture(fixture),
          impact: 'Real H2H fixture evidence; used as context, not as a deterministic predictor.',
        });
      });
      if (!fixtures.length) {
        evidence.push({
          category: 'head_to_head',
          source: 'Sportmonks',
          detail: 'Sportmonks mapped both teams, but returned no H2H fixture rows for this matchup.',
          impact: 'H2H dimension remains limited.',
        });
      }
    } catch (error) {
      h2hErrors = [explainNetworkError(error)];
      evidence.push({
        category: 'head_to_head',
        source: 'Sportmonks',
        detail: 'H2H endpoint did not return usable fixture evidence for this run: ' + explainNetworkError(error),
        impact: 'H2H dimension remains limited.',
      });
    }

    let sidelinedDetails = [];
    const sidelinedPaths = [
      '/teams/' + home.id + '?include=sidelined',
      '/teams/' + away.id + '?include=sidelined',
    ];
    for (const sidelinedPath of sidelinedPaths) {
      try {
        const detail = await sportmonksJson(apiKey, sidelinedPath, 10000);
        const teamName = sidelinedPath.includes('/teams/' + home.id) ? sportmonksName(home) || homeTeam : sportmonksName(away) || awayTeam;
        sidelinedDetails.push(...collectSportmonksSidelined(teamName, [detail?.data, detail]));
      } catch (_) {
        // Some Sportmonks plans do not expose sidelined includes on team detail. Keep H2H/team evidence.
      }
    }

    fixtures.forEach((fixture) => {
      sidelinedDetails.push(...collectSportmonksSidelined('Fixture sidelined', [fixture]));
    });

    sidelinedDetails = sidelinedDetails.slice(0, 8);
    if (sidelinedDetails.length) {
      sidelinedDetails.forEach((detail) => evidence.push({
        category: 'player_status_injury',
        source: 'Sportmonks',
        detail,
        impact: 'Named player-status evidence from Sportmonks; affects the qualitative layer only when current and match-relevant.',
      }));
    } else {
      evidence.push({
        category: 'player_status_injury',
        source: 'Sportmonks',
        detail: 'Sportmonks mapped both teams, but no specific sidelined-player rows were available from the accessible V3 endpoints for this run.',
        impact: 'Player-status dimension remains neutral unless another provider returns named evidence.',
      });
    }

    if (h2hErrors.length || homeSearch.errors.length || awaySearch.errors.length) {
      evidence.push({
        category: 'data_quality',
        source: 'Sportmonks',
        detail: 'Sportmonks used alias/fallback searches and safer V3 includes. Mapping retries: ' + [...homeSearch.errors, ...awaySearch.errors].slice(0, 4).join(' | '),
        impact: 'Unsupported names/includes are downgraded instead of breaking the provider.',
      });
    }

    const summary = [
      'Sportmonks Football API v3 mapped both teams.',
      h2hCount ? 'Returned ' + h2hCount + ' H2H fixture row(s).' : 'No specific H2H score row was returned.',
      sidelinedDetails.length ? 'Returned named player-status rows.' : 'No named sidelined-player evidence was returned.',
    ].join(' ');

    return providerContext('sportmonks', 'football-v3-evidence', summary, 0, 0, 0, h2hCount ? 0.5 : 0.2, h2hCount || sidelinedDetails.length ? 'directional' : 'neutral', evidence);
  } catch (error) {
    return providerContext('sportmonks', 'football-v3-evidence', 'Sportmonks evidence lookup failed: ' + explainNetworkError(error), 0, 0, 0, 0, 'neutral', [{
      category: 'data_quality',
      source: 'Sportmonks',
      detail: 'Sportmonks request failed: ' + explainNetworkError(error),
      impact: 'Sportmonks evidence was not used for this run.',
    }]);
  }
}

async function getApiFootballContext(apiKey, homeTeam, awayTeam) {
  try {
    const status = await apiFootballJson(apiKey, '/status', 12000);
    const homeSearch = await apiFootballJson(apiKey, '/teams?search=' + encodeURIComponent(homeTeam), 12000);
    const awaySearch = await apiFootballJson(apiKey, '/teams?search=' + encodeURIComponent(awayTeam), 12000);
    const home = pickApiFootballTeam(homeSearch, homeTeam);
    const away = pickApiFootballTeam(awaySearch, awayTeam);

    const evidence = [{
      category: 'provider_status',
      source: 'API-Football',
      detail: 'API-Football status check succeeded. Account/request status returned by provider.',
      impact: 'Provider available for live team, H2H, and injury lookups when endpoints return data.',
    }];

    if (!home?.team?.id || !away?.team?.id) {
      evidence.push({
        category: 'team_mapping',
        source: 'API-Football',
        detail: 'Could not map one or both national teams to API-Football team IDs for this fixture.',
        impact: 'H2H and injury evidence unavailable from API-Football for this run.',
      });
      return providerContext('apiFootball', 'team-evidence-layer', 'API-Football is connected, but team ID mapping was incomplete for ' + homeTeam + ' vs ' + awayTeam + '.', 0, 0, 0, 0.2, 'neutral', evidence);
    }

    evidence.push({
      category: 'team_mapping',
      source: 'API-Football',
      detail: homeTeam + ' mapped to team ID ' + home.team.id + '; ' + awayTeam + ' mapped to team ID ' + away.team.id + '.',
      impact: 'Enables H2H and player-status lookups.',
    });

    try {
      const h2h = await apiFootballJson(apiKey, '/fixtures/headtohead?h2h=' + home.team.id + '-' + away.team.id + '&last=5', 12000);
      const fixtures = Array.isArray(h2h?.response) ? h2h.response.slice(0, 5) : [];
      fixtures.forEach((row) => evidence.push({
        category: 'head_to_head',
        source: 'API-Football',
        detail: formatApiFootballFixture(row),
        impact: 'Historical matchup evidence; used as context, not as a deterministic predictor.',
      }));
      if (!fixtures.length) {
        evidence.push({
          category: 'head_to_head',
          source: 'API-Football',
          detail: 'No recent H2H fixtures returned for mapped team IDs.',
          impact: 'H2H dimension remains limited.',
        });
      }
    } catch (_) {
      evidence.push({
        category: 'head_to_head',
        source: 'API-Football',
        detail: 'H2H endpoint did not return usable fixture evidence for this run.',
        impact: 'H2H dimension remains limited.',
      });
    }

    try {
      const season = 2026;
      const injuriesHome = await apiFootballJson(apiKey, '/injuries?team=' + home.team.id + '&season=' + season, 12000);
      const injuriesAway = await apiFootballJson(apiKey, '/injuries?team=' + away.team.id + '&season=' + season, 12000);
      const injuries = [
        ...(Array.isArray(injuriesHome?.response) ? injuriesHome.response.slice(0, 5) : []),
        ...(Array.isArray(injuriesAway?.response) ? injuriesAway.response.slice(0, 5) : []),
      ];
      injuries.forEach((row) => evidence.push({
        category: 'player_status_injury',
        source: 'API-Football',
        detail: formatApiFootballInjury(row),
        impact: 'Player availability evidence; affects probability only when provider data is current and match-relevant.',
      }));
      if (!injuries.length) {
        evidence.push({
          category: 'player_status_injury',
          source: 'API-Football',
          detail: 'No current injury rows returned for the mapped teams and season.',
          impact: 'Player-status dimension remains limited.',
        });
      }
    } catch (_) {
      evidence.push({
        category: 'player_status_injury',
        source: 'API-Football',
        detail: 'Injuries endpoint did not return usable player-status evidence for this run.',
        impact: 'Player-status dimension remains limited.',
      });
    }

    const h2hCount = evidence.filter((item) => item.category === 'head_to_head' && !/No recent|did not return/i.test(item.detail)).length;
    const injuryCount = evidence.filter((item) => item.category === 'player_status_injury' && !/No current|did not return/i.test(item.detail)).length;

    return providerContext(
      'apiFootball',
      'h2h-injury-evidence',
      'API-Football returned team mapping for ' + homeTeam + ' vs ' + awayTeam + '. H2H records: ' + h2hCount + '. Injury/player-status records: ' + injuryCount + '.',
      0,
      0,
      0,
      h2hCount || injuryCount ? 0.8 : 0.2,
      h2hCount || injuryCount ? 'directional' : 'neutral',
      evidence
    );
  } catch (error) {
    return providerContext(
      'apiFootball',
      'h2h-injury-evidence',
      'API-Football was configured but live team/H2H/injury evidence was unavailable for this run.',
      0,
      0,
      0,
      0,
      'neutral',
      [{
        category: 'provider_status',
        source: 'API-Football',
        detail: 'Live team/H2H/injury request unavailable from API-Football during this run.',
        impact: 'H2H and player-status dimensions remain limited.',
      }]
    );
  }
}

export default async function handler(req, res) {



















  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');



















  res.setHeader?.('Cache-Control', 'no-store');







































  if (req.method !== 'POST') {



















    res.status(405).json({ error: 'Method not allowed' });



















    return;



















  }







































  const { home_team, away_team, apiKeys = {}, mockContext } = req.body || {};



















  if (!home_team || !away_team) {



















    res.status(400).json({ error: 'home_team and away_team are required.' });



















    return;



















  }







































  if (mockContext) {



















    if (synthesis) synthesis = sanitizeSynthesisForDisplay(synthesis);

    if (isChinaLocale() && contexts.length > 0) {
    synthesis = forceChineseSynthesis(home_team, away_team, contexts, synthesis);
  }

  res.status(200).json({



















      applied: true,



















      attempted: ['mock'],



















      connected: ['mock'],



















      contexts: [



















        providerContext('mock', 'internal-test', 'Mock context applied.', 0.02, -0.01, -0.01, 2, 'directional'),



















      ],



















      combined: { home: 0.02, draw: -0.01, away: -0.01, confidence: 2 },



















      errors: [],



















    });



















    return;



















  }







































  const jobs = [];



















  const attempted = [];



















  const addJob = (provider, fn) => {



















    attempted.push(provider);



















    jobs.push(fn().catch((error) => Promise.reject({ provider, error })));



















  };







































  if (apiKeys.qwen) addJob('qwen', () => getQwenContext(apiKeys.qwen, home_team, away_team, apiKeys.qwenModel));
  if (apiKeys.gemini) addJob('gemini', () => getGeminiContext(apiKeys.gemini, home_team, away_team));



















  if (apiKeys.chatgpt) addJob('chatgpt', () => getOpenAIContext(apiKeys.chatgpt, home_team, away_team));
  if (apiKeys.chatgpt) addJob('openaiWebResearch', () => getOpenAIWebResearchContext(apiKeys.chatgpt, home_team, away_team));



















  if (apiKeys.deepseek && !attempted.includes('deepseek')) attempted.push('deepseek');



















  if (apiKeys.oddsApi) addJob('oddsApi', () => getOddsApiContext(apiKeys.oddsApi, home_team, away_team));



















  if (apiKeys.footballData) addJob('footballData', () => getFootballDataContext(apiKeys.footballData, home_team, away_team));



















  if (apiKeys.apiFootball) addJob('apiFootball', () => getApiFootballContext(apiKeys.apiFootball, home_team, away_team));
  if (apiKeys.sportmonks) addJob('sportmonks', () => getSportmonksContext(apiKeys.sportmonks, home_team, away_team));

  addJob('gdeltNews', () => getGdeltNewsContext(home_team, away_team));







































  if (!jobs.length) {



















    res.status(200).json({ applied: false, attempted: [], connected: [], contexts: [], errors: [] });



















    return;



















  }







































  const settled = await Promise.allSettled(jobs);



















  const contexts = settled.filter((item) => item.status === 'fulfilled').map((item) => item.value);

  if (apiKeys.qwen && isChinaLocale() && contexts.length > 0) {
    try {
      const qwenEvidence = await getQwenEvidenceSynthesis(apiKeys.qwen, home_team, away_team, apiKeys.qwenModel, contexts);
      const qwenIndex = contexts.findIndex((item) => item.provider === 'qwen');
      if (qwenIndex >= 0) contexts[qwenIndex] = qwenEvidence;
      else contexts.unshift(qwenEvidence);
    } catch (error) {
      contexts.unshift(providerContext(
        'qwen',
        (apiKeys.qwenModel || QWEN_DEFAULT_MODEL) + '-evidence-synthesis',
        '千问二轮证据综合未成功返回；本次继续使用其它成功数据源。原因：' + explainNetworkError(error),
        0,
        0,
        0,
        0,
        'neutral',
        [{
          category: 'data_quality',
          source: 'Qwen evidence synthesis',
          detail: '千问二轮证据综合未成功返回；请检查模型额度、网络稳定性或稍后重试。',
          impact: '本次不把千问作为概率移动依据，只显示数据质量提示。',
        }]
      ));
    }
  }



















  const errors = settled.filter((item) => item.status === 'rejected').map((item) => ({



















    provider: item.reason?.provider || 'unknown',



















    error: item.reason?.error?.message || item.reason?.message || String(item.reason),



















  }));



















  const combined = contexts.reduce((acc, item) => ({












    home: acc.home + (Number(item.home_adjustment) || 0),












    draw: acc.draw + (Number(item.draw_adjustment) || 0),












    away: acc.away + (Number(item.away_adjustment) || 0),












    confidence: acc.confidence + (Number(item.confidence_delta) || 0),












  }), { home: 0, draw: 0, away: 0, confidence: 0 });

























  let synthesis = null;












  let synthesisError = null;












  if (apiKeys.deepseek && contexts.length > 0) {












    try {












      synthesis = await getDeepSeekSynthesis(apiKeys.deepseek, home_team, away_team, contexts);












    } catch (error) {












      synthesisError = error.message || String(error);








      synthesis = buildFallbackSynthesis(home_team, away_team, contexts, synthesisError);












    }












  }

















  if (!synthesis && contexts.length > 0) {








    synthesis = buildFallbackSynthesis(home_team, away_team, contexts, null);








  }

















  res.status(200).json({



















    applied: contexts.length > 0,



















    attempted,



















    connected: synthesis?.model === 'deepseek-v4-pro'







      ? Array.from(new Set([...contexts.map((item) => item.provider), 'deepseek']))







      : contexts.map((item) => item.provider),



















    contexts,



















    combined,











    synthesis,











    synthesis_error: synthesisError,











    errors,



















  });



















}



















