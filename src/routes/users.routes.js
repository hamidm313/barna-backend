const router = require('express').Router();
const { list, updateRole, toggleActive } = require('../controllers/users.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, list);
router.put('/:id/role', authenticate, requireAdmin, updateRole);
router.put('/:id/toggle-active', authenticate, requireAdmin, toggleActive);

module.exports = router;
