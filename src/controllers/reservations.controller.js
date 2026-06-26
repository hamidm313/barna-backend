const db = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (status) { where.push('r.status = ?'); params.push(status); }
    if (req.user.role !== 'admin') { where.push('r.user_id = ?'); params.push(req.user.id); }
    const [rows] = await db.execute(`SELECT r.*, c.display_name as clothing_display_name, c.images as clothing_images, u.display_name as user_display_name, u.email as user_email FROM reservations r LEFT JOIN clothing c ON r.clothing_id = c.id LEFT JOIN users u ON r.user_id = u.id WHERE ${where.join(' AND ')} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    res.json(rows);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`SELECT r.*, c.display_name as clothing_display_name, c.images as clothing_images, c.rental_price_per_day, u.display_name as user_display_name FROM reservations r LEFT JOIN clothing c ON r.clothing_id = c.id LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const r = rows[0];
    if (req.user.role !== 'admin' && r.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(r);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { clothing_id, start_date, end_date, guest_name, guest_email, guest_phone, shipping_address, notes, rules_accepted } = req.body;
    if (!rules_accepted) return res.status(400).json({ error: 'You must accept the reservation rules' });
    const [clothing] = await db.execute('SELECT * FROM clothing WHERE id = ? AND is_for_rent = 1 AND status = "available"', [clothing_id]);
    if (!clothing.length) return res.status(400).json({ error: 'Clothing not available for rent' });
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) || 1;
    const deposit = clothing[0].deposit_amount;
    const rental_fee = clothing[0].rental_price_per_day * days;
    const [result] = await db.execute(
      `INSERT INTO reservations (user_id, clothing_id, guest_name, guest_email, guest_phone, start_date, end_date, deposit_amount, rental_fee, shipping_address, notes, rules_accepted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user?.id || null, clothing_id, guest_name, guest_email, guest_phone, start_date, end_date, deposit, rental_fee, shipping_address, notes, 1]
    );
    res.status(201).json({ id: result.insertId, deposit_amount: deposit, rental_fee, message: 'Reservation created. Please pay the deposit to confirm.' });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, tracking_number, cleaning_fee, shipping_fee } = req.body;
    const [rows] = await db.execute('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const r = rows[0];
    if (status === 'returned') {
      const cleaning = cleaning_fee || 0;
      const shipping = shipping_fee || 0;
      const refund = r.deposit_amount - r.rental_fee - cleaning - shipping;
      await db.execute('UPDATE reservations SET status=?, cleaning_fee=?, shipping_fee=?, total_refund=?, tracking_number=? WHERE id=?', [status, cleaning, shipping, refund, tracking_number, req.params.id]);
      await db.execute('UPDATE clothing SET status = "available" WHERE id = ?', [r.clothing_id]);
    } else {
      await db.execute('UPDATE reservations SET status=?, tracking_number=? WHERE id=?', [status, tracking_number, req.params.id]);
      if (status === 'active') await db.execute('UPDATE clothing SET status = "rented" WHERE id = ?', [r.clothing_id]);
      if (status === 'cancelled') await db.execute('UPDATE clothing SET status = "available" WHERE id = ?', [r.clothing_id]);
    }
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, updateStatus };
