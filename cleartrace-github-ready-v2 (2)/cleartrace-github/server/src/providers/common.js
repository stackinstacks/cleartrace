export function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildQueries({ name, city, region }) {
  const base = cleanText(name);
  const location = [cleanText(city), cleanText(region)].filter(Boolean).join(', ');
  return [
    base,
    location ? `${base} ${location}` : base
  ];
}

export function normalizeRecord(record, defaults = {}) {
  return {
    source: defaults.source || 'unknown',
    category: defaults.category || 'public_record',
    title: record.title || record.name || record.case_name || 'Public record',
    status: record.status || record.case_status || null,
    jurisdiction: record.jurisdiction || record.court || record.state || null,
    date: record.date || record.filed_date || record.date_filed || null,
    record_url: record.url || record.web_url || record.source_url || null,
    signals: Array.isArray(record.signals) ? record.signals : [],
    confidence: typeof record.confidence === 'number' ? record.confidence : 0.5,
    review_required: true,
    retrieved_at: new Date().toISOString()
  };
}

export async function getJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}`);
  return response.json();
}
