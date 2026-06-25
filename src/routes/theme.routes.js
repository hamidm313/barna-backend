const router = require('express').Router();
const { getTheme, updateTheme } = require('../controllers/theme.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getTheme);
router.put('/', authenticate, requireAdmin, updateTheme);

module.exports = router;
