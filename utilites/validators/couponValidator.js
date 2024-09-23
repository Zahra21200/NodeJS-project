const { body, param } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validations');
exports.addCouponValidator= 
[
    body('couponCode').isString().notEmpty(),
    body('value').isNumeric(),
    body('createdBy').isMongoId(),
    body('expireIn').isISO8601().toDate(),
    validatorMiddleware
];
exports.updateCouponValidator= 
[
    param('couponId').isMongoId(),
    body('couponCode').isString().optional(),
    body('value').isNumeric().optional(),
    body('updatedBy').isMongoId().optional(),
    body('expireIn').isISO8601().toDate().optional(),
    validatorMiddleware
];
