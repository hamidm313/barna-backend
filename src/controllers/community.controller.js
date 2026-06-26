const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { ethnic_group, status, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ["status = 'approved'"];
    const params = [];
    if (ethnic_group) { where.push('ethnic_group_id = (SELECT id FROM ethnic_groups WHERE slug = ?)'); params.push(ethnic_group); }
    if (req.user?.role === 'admin' && status) { where[0] = 'status = ?'; params.unshift(status); }
    const [rows] = await db.execute(`SELECT p.*, u.display_name as user_display_name, eg.display_name as ethnic_group_display_name FROM community_posts p LEFT JOIN users u ON p.user_id = u.id LEFT JOIN ethnic_groups eg ON p.ethnic_group_id = eg.id WHERE ${where.join(' AND ')} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    res.json(rows);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { display_name, content, images, ethnic_group_id } = req.body;
    const [result] = await db.execute('INSERT INTO community_posts (user_id, display_name, content, images, ethnic_group_id) VALUES (?,?,?,?,?)', [req.user?.id || null, display_name, content, JSON.stringify(images || []), ethnic_group_id || null]);
    res.status(201).json({ id: result.insertId, message: 'Post submitted for review' });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    await db.execute('UPDATE community_posts SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

module.exports = { list, create, updateStatus };
