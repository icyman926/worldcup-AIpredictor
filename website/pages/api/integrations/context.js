async function getGeminiContext(apiKey, homeTeam, awayTeam) {
  const prompt = [
    'You are producing football analytics only, not betting advice.',
    'Return compact JSON only with keys: summary, home_adjustment, away_adjustment, draw_adjustment, confidence_delta.',
    'Each adjustment must be between -0.04 and 0.04.',
    'Analyze verified public context conceptually: injuries, squad depth, locker-room stability, coaching, travel, venue, politics/commercial pressure only as uncertainty factors.',
    'Match: ' + homeTeam + ' vs ' + awayTeam + '.',
  ].join('\n');

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 220, temperature: 0.2 },
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error('Gemini HTTP ' + response.status + ': ' + text.slice(0, 180));
  const data = JSON.parse(text);
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonText = output.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(jsonText);
  return {
    provider: 'gemini',
    summary: parsed.summary || 'Gemini context loaded.',
    home_adjustment: clamp(Number(parsed.home_adjustment) || 0, -0.04, 0.04),
    away_adjustment: clamp(Number(parsed.away_adjustment) || 0, -0.04, 0.04),
    draw_adjustment: clamp(Number(parsed.draw_adjustment) || 0, -0.03, 0.03),
    confidence_delta: clamp(Number(parsed.confidence_delta) || 0, -5, 5),
  };
}

async function getOpenAIContext(apiKey, homeTeam, awayTeam) {
  const prompt = buildContextPrompt(homeTeam, awayTeam);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Return compact JSON only. This is football analytics only, not betting advice.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 220,
      temperature: 0.2,
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error('OpenAI HTTP ' + response.status + ': ' + text.slice(0, 180));
  const data = JSON.parse(text);
  const output = data?.choices?.[0]?.message?.content || '';
  return normalizeContext('chatgpt', output);
}

async function getDeepSeekContext(apiKey, homeTeam, awayTeam) {
  const prompt = buildContextPrompt(homeTeam, awayTeam);
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Return compact JSON only. This is football analytics only, not betting advice.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 220,
      temperature: 0.2,
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error('DeepSeek HTTP ' + response.status + ': ' + text.slice(0, 180));
  const data = JSON.parse(text);
  const output = data?.choices?.[0]?.message?.content || '';
  return normalizeContext('deepseek', output);
}

function buildContextPrompt(homeTeam, awayTeam) {
  return [
    'Return JSON only with keys: summary, home_adjustment, away_adjustment, draw_adjustment, confidence_delta.',
    'Each adjustment must be between -0.04 and 0.04. confidence_delta must be between -5 and 5.',
    'Analyze public football context conceptually: injuries, squad depth, locker-room stability, coach style, travel, venue, politics/commercial pressure only as uncertainty factors.',
    'Do not give betting advice or wagering instructions.',
    'Match: ' + homeTeam + ' vs ' + awayTeam + '.',
  ].join('\n');
}

function normalizeContext(provider, output) {
  const jsonText = output.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(jsonText);
  return {
    provider,
    summary: parsed.summary || provider + ' context loaded.',
    home_adjustment: clamp(Number(parsed.home_adjustment) || 0, -0.04, 0.04),
    away_adjustment: clamp(Number(parsed.away_adjustment) || 0, -0.04, 0.04),
    draw_adjustment: clamp(Number(parsed.draw_adjustment) || 0, -0.03, 0.03),
    confidence_delta: clamp(Number(parsed.confidence_delta) || 0, -5, 5),
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { home_team, away_team, apiKeys = {} } = req.body || {};
  if (!home_team || !away_team) {
    res.status(400).json({ error: 'home_team and away_team are required.' });
    return;
  }

  const contexts = [];
  const errors = [];

  if (apiKeys.gemini) {
    try {
      contexts.push(await getGeminiContext(apiKeys.gemini, home_team, away_team));
    } catch (error) {
      errors.push({ provider: 'gemini', error: error.message });
    }
  }

  if (apiKeys.chatgpt) {
    try {
      contexts.push(await getOpenAIContext(apiKeys.chatgpt, home_team, away_team));
    } catch (error) {
      errors.push({ provider: 'chatgpt', error: error.message });
    }
  }

  if (apiKeys.deepseek) {
    try {
      contexts.push(await getDeepSeekContext(apiKeys.deepseek, home_team, away_team));
    } catch (error) {
      errors.push({ provider: 'deepseek', error: error.message });
    }
  }

  res.status(200).json({
    connected: contexts.map((item) => item.provider),
    contexts,
    errors,
  });
}
