const router = require('express').Router();
const { list, upload: uploadFile, update, remove } = require('../controllers/media.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authenticate, requireAdmin, list);
router.post('/upload', authenticate, requireAdmin, upload.single('file'), uploadFile);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
