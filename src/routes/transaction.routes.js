const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const ctrl = require('../controllers/transaction.controller');

router.get('/',     auth, requireRole('VIEWER', 'ANALYST', 'ADMIN'), ctrl.getAll);
router.post('/',    auth, requireRole('ANALYST', 'ADMIN'),           ctrl.create);
router.put('/:id',  auth, requireRole('ANALYST', 'ADMIN'),           ctrl.update);
router.delete('/:id', auth, requireRole('ADMIN'),                    ctrl.remove);

module.exports = router;