const db = require('../config/database');

const buildSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const list = async (req, res, next) => {
  try {
    const { ethnic_group, category, status, gender, is_featured, search, page = 1, limit = 12, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['c.id IS NOT NULL'];
    const params = [];
    if (ethnic_group) { where.push('eg.slug = ?'); params.push(ethnic_group); }
    if (category) { where.push('c.category = ?'); params.push(category); }
    if (status) { where.push('c.status = ?'); params.push(status); }
    if (gender) { where.push('c.gender = ?'); params.push(gender); }
    if (is_featured) { where.push('c.is_featured = 1'); }
    if (search) { where.push('(c.name LIKE ? OR c.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const allowedSorts = ['created_at', 'name', 'sale_price', 'rental_price_per_day', 'view_count'];
    const sortCol = allowedSorts.includes(sort) ? `c.${sort}` : 'c.created_at';
    const orderDir = order === 'ASC' ? 'ASC' : 'DESC';

    const countSql = `SELECT COUNT(*) as total FROM clothing c LEFT JOIN ethnic_groups eg ON c.ethnic_group_id = eg.id WHERE ${where.join(' AND ')}`;
    const [countRows] = await db.execute(countSql, params);
    const total = countRows[0].total;

    const sql = `SELECT c.*, eg.name as ethnic_group_name, eg.slug as ethnic_group_slug FROM clothing c LEFT JOIN ethnic_groups eg ON c.ethnic_group_id = eg.id WHERE ${where.join(' AND ')} ORDER BY ${sortCol} ${orderDir} LIMIT ? OFFSET ?`;
    const [rows] = await db.execute(sql, [...params, parseInt(limit), offset]);

    res.json({ data: rows, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`SELECT c.*, eg.name as ethnic_group_name, eg.slug as ethnic_group_slug FROM clothing c LEFT JOIN ethnic_groups eg ON c.ethnic_group_id = eg.id WHERE c.id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    await db.execute('UPDATE clothing SET view_count = view_count + 1 WHERE id = ?', [id]);
    const [tags] = await db.execute('SELECT t.* FROM tags t JOIN clothing_tags ct ON t.id = ct.tag_id WHERE ct.clothing_id = ?', [id]);
    res.json({ ...rows[0], tags });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { name, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, status, sale_price, rental_price_per_day, deposit_amount, is_for_sale, is_for_rent, is_featured, images, before_image, after_image, tags } = req.body;
    const slug = buildSlug(name) + '-' + Date.now();
    const [result] = await db.execute(
      `INSERT INTO clothing (name, slug, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, status, sale_price, rental_price_per_day, deposit_amount, is_for_sale, is_for_rent, is_featured, images, before_image, after_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [name, slug, description, ethnic_group_id, category || 'traditional', gender || 'female', size, color, material, era, condition_status || 'good', status || 'available', sale_price, rental_price_per_day, deposit_amount, is_for_sale ? 1 : 0, is_for_rent !== false ? 1 : 0, is_featured ? 1 : 0, JSON.stringify(images || []), before_image, after_image]
    );
    if (tags && tags.length) {
      for (const tagId of tags) {
        await db.execute('INSERT IGNORE INTO clothing_tags (clothing_id, tag_id) VALUES (?, ?)', [result.insertId, tagId]);
      }
    }
    res.status(201).json({ id: result.insertId, message: 'Created' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, status, sale_price, rental_price_per_day, deposit_amount, is_for_sale, is_for_rent, is_featured, images, before_image, after_image, tags } = req.body;
    await db.execute(
      `UPDATE clothing SET name=?, description=?, ethnic_group_id=?, category=?, gender=?, size=?, color=?, material=?, era=?, condition_status=?, status=?, sale_price=?, rental_price_per_day=?, deposit_amount=?, is_for_sale=?, is_for_rent=?, is_featured=?, images=?, before_image=?, after_image=? WHERE id=?`,
      [name, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, status, sale_price, rental_price_per_day, deposit_amount, is_for_sale ? 1 : 0, is_for_rent ? 1 : 0, is_featured ? 1 : 0, JSON.stringify(images || []), before_image, after_image, id]
    );
    if (tags !== undefined) {
      await db.execute('DELETE FROM clothing_tags WHERE clothing_id = ?', [id]);
      for (const tagId of (tags || [])) {
        await db.execute('INSERT IGNORE INTO clothing_tags (clothing_id, tag_id) VALUES (?, ?)', [id, tagId]);
      }
    }
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM clothing WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove };
