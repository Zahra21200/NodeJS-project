const { param } = require('express-validator');
const validationMidleware = require('../../middlewares/validations');

exports.getCategoryValidator=[
    param('id').isMongoId().withMessage("Invalid category id"),
    validationMidleware,
    
];

exports.createCategoryValidator=[
    param('name').notEmpty().withMessage("category name is required")
    .isLength({min:3})
    .withMessage("category name is too short")
    .isLength({max:32})
    .withMessage("category name is too long"),
    validationMidleware,
    
];


exports.updateCategoryValidator=[
    param('id').isMongoId().withMessage("Invalid category id"),
    validationMidleware,
    
];


exports.deleteCategoryValidator=[
    param('id').isMongoId().withMessage("Invalid category id"),
    validationMidleware,
    
];