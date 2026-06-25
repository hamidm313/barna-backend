const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (status) { where.push('status = ?'); params.push(status); }
    if (type) { where.push('type = ?'); params.push(type); }
    if (req.user.role !== 'admin') { where.push('user_id = ?'); params.push(req.user.id); }
    const [rows] = await db.execute(`SELECT r.*, u.name as user_name FROM requests r LEFT JOIN users u ON r.user_id = u.id WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    res.json(rows);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { type, clothing_id, subject, message, guest_name, guest_email, guest_phone } = req.body;
    const [result] = await db.execute('INSERT INTO requests (user_id, guest_name, guest_email, guest_phone, type, clothing_id, subject, message) VALUES (?,?,?,?,?,?,?,?)', [req.user?.id || null, guest_name, guest_email, guest_phone, type, clothing_id || null, subject, message]);
    res.status(201).json({ id: result.insertId, message: 'Request submitted' });
  } catch (err) { next(err); }
};

const respond = async (req, res, next) => {
  try {
    await db.execute('UPDATE requests SET admin_response=?, status=? WHERE id=?', [req.body.admin_response, req.body.status || 'responded', req.params.id]);
    res.json({ message: 'Response saved' });
  } catch (err) { next(err); }
};

module.exports = { list, create, respond };
