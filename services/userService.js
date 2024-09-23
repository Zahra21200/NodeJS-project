const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');



// Signup
exports.signup = asyncHandler(async (req, res) => {
  const { userName, email, password, CPassword } = req.body;

  // Check if passwords match
  if (password !== CPassword) {
    return res.status(400).json({ message: 'Password and Confirm password should be the same' });
  }

  // Check if the user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already registered' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user
  const newUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });

  // Send verification email
  const token = jwt.sign({ id: newUser._id }, 'verifyAccount');
  sendEmail({ email, url: `http://localhost:8000/userInfo/verify/${token}` });

  res.status(201).json({ message: 'User registered successfully', newUser });
});

// Verify email
exports.verifyMail = (req, res) => {
  jwt.verify(req.params.token, 'verifyAccount', async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Update user's verification status
    const updatedUser = await userModel.findByIdAndUpdate(decoded.id, { isVerified: true }, { new: true });

    res.status(200).json({ message: 'Email verified successfully', updatedUser });
  });
};

// Signin
exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user
  const user = await userModel.findOne({ email, isVerified: true });

  if (!user) {
    return res.status(401).json({ message: 'Please register first, then sign in' });
  }

  // Compare passwords
  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (isPasswordValid) {
    // Generate token
    const token = jwt.sign({ id: user._id, userName: user.userName }, 'ITI44');
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Password incorrect' });
  }
});


// Update user data (only admin)
exports.updateUserData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newData } = req.body;

  // Check if the requesting user is an admin
  if (req.user.role !== 'admin') {
    throw new myErrors('Unauthorized: Only admin can update user data', 403);
  }

  // Find the user by ID
  const userToUpdate = await userModel.findById(userId);

  if (!userToUpdate) {
    throw new myErrors('User not found', 404);
  }

  // Update user data
  userToUpdate.name = newData.name || userToUpdate.name;
  userToUpdate.email = newData.email || userToUpdate.email;
  userToUpdate.age = newData.age || userToUpdate.age;
  // Add other fields you want to update...

  // Save the updated user
  await userToUpdate.save();

  res.status(200).json({ message: 'User data updated successfully', updatedUser: userToUpdate });
});

// Deactivate user
exports.deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find the user
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Deactivate the user
  user.isVerified = false;
  await user.save();

  res.status(200).json({ message: 'User deactivated successfully' });
});

// Generate a reset password token
const generateResetPasswordToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Save reset password token and expiry time in the user model
exports.saveResetPasswordToken = async (userId, resetToken, resetTokenExpiry) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new myErrors('User not found', 404);
  }
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiry = resetTokenExpiry;
  await user.save();
};

// Reset password - Step 1: Request reset token
exports.requestResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const resetToken = generateResetPasswordToken();

  // Set token expiry (e.g., 1 hour from now)
  const resetTokenExpiry = Date.now() + 3600000;

  // Save the reset token and expiry time in the user model
  await saveResetPasswordToken(user._id, resetToken, resetTokenExpiry);

  // Send the reset password link to the user's email
  sendEmail({
    email,
    subject: 'Reset Password',
    message: `Click the following link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
  });

  res.status(200).json({ message: 'Reset password link sent successfully' });
});

// Reset password - Step 2: Set new password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Find the user by the reset token
  const user = await userModel.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpiry: { $gt: Date.now() }, // Check if the token is still valid
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Update the user's password and clear the reset token fields
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});


// Generate a unique token for password reset
exports.generateResetToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user with the given email
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate a unique reset token
  const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: '1h' });

  // Send an email with the reset link
  sendEmail({
    email: user.email,
    subject: 'Password Reset',
    html: `<p>Please click the following link to reset your password: <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>`,
  });

  res.status(200).json({ message: 'Password reset link sent to your email' });
});

// Handle reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.RESET_SECRET);

    // Find the user by the decoded userId
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});
