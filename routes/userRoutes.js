const express = require('express');
const router = express.Router();
const {
  signup,
  verifyMail,
  signIn,
  userInfo,
  editUserName,
  updatePassword,
  forgetPassword,
  resetPassword,
  updateUserData,
  deactivateUser
} = requirerequire('../services/userService');

const {
  signupValidator,
  signinValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  updateUserDataValidator,
  deactivateUserValidator
} = require('../utilites/validators/userValidator');

// Signup
router.post('/signup', signupValidator, signup);

// Verify email
router.get('/verify/:token', verifyMail);

// Signin
router.post('/signin', signinValidator, signIn);

// User Info
router.get('/userInfo', userInfo);

// Edit Username
router.put('/editUserName', editUserName);

// Update Password
router.put('/updatePassword', resetPasswordValidator, updatePassword);

// Forget Password
router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);

// Reset Password
router.put('/resetPassword/:token', resetPasswordValidator, resetPassword);

// Update User Data (Only Admin)
router.put('/updateUserData', updateUserDataValidator, updateUserData);

// Deactivate User (Only Admin)
router.delete('/deactivateUser/:userId', deactivateUserValidator, deactivateUser);

module.exports = router;
