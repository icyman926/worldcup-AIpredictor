async function testGemini(apiKey) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Return exactly: OK' }] }],
      generationConfig: { maxOutputTokens: 8, temperature: 0 },
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error('Gemini HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'Gemini responded successfully.' };
}

async function testOpenAI(apiKey) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: 'Bearer ' + apiKey },
  });
  const text = await response.text();
  if (!response.ok) throw new Error('OpenAI HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'OpenAI API key can list models.' };
}

async function testDeepSeek(apiKey) {
  const response = await fetch('https://api.deepseek.com/models', {
    headers: { Authorization: 'Bearer ' + apiKey },
  });
  const text = await response.text();
  if (!response.ok) throw new Error('DeepSeek HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'DeepSeek API key can list models.' };
}

async function testOddsApi(apiKey) {
  const response = await fetch('https://api.the-odds-api.com/v4/sports?apiKey=' + encodeURIComponent(apiKey));
  const text = await response.text();
  if (!response.ok) throw new Error('Odds API HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'The Odds API responded successfully.' };
}

async function testFootballData(apiKey) {
  const response = await fetch('https://api.football-data.org/v4/competitions', {
    headers: { 'X-Auth-Token': apiKey },
  });
  const text = await response.text();
  if (!response.ok) throw new Error('Football-Data HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'Football-Data.org responded successfully.' };
}

async function testApiFootball(apiKey) {
  const response = await fetch('https://v3.football.api-sports.io/status', {
    headers: { 'x-apisports-key': apiKey },
  });
  const text = await response.text();
  if (!response.ok) throw new Error('API-Football HTTP ' + response.status + ': ' + text.slice(0, 180));
  return { ok: true, detail: 'API-Football responded successfully.' };
}

const testers = {
  gemini: testGemini,
  chatgpt: testOpenAI,
  deepseek: testDeepSeek,
  oddsApi: testOddsApi,
  apiFootball: testApiFootball,
  footballData: testFootballData,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { provider, apiKey } = req.body || {};
  if (!provider || !testers[provider]) {
    res.status(400).json({ error: 'Unknown provider.' });
    return;
  }
  if (!apiKey) {
    res.status(400).json({ error: 'Missing API key.' });
    return;
  }

  try {
    const result = await testers[provider](apiKey);
    res.status(200).json({ provider, ...result });
  } catch (error) {
    res.status(200).json({ provider, ok: false, error: error.message });
  }
}
