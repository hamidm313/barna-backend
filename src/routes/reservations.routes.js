const router = require('express').Router();
const { list, getOne, create, updateStatus } = require('../controllers/reservations.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', authenticate, list);
router.get('/:id', authenticate, getOne);
router.post('/', optionalAuth, create);
router.put('/:id/status', authenticate, requireAdmin, updateStatus);

module.exports = router;
