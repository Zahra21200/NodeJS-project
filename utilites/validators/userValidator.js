const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validations');

exports.signupValidator = [
  check('userName').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validatorMiddleware,
];

exports.signinValidator = [
  check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  check('password').notEmpty().withMessage('Password is required'),
  validatorMiddleware,
];

// forgetPasswordValidator
exports.forgetPasswordValidator = [
    check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    validatorMiddleware,
  ];
  
  // resetPasswordValidator
  exports.resetPasswordValidator = [
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validatorMiddleware,
  ];
  
  // updateUserDataValidator (for admin)
  exports.updateUserDataValidator = [
    check('userId').isMongoId().withMessage('Invalid User ID'),
    // Add other validation rules for updating user data by admin as needed
    validatorMiddleware,
  ];
  
  // deactivateUserValidator (for admin)
  exports.deactivateUserValidator = [
    check('userId').isMongoId().withMessage('Invalid User ID'),
    validatorMiddleware,
  ];
  
  