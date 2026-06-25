const router = require('express').Router();
const { list, getOne, upsert } = require('../controllers/pages.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', list);
router.get('/:slug', getOne);
router.put('/:slug', authenticate, requireAdmin, upsert);

module.exports = router;
