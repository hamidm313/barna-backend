const db = require('../config/database');

const getTheme = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT setting_key, setting_value, label, group_name FROM theme_settings ORDER BY group_name, setting_key');
    const theme = {};
    rows.forEach(r => { theme[r.setting_key] = r.setting_value; });
    res.json(theme);
  } catch (err) { next(err); }
};

const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;
    for (const [key, value] of Object.entries(theme)) {
      await db.execute('INSERT INTO theme_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?', [key, value, value]);
    }
    res.json({ message: 'Theme saved' });
  } catch (err) { next(err); }
};

module.exports = { getTheme, updateTheme };
