import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// @desc Register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, rollNumber, department } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, "Email already registered");

  const allowedRole = ["student", "teacher"].includes(role) ? role : "student";

  const user = await User.create({
    name,
    email,
    password,
    role: allowedRole,
    rollNumber,
    department,
  });

  const token = generateToken(user._id);
  res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(201, { user, token }, "Registered successfully"));
});

// @desc Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, "Invalid credentials");

  const token = generateToken(user._id);
  user.password = undefined;

  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});


// @desc Logout
export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, null, "Logged out"));
});

// @desc Current user
export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user));
});

// @desc Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  // TODO: Send reset token through email in production

  res.status(200).json(
    new ApiResponse(
      200,
      { resetToken },
      "Reset token generated"
    )
  );
});


// @desc Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Password reset successful"
    )
  );
});

// @desc Contact admin
export const contactAdmin = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!message) throw new ApiError(400, "Message required");
  // TODO: save + email admin
  res.json(new ApiResponse(200, { name, email, subject, message }, "Message sent to admin"));
});