const db = require('../config/database');

const getAll = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const [rows] = await db.execute('SELECT setting_key, setting_value, setting_type, label, group_name FROM settings' + (isAdmin ? '' : ' WHERE group_name != "private"'));
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = { value: r.setting_value, type: r.setting_type, label: r.label, group: r.group_name }; });
    res.json(settings);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await db.execute('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [String(value), key]);
    }
    res.json({ message: 'Settings saved' });
  } catch (err) { next(err); }
};

module.exports = { getAll, update };
