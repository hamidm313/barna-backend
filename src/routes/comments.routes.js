const router = require('express').Router();
const { list, create, updateStatus, remove } = require('../controllers/comments.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, list);
router.post('/', optionalAuth, create);
router.put('/:id/status', authenticate, requireAdmin, updateStatus);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
