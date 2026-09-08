import { getJson, buildQueries } from './common.js';
export async function searchX(input) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return [];
  const results = [];
  for (const q of buildQueries(input)) {
    const url = new URL('https://api.x.com/2/users/search');
    url.searchParams.set('query', q);
    url.searchParams.set('max_results', '50');
    const data = await getJson(url, { headers: { Authorization: `Bearer ${token}` } });
    for (const user of (data.data || [])) {
      results.push({ source: 'X API', category: 'social', platform: 'X', title: user.name, username: user.username, profile_url: `https://x.com/${user.username}`, signals: [], confidence: 0.5, review_required: true, retrieved_at: new Date().toISOString() });
    }
  }
  return results;
}
