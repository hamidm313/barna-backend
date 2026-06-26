const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT t.*, COUNT(ct.clothing_id) as usage_count FROM tags t LEFT JOIN clothing_tags ct ON t.id = ct.tag_id GROUP BY t.id ORDER BY t.display_name ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { display_name } = req.body;
    const slug = display_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9؀-ۿ-]/g, '');
    const [result] = await db.execute('INSERT INTO tags (display_name, slug) VALUES (?, ?)', [display_name, slug + '-' + Date.now()]);
    res.status(201).json({ id: result.insertId, display_name, slug });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { display_name } = req.body;
    await db.execute('UPDATE tags SET display_name = ? WHERE id = ?', [display_name, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM tags WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, create, update, remove };
