const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const ctrl = require('../controllers/dashboard.controller');

router.get('/summary',    auth, requireRole('VIEWER', 'ANALYST', 'ADMIN'), ctrl.getSummary);
router.get('/by-category', auth, requireRole('VIEWER', 'ANALYST', 'ADMIN'), ctrl.getByCategory);
router.get('/trends',     auth, requireRole('ANALYST', 'ADMIN'),            ctrl.getMonthlyTrends);
router.get('/recent',     auth, requireRole('VIEWER', 'ANALYST', 'ADMIN'), ctrl.getRecent);

module.exports = router;