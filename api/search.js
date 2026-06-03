const { CATEGORY_QUERIES, discoverCategory } = require('../lib/youtube-discovery');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const category = String(req.query.category || 'intro');
    const customQuery = String(req.query.q || '').trim();
    const items = await discoverCategory(category, customQuery);
    const query = customQuery || CATEGORY_QUERIES[category] || CATEGORY_QUERIES.intro;

    res.status(200).json({
      ok: true,
      category,
      query,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'search_failed',
      detail: error.message
    });
  }
};
