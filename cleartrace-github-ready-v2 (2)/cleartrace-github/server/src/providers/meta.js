import { getJson, buildQueries } from './common.js';
export async function searchInstagram(input) {
  const token = process.env.META_ACCESS_TOKEN;
  const endpoint = process.env.META_IG_SEARCH_URL;
  if (!token || !endpoint) return [];
  const results = [];
  for (const q of buildQueries(input)) {
    const url = new URL(endpoint);
    url.searchParams.set('q', q);
    const data = await getJson(url, { headers: { Authorization: `Bearer ${token}` } });
    for (const item of (data.data || data.results || [])) {
      results.push({ source: 'Authorized Meta API', category: 'social', platform: 'Instagram', title: item.name || item.username || 'Possible profile', username: item.username || null, profile_url: item.profile_url || item.url || null, signals: [], confidence: 0.5, review_required: true, retrieved_at: new Date().toISOString() });
    }
  }
  return results;
}
