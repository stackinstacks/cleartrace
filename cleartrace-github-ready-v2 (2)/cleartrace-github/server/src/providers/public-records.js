import { getJson, normalizeRecord } from './common.js';

const recordTypes = [
  'criminal_court',
  'civil_court',
  'bankruptcy',
  'professional_license',
  'business_entity',
  'regulatory_enforcement',
  'public_contracts',
  'campaign_finance',
  'property_tax',
  'judgment_lien'
];

export async function searchAuthorizedPublicRecords(input) {
  const endpoint = process.env.PUBLIC_RECORDS_API_URL;
  const token = process.env.PUBLIC_RECORDS_API_TOKEN;
  if (!endpoint) return [];

  const results = [];
  for (const recordType of recordTypes) {
    const url = new URL(endpoint);
    url.searchParams.set('name', input.name);
    if (input.city) url.searchParams.set('city', input.city);
    if (input.region) url.searchParams.set('region', input.region);
    url.searchParams.set('record_type', recordType);
    url.searchParams.set('limit', '50');

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const data = await getJson(url, { headers });
    const rows = Array.isArray(data) ? data : (data.results || data.records || []);
    for (const row of rows) {
      results.push(normalizeRecord(row, {
        source: 'Authorized public-records API',
        category: recordType
      }));
    }
  }
  return results;
}
