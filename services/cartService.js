const Cart = require("../model/cartModel");;
const slugify = require('slugify')
const asyncHandler =require('express-async-handler');
const Product = require("../model/productModel.js");
const Coupon = require("../model/couponModel"); // Import Coupon model

// exports.createCart = async (req, res) => {
//     try {
//       const { userId, totalPrice,products } = req.body;
  
//       const newCoupon = await CouponModel.create({
//         userId,
//         totalPrice,
//         products,
//       });
  
//       res.status(201).json({ message: 'Cart added successfully', coupon: newCoupon });
//     } catch (error) {
//       res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
//   };

//   exports.updateCart = async (req, res) => {
//     try {
//       const { couponId } = req.params;
//       const { totalPrice,products } = req.body;
  
//       const updatedCoupon = await CouponModel.findByIdAndUpdate(
//         couponId,
//         {
//           totalPrice,
//           products,
//         },
//         { new: true }
//       );
  
//       if (!updatedCoupon) {
//         return res.status(404).json({ message: 'Cart not found' });
//       }
  
//       res.status(200).json({ message: 'Cart updated successfully', coupon: updatedCoupon });
//     } catch (error) {
//       res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
//   };

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};


exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId ,userId} = req.body;
  const product = await Product.findById(req.body.productId);
  console.log(product)

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // create cart fot logged user with product
    cart = await Cart.create({
      userId,
      cartItems: [{ product: productId, price: product.finalPrice }],
    });
  } else {

    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, price: product.finalPrice });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});



exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  try {
    const { quantity ,userId} = req.body;

    let cart = await Cart.findOne({ userId });
    console.log('User ID:', req.body.userId);
    console.log('Cart:', cart);
    if (!cart) {
      throw new Error(`There is no cart for user ${userId}`);
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];

      // Ensure cartItem is not undefined before accessing properties
      if (cartItem) {
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
      } else {
        throw new Error(`There is no item for this id: ${req.params.itemId}`);
      }
    } else {
      throw new Error(`There is no item for this id: ${req.params.itemId}`);
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (error) {
    // Handle the error here, you can log it or send an appropriate response
    console.error(error);

    // Adjust the status code based on the nature of the error
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});





// Assuming you have a custom error class named CustomError
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({ couponCode: req.body.coupon });

  console.log('Coupon Name:', req.body.coupon);
  console.log('Coupon:', coupon);
  if (!coupon) {
    return next(new CustomError('Coupon is invalid or expired', 404));
  }

  // 2) Get logged user cart to get total cart price
const cart = await Cart.findOne({ userId: req.body.userId });
console.log("cart", cart);

if (!cart) {
  return next(new CustomError('Cart not found for the user', 404));
}

const couponAppliedToProducts = cart.cartItems.some(
  (item) => item.coupon && item.coupon === coupon.name
);  console.log("cart",cart);

  // Check if the coupon has already been applied to any products in the cart

  if (couponAppliedToProducts) {
    return next(new CustomError('Coupon already applied to products in the cart', 400));
  }

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
