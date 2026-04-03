const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const ctrl = require('../controllers/user.controller');

router.get('/',              auth, requireRole('ADMIN'), ctrl.getAll);
router.patch('/:id/role',    auth, requireRole('ADMIN'), ctrl.updateRole);
router.patch('/:id/status',  auth, requireRole('ADMIN'), ctrl.updateStatus);

module.exports = router;