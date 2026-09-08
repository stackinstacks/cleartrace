import { getJson, buildQueries, normalizeRecord } from './common.js';

const API = 'https://www.courtlistener.com/api/rest/v3/search/';

export async function searchCourtRecords(input) {
  const token = process.env.COURTLISTENER_API_TOKEN;
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const queries = buildQueries(input);
  const categories = [
    ['o', 'Opinions / legal decisions'],
    ['r', 'RECAP / docket records']
  ];
  const results = [];

  for (const [type, label] of categories) {
    for (const q of queries) {
      const url = new URL(API);
      url.searchParams.set('q', q);
      url.searchParams.set('type', type);
      url.searchParams.set('order_by', 'dateFiled desc');
      url.searchParams.set('page_size', '20');
      const data = await getJson(url, { headers });
      for (const item of (data.results || [])) {
        results.push(normalizeRecord(item, {
          source: 'CourtListener', category: label
        }));
      }
    }
  }
  return results;
}
