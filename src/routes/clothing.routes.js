const router = require('express').Router();
const { list, getOne, create, update, remove } = require('../controllers/clothing.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', list);
router.get('/:id', getOne);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
