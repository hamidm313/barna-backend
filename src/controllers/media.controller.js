const db = require('../config/database');
const fs = require('fs');
const path = require('path');

const list = async (req, res, next) => {
  try {
    const { type, search, tag, page = 1, limit = 24 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (type) { where.push('m.type = ?'); params.push(type); }
    if (search) { where.push('m.original_name LIKE ?'); params.push(`%${search}%`); }
    if (tag) { where.push('EXISTS (SELECT 1 FROM media_tags mt JOIN tags t ON mt.tag_id = t.id WHERE mt.media_id = m.id AND t.slug = ?)'); params.push(tag); }
    const [rows] = await db.execute(`SELECT m.*, GROUP_CONCAT(t.name) as tags FROM media m LEFT JOIN media_tags mt ON m.id = mt.media_id LEFT JOIN tags t ON mt.tag_id = t.id WHERE ${where.join(' AND ')} GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    const [count] = await db.execute(`SELECT COUNT(*) as total FROM media m WHERE ${where.join(' AND ')}`, params);
    res.json({ data: rows, total: count[0].total });
  } catch (err) { next(err); }
};

const upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const type = req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('video/') ? 'video' : 'document';
    const url = `/uploads/${type}s/${req.file.filename}`;
    const [result] = await db.execute(
      'INSERT INTO media (filename, original_name, type, mime_type, size, url, alt_text, uploaded_by) VALUES (?,?,?,?,?,?,?,?)',
      [req.file.filename, req.file.originalname, type, req.file.mimetype, req.file.size, url, req.body.alt_text || '', req.user.id]
    );
    if (req.body.tags) {
      const tags = JSON.parse(req.body.tags);
      for (const tagId of tags) await db.execute('INSERT IGNORE INTO media_tags (media_id, tag_id) VALUES (?,?)', [result.insertId, tagId]);
    }
    res.status(201).json({ id: result.insertId, url, filename: req.file.filename });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { alt_text, tags } = req.body;
    await db.execute('UPDATE media SET alt_text = ? WHERE id = ?', [alt_text, req.params.id]);
    if (tags !== undefined) {
      await db.execute('DELETE FROM media_tags WHERE media_id = ?', [req.params.id]);
      for (const tagId of (tags || [])) await db.execute('INSERT IGNORE INTO media_tags (media_id, tag_id) VALUES (?,?)', [req.params.id, tagId]);
    }
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', rows[0].type + 's', rows[0].filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await db.execute('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, upload, update, remove };
