const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT id, slug, title, is_published, updated_at FROM pages ORDER BY slug ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Page not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const upsert = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content, meta_title, meta_description, is_published } = req.body;
    const [existing] = await db.execute('SELECT id FROM pages WHERE slug = ?', [slug]);
    if (existing.length) {
      await db.execute('UPDATE pages SET title=?, content=?, meta_title=?, meta_description=?, is_published=?, updated_by=? WHERE slug=?', [title, content, meta_title, meta_description, is_published ? 1 : 0, req.user.id, slug]);
    } else {
      await db.execute('INSERT INTO pages (slug, title, content, meta_title, meta_description, is_published, updated_by) VALUES (?,?,?,?,?,?,?)', [slug, title, content, meta_title, meta_description, is_published ? 1 : 0, req.user.id]);
    }
    res.json({ message: 'Saved' });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, upsert };
