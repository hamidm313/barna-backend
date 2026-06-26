const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (status) { where.push('o.status = ?'); params.push(status); }
    if (req.user.role !== 'admin') { where.push('o.user_id = ?'); params.push(req.user.id); }
    const [rows] = await db.execute(`SELECT o.*, c.display_name as clothing_display_name FROM orders o LEFT JOIN clothing c ON o.clothing_id = c.id WHERE ${where.join(' AND ')} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    res.json(rows);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { clothing_id, guest_name, guest_email, guest_phone, shipping_address, notes } = req.body;
    const [clothing] = await db.execute('SELECT * FROM clothing WHERE id = ? AND is_for_sale = 1 AND status = "available"', [clothing_id]);
    if (!clothing.length) return res.status(400).json({ error: 'Clothing not available for sale' });
    const order_number = 'BRN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const [result] = await db.execute(
      'INSERT INTO orders (order_number, user_id, guest_name, guest_email, guest_phone, clothing_id, amount, shipping_address, notes) VALUES (?,?,?,?,?,?,?,?,?)',
      [order_number, req.user?.id || null, guest_name, guest_email, guest_phone, clothing_id, clothing[0].sale_price, shipping_address, notes]
    );
    await db.execute('UPDATE clothing SET status = "reserved" WHERE id = ?', [clothing_id]);
    res.status(201).json({ id: result.insertId, order_number, amount: clothing[0].sale_price });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, tracking_number } = req.body;
    await db.execute('UPDATE orders SET status=?, tracking_number=? WHERE id=?', [status, tracking_number, req.params.id]);
    if (status === 'delivered') {
      const [rows] = await db.execute('SELECT clothing_id FROM orders WHERE id=?', [req.params.id]);
      if (rows.length) await db.execute('UPDATE clothing SET status="sold" WHERE id=?', [rows[0].clothing_id]);
    }
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

module.exports = { list, create, updateStatus };
