const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expireIn: {
    type: Date,
    required: true,
    validate: {
      validator: function (date) {
        return date >= new Date();
      },
      message: 'Expiration date must be in the future or today',
    },
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', // Assuming you have a Product model
  }],
  carts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
});

const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = CouponModel;
