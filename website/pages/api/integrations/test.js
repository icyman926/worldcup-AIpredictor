async function testGemini(apiKey) {






  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {






    method: 'POST',






    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },






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













async function testQwen(apiKey, model = 'qwen3.7-plus') {
  try {
    const { response, text } = await fetchText('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: model || 'qwen3.7-plus',
        messages: [
          { role: 'system', content: 'You are a JSON-only health check.' },
          { role: 'user', content: 'Return {"ok":true} only.' },
        ],
        temperature: 0,
        max_tokens: 32,
        response_format: { type: 'json_object' },
      }),
    });
    if (!response.ok) return fail('Qwen HTTP ' + response.status + ': ' + text.slice(0, 220), { http_status: response.status, model });
    return ok('Alibaba Qwen / Tongyi responded successfully from this server.', { model });
  } catch (error) {
    return fail(error, { model });
  }
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

async function testSportmonks(apiKey) {
  const url = 'https://api.sportmonks.com/v3/football/teams/search/United%20States?per_page=1&api_token=' + encodeURIComponent(apiKey);
  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) throw new Error('Sportmonks HTTP ' + response.status + ': ' + text.slice(0, 180));
  let data = {};
  try { data = JSON.parse(text); } catch (_) {}
  if (!Array.isArray(data.data)) throw new Error('Sportmonks returned a non-standard response.');
  return { ok: true, detail: 'Sportmonks Football API v3 responded successfully.' };
}













const testers = {






  gemini: testGemini,






  chatgpt: testOpenAI,






  qwen: testQwen,
  deepseek: testDeepSeek,






  oddsApi: testOddsApi,






  apiFootball: testApiFootball,






  footballData: testFootballData,
  sportmonks: testSportmonks,






};













export default async function handler(req, res) {

  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');

  res.setHeader?.('Cache-Control', 'no-store');






  if (req.method !== 'POST') {






    res.status(405).json({ error: 'Method not allowed' });






    return;






  }













  const { provider, apiKey, qwenModel } = req.body || {};






  if (!provider || !testers[provider]) {






    res.status(400).json({ error: 'Unknown provider.' });






    return;






  }






  if (!apiKey) {






    res.status(400).json({ error: 'Missing API key.' });






    return;






  }













  try {






    const result = provider === 'qwen' ? await testers[provider](apiKey, qwenModel || req.body?.model) : await testers[provider](apiKey);






    res.status(200).json({ provider, ...result });






  } catch (error) {






    res.status(200).json({ provider, ok: false, error: error.message });






  }






}






