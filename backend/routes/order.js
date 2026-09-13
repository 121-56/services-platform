const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getIncomingOrders,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// جميع المسارات محمية
router.use(protect);

router.post('/', authorize('client', 'admin'), createOrder);
router.get('/my-orders', getMyOrders);
router.get('/incoming', authorize('provider', 'admin'), getIncomingOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;