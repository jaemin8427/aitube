const { CATEGORY_LABELS, CATEGORY_GROUPS } = require('../lib/youtube-discovery');

function extractVideoId(urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1) || null;
    if (url.pathname === '/watch') return url.searchParams.get('v');
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
    return null;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const url = String(body.url || '').trim();
    const category = String(body.category || 'intro').trim();

    if (!url) return res.status(400).json({ ok: false, error: 'missing_url' });

    const id = extractVideoId(url);
    if (!id) return res.status(400).json({ ok: false, error: 'invalid_youtube_url' });

    const normalizedUrl = `https://www.youtube.com/watch?v=${id}`;
    const endpoint = `https://noembed.com/embed?url=${encodeURIComponent(normalizedUrl)}`;
    const metaRes = await fetch(endpoint, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!metaRes.ok) throw new Error(`noembed ${metaRes.status}`);
    const data = await metaRes.json();
    if (data.error) throw new Error(data.error);

    const item = {
      id,
      url: normalizedUrl,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      title: data.title || '제목 없음',
      thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channel: data.author_name || 'Unknown',
      category,
      categoryLabel: CATEGORY_LABELS[category] || category,
      categoryGroup: CATEGORY_GROUPS[category] || 'Custom',
      score: 0,
      discoveredAt: new Date().toISOString(),
      source: 'manual-url'
    };

    res.status(200).json({ ok: true, item });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'manual_add_failed', detail: error.message });
  }
};
