const CouponModel = require('../model/couponModel');


// Add Coupon
exports.addCoupon = async (req, res) => {
  try {
    const { couponCode, value, expireIn, products,createdBy } = req.body;

    const newCoupon = await CouponModel.create({
      couponCode,
      value,
      expireIn,
      products,
      createdBy,
    });

    res.status(201).json({ message: 'Coupon added successfully', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { value, expireIn, products,updatedBy } = req.body;

    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      couponId,
      {
        value,
        expireIn,
        products,
        updatedBy,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
// Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await CouponModel.find();

    res.status(200).json({ coupons: allCoupons });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
// Apply Coupon to Product
// exports.applyCouponToProduct = async (couponId, productId, userId) => {
//   try {
//     const coupon = await CouponModel.findById(couponId);

//     if (!coupon) {
//       return { success: false, message: 'Coupon not found' };
//     }

//     if (coupon.expireIn < new Date()) {
//       return { success: false, message: 'Coupon has expired' };
//     }

//     const product = await ProductModel.findById(productId);

//     if (!product) {
//       return { success: false, message: 'Product not found' };
//     }

//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return { success: false, message: 'User not found' };
//     }

    
//     const discountedPrice = product.price - coupon.value;

//     // Step 5: Update the user's cart or purchase history, depending on your application
//     // This is a placeholder, you might want to implement your own logic
//     user.cart.push({
//       productId,
//       discountedPrice,
//       couponApplied: true,
//       couponId,
//     });

//     await user.save();

//     return { success: true, message: 'Coupon applied successfully', discountedPrice };
//   } catch (error) {
//     throw error;
//   }
// };
