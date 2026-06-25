const router = require('express').Router();
const { list, create, update, remove } = require('../controllers/tags.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', list);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
