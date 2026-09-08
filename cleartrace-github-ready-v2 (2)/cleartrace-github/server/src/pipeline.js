import { searchX } from './providers/x.js';
import { searchLinkedIn } from './providers/linkedin.js';
import { searchInstagram } from './providers/meta.js';
import { searchCourtRecords } from './providers/courtlistener.js';
import { searchAuthorizedPublicRecords } from './providers/public-records.js';

const providers = { x: searchX, linkedin: searchLinkedIn, instagram: searchInstagram, court_records: searchCourtRecords, public_records: searchAuthorizedPublicRecords };
const publicRecordSources = ['court_records', 'public_records'];

export async function runResearch(input) {
  let sources = input.sources?.length ? input.sources : Object.keys(providers);
  if (input.scope === 'public_records') sources = publicRecordSources;
  if (input.depth === 'intensive' && input.scope !== 'social') sources = [...new Set([...sources, ...publicRecordSources])];

  const results = [], errors = [];
  for (const key of sources) {
    const fn = providers[key];
    if (!fn) continue;
    try { results.push(...await fn(input)); }
    catch (err) { errors.push({ source: key, error: err.message }); }
  }

  const deduped = dedupe(results);
  return {
    subject: { name: input.name, city: input.city || null, region: input.region || null },
    search: { depth: input.depth || 'standard', scope: input.scope || 'all', providers: sources },
    summary: summarize(deduped),
    candidates: deduped,
    errors,
    generated_at: new Date().toISOString(),
    review_required: true,
    use_restrictions: ['No automated high-impact decisions', 'No sensitive-trait inference', 'Human review required for identity matching', 'A record match is not proof of identity or wrongdoing']
  };
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = [item.source, item.category, item.title, item.record_url || item.profile_url || '', item.date || ''].join('|').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function summarize(items) {
  const byCategory = {};
  for (const item of items) byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  return { total_candidates: items.length, by_category: byCategory };
}
