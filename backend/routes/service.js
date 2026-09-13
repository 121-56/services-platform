const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getMyServices,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// المسارات العامة
router.get('/', getServices);
router.get('/:id', getService);

// المسارات المحمية
router.use(protect);

router.get('/my/services', getMyServices);
router.post('/', authorize('provider', 'admin'), createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;