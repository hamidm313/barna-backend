const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { clothing_id, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (clothing_id) { where.push('c.clothing_id = ?'); params.push(clothing_id); }
    if (status) { where.push('c.status = ?'); params.push(status); }
    else if (req.user?.role !== 'admin') { where.push('c.status = "approved"'); }
    const [rows] = await db.execute(`SELECT c.*, u.display_name as user_display_name FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE ${where.join(' AND ')} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    res.json(rows);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { clothing_id, content, guest_name, guest_email, parent_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO comments (user_id, guest_name, guest_email, clothing_id, content, parent_id) VALUES (?,?,?,?,?,?)',
      [req.user?.id || null, guest_name, guest_email, clothing_id, content, parent_id || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Comment submitted for review' });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    await db.execute('UPDATE comments SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, create, updateStatus, remove };
