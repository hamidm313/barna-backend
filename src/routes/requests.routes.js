const router = require('express').Router();
const { list, create, respond } = require('../controllers/requests.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

router.get('/', authenticate, list);
router.post('/', optionalAuth, create);
router.put('/:id/respond', authenticate, requireAdmin, respond);

module.exports = router;
