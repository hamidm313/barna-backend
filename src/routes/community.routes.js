const router = require('express').Router();
const { list, create, updateStatus } = require('../controllers/community.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, list);
router.post('/', optionalAuth, create);
router.put('/:id/status', authenticate, requireAdmin, updateStatus);

module.exports = router;
