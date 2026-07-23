import bcrypt from "bcryptjs";
import { User } from "#modules/users/user.model.js";
import CustomError from "#shared/errors/CustomError.util.js";
import jwt from "jsonwebtoken";
import { verifyEmail } from "#shared/services/verifyEmail.js";
import { Session } from "#modules/auth/session.model.js";
import { sendOTPMail } from "#shared/services/sendOTPMail.js";
import cloudinary from "#config/cloudinary.config.js";
import generateOtp from "#shared/utils/generateOtp.util.js";
import generateToken from "#shared/services/generateToken.util.js";

export const registerService = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  //check if anything is missing while registering
  if (!firstName || !lastName || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }

  //check if user already exists in the database
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError("User already exists", 409);
  }

  //Hashing for password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);

  //Now, we create user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  //Generating TOKEN
  // const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
  //   expiresIn: "10m",
  // });

  const token = generateToken({ id: newUser._id, expiry: "10m" });

  if (!token) throw new CustomError("Token is missing");

  //Send the verification Email
  await verifyEmail(token, newUser.email);

  //We pass token to the new user
  newUser.token = token;

  await newUser.save();

  /*Removing password before sending response */
  newUser.password = undefined;
  // const userResponse = newUser.toObject();
  // delete userResponse.password;
  // return userResponse;

  return newUser;
};

export const verifyService = async ({ token }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("The registration token has expired", 400);
    }

    throw new CustomError("Token verification failed", 400);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.token = null;
  user.isVerified = true;
  await user.save();

  return true;
};

export const reVerifyService = async ({ email }) => {
  //Find user in database
  const user = await User.findOne({ email });

  //Handle usernot found
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  //Generate the token again send email, provide new token to user in DB and save

  // const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
  //   expiresIn: "10m",
  // });

  const token = generateToken({ id: user._id, expiry: "10m" });

  verifyEmail(token, email); //sends email for verification again
  user.token = token;
  await user.save();

  return user.token;
};

export const loginService = async ({ email, password }) => {
  //check for missing details
  if (!email || !password) {
    throw new CustomError("All fields are required!", 400);
  }

  //check if user exists in the database
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new CustomError("Invalid Email or password!", 404);
  }

  //check password is valid or not
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid Credentials!", 401);
  }

  //Check if password valid but user not verified
  if (existingUser.isVerified === false) {
    throw new CustomError("Verify account and then login", 400);
  }

  //Generate access token and reference token
  // const accessToken = jwt.sign(
  //   { id: existingUser._id },
  //   process.env.SECRET_KEY,
  //   { expiresIn: "10d" },
  // );

  const accessToken = generateToken({ id: existingUser._id, expiry: "10d" });

  // const refreshToken = jwt.sign(
  //   { id: existingUser._id },
  //   process.env.SECRET_KEY,
  //   { expiresIn: "30d" },
  // );

  const refreshToken = generateToken({ id: existingUser._id, expiry: "30d" });

  existingUser.isLoggedIn = true;
  await existingUser.save();

  //check for existing session if it exists then delete it
  const existingSession = await Session.findOne({ userId: existingUser._id });
  if (existingSession) {
    await Session.deleteOne({ userId: existingUser._id });
  }

  //create a new session for user
  await Session.create({ userId: existingUser._id });

  return { existingUser, accessToken, refreshToken };
};

export const logoutService = async ({ userId }) => {
  await Session.deleteMany({ userId });
  await User.findByIdAndUpdate(userId, { isLoggedIn: false });

  return true;
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const { otp, otpExpiry } = generateOtp();

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save();

  await sendOTPMail(otp, email);

  return true;
};

export const verifyOTPService = async ({ otp, email }) => {
  if (!otp) {
    throw new CustomError("OTP is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new CustomError("OTP is not generated or already verified", 400);
  }

  if (user.otpExpiry < new Date()) {
    throw new CustomError("OTP Expired. Please request a new OTP.", 400);
  }

  if (otp !== user.otp) {
    throw new CustomError("OTP is invalid", 400);
  }

  user.otp = null;
  user.optExpiry = null;

  await user.save();

  return true;
};

export const changePasswordService = async ({
  newPassword,
  confirmPassword,
  email,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!newPassword || !confirmPassword) {
    throw new CustomError("All fields are required", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError("Passwords do not match", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return true;
};
