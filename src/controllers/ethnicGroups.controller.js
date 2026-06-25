const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ethnic_groups WHERE is_active = 1 ORDER BY display_order ASC, name ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ethnic_groups WHERE slug = ?', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { name, slug, description, image, display_order } = req.body;
    const [result] = await db.execute('INSERT INTO ethnic_groups (name, slug, description, image, display_order) VALUES (?,?,?,?,?)', [name, slug, description, image, display_order || 0]);
    res.status(201).json({ id: result.insertId });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { name, slug, description, image, display_order, is_active } = req.body;
    await db.execute('UPDATE ethnic_groups SET name=?, slug=?, description=?, image=?, display_order=?, is_active=? WHERE id=?', [name, slug, description, image, display_order, is_active ? 1 : 0, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM ethnic_groups WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove };
