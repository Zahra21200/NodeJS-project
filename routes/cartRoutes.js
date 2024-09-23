
const express = require('express');

const {
  addProductToCart,
  updateCartItemQuantity,
  applyCoupon,
} = require('../services/cartService');
//const authService = require('../services/authService');

const router = express.Router();

//router.use(authService.protect, authService.allowedTo('user'));
router
  .route('/')
  .post(addProductToCart)
  ;

router.put('/applyCoupon', applyCoupon);

router
  .route('/:itemId')
  .put(updateCartItemQuantity)


module.exports = router;
