const { discoverAllCategories } = require('../lib/youtube-discovery');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const results = await discoverAllCategories();
    const flat = results.flatMap((group) => group.items);
    res.status(200).json({
      ok: true,
      fetchedAt: new Date().toISOString(),
      categoryCount: results.length,
      count: flat.length,
      groups: results,
      items: flat
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'discover_failed',
      detail: error.message
    });
  }
};
