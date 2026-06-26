const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (search) { where.push('(display_name LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (role) { where.push('role = ?'); params.push(role); }
    const [rows] = await db.execute(`SELECT id, display_name, email, phone, role, avatar, is_active, created_at FROM users WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    const [count] = await db.execute(`SELECT COUNT(*) as total FROM users WHERE ${where.join(' AND ')}`, params);
    res.json({ data: rows, total: count[0].total });
  } catch (err) { next(err); }
};

const updateRole = async (req, res, next) => {
  try {
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [req.body.role, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const toggleActive = async (req, res, next) => {
  try {
    await db.execute('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

module.exports = { list, updateRole, toggleActive };
