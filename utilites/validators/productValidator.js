const { check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validations');
exports.createProductValidator = [
check('productName')
.isLength({ min: 3 })
.withMessage('must be at least 3 chars')
.notEmpty()
.withMessage('Product required'),
check('finalPrice')
.notEmpty()
.withMessage('Product description is required')
.isNumeric()
.withMessage('Product quantity must be a number')
.isLength({ max: 2000 })
.withMessage('Too long description'),
check('priceAfterDiscount')
.optional()
.isNumeric()
.withMessage('Product price must be a number')
.custom((value,{req})=>{
    if(req.body.price<value){
        throw new Error("price After Discount must be less than product price")
    }
    return true
}),
check('image').notEmpty().withMessage('Product imageCover is required'),
check('category')
.notEmpty()
.withMessage('Product must be belong to a category')
.isMongoId()
.withMessage('Invalid ID formate'),validatorMiddleware
];


exports.getProductValidator= 
[
    check('id').isMongoId().withMessage("Invalid Product id"),
    validatorMiddleware,
    
];



exports.updateProductValidator=[
    check('id').isMongoId().withMessage("Invalid Product id"),
    validatorMiddleware,
    
];


exports.deleteProductValidator=[
    check('id').isMongoId().withMessage("Invalid Product id"),
    validatorMiddleware,
    
];


exports.getCategoryProductsValidator = [
  check('categoryId').isMongoId().withMessage('Invalid Category ID'),
  validatorMiddleware,
];