const router = require('express').Router();
const { getAll, update } = require('../controllers/settings.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAll);
router.put('/', authenticate, requireAdmin, update);

module.exports = router;
