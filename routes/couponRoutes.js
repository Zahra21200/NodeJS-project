const express = require('express');
const {
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  applyCouponToProduct,
} = require('../services/couponServices');
const {
  addCouponValidator,
  updateCouponValidator,
} = require('../utilites/validators/couponValidator');

const router = express.Router();

router.route('/')
  .get(getAllCoupons)
  .post((req,res,next)=>{
    addCouponValidator
    next();
  }, addCoupon);

router.route('/:couponId')
  .put((req,res,next)=>{
    updateCouponValidator
    next();
  }, updateCoupon)
  .delete( deleteCoupon);

// router.route('/apply/:couponId')
//   .post(applyCouponValidator, applyCouponToProduct);

module.exports = router;
