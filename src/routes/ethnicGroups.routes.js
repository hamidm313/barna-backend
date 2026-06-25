const router = require('express').Router();
const { list, getOne, create, update, remove } = require('../controllers/ethnicGroups.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', list);
router.get('/:slug', getOne);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
