const db = require('../config/database');
const fs = require('fs');
const path = require('path');

const getCdnProvider = () => process.env.CDN_PROVIDER || 'local';

const uploadToCdn = async (file) => {
  const provider = getCdnProvider();
  if (provider === 'cloudinary') {
    const { uploadToCloudinary } = require('../config/cdn');
    const result = await uploadToCloudinary(file.path || file.buffer, {
      folder: 'barna/media',
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
    });
    return { url: result.secure_url, public_id: result.public_id, provider: 'cloudinary' };
  }
  if (provider === 's3') {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY },
    });
    const key = `barna/media/${file.filename}`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'public-read',
    }));
    const url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
    return { url, public_id: key, provider: 's3' };
  }
  // local
  const type = file.mimetype.startsWith('image/') ? 'images' : file.mimetype.startsWith('video/') ? 'videos' : 'documents';
  const dir = path.join(process.env.UPLOAD_DIR || 'uploads', type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, file.filename);
  if (file.path && file.path !== dest) fs.renameSync(file.path, dest);
  const url = `/uploads/${type}/${file.filename}`;
  return { url, public_id: null, provider: 'local' };
};

const list = async (req, res, next) => {
  try {
    const { type, search, tag, page = 1, limit = 24 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    const params = [];
    if (type) { where.push('m.type = ?'); params.push(type); }
    if (search) { where.push('m.original_name LIKE ?'); params.push(`%${search}%`); }
    if (tag) { where.push('EXISTS (SELECT 1 FROM media_tags mt JOIN tags t ON mt.tag_id=t.id WHERE mt.media_id=m.id AND t.slug=?)'); params.push(tag); }
    const [rows] = await db.execute(`SELECT m.*, GROUP_CONCAT(t.name SEPARATOR ',') as tags FROM media m LEFT JOIN media_tags mt ON m.id=mt.media_id LEFT JOIN tags t ON mt.tag_id=t.id WHERE ${where.join(' AND ')} GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    const [count] = await db.execute(`SELECT COUNT(*) as total FROM media m WHERE ${where.join(' AND ')}`, params);
    res.json({ data: rows, total: count[0].total });
  } catch (err) { next(err); }
};

const upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const cdn = await uploadToCdn(req.file);
    const type = req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('video/') ? 'video' : 'document';
    const [result] = await db.execute(
      'INSERT INTO media (filename, original_name, type, mime_type, size, url, cdn_public_id, cdn_provider, alt_text, uploaded_by) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [req.file.filename || path.basename(cdn.url), req.file.originalname, type, req.file.mimetype, req.file.size, cdn.url, cdn.public_id, cdn.provider, req.body.alt_text || '', req.user.id]
    );
    if (req.body.tags) {
      const tags = JSON.parse(req.body.tags);
      for (const tagId of tags) await db.execute('INSERT IGNORE INTO media_tags (media_id, tag_id) VALUES (?,?)', [result.insertId, tagId]);
    }
    res.status(201).json({ id: result.insertId, url: cdn.url, provider: cdn.provider });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { alt_text, tags } = req.body;
    await db.execute('UPDATE media SET alt_text=? WHERE id=?', [alt_text, req.params.id]);
    if (tags !== undefined) {
      await db.execute('DELETE FROM media_tags WHERE media_id=?', [req.params.id]);
      for (const tagId of (tags || [])) await db.execute('INSERT IGNORE INTO media_tags (media_id, tag_id) VALUES (?,?)', [req.params.id, tagId]);
    }
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM media WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const m = rows[0];
    if (m.cdn_provider === 'cloudinary' && m.cdn_public_id) {
      const { deleteFromCloudinary } = require('../config/cdn');
      await deleteFromCloudinary(m.cdn_public_id);
    } else if (m.cdn_provider === 'local') {
      const type = m.type + 's';
      const fp = path.join(process.env.UPLOAD_DIR || 'uploads', type, m.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await db.execute('DELETE FROM media WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { list, upload, update, remove };
