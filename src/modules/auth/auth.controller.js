import asyncHandler from "#middleware/async.middleware.js";
import {
  changePasswordService,
  forgotPasswordService,
  loginService,
  logoutService,
  registerService,
  reVerifyService,
  verifyOTPService,
  verifyService,
} from "./auth.service.js";
import successResponse from "#shared/utils/apiResponse.util.js";

//REGISTER USER
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const data = await registerService({
    firstName,
    lastName,
    email,
    password,
  });

  successResponse(res, "User registered successfully", data, 201);
});

//VERIFY USER
export const verify = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Auth token is missing or invalid", 400);
  }

  /*AuthHeader looks like 
    "[Bearer asds23adasdasd....]-Array" 
    index=0=>Bearer 
    index=1 =>token(asds23adasdasd....)
    
    So, basically we are extracting a token
    */
  const token = authHeader.split(" ")[1];

  const data = await verifyService({ token });

  successResponse(res, "Email verified successfully", data, 200);
});

//RE-VERIFY USER ----functionality not added to frontend
export const reVerify = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const data = await reVerifyService({ email });

  successResponse(res, "Verification email resent successfully", data, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "Verification Email resent successfully!",
  //   token: userToken,
  // });
});

//LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await loginService({
    email,
    password,
  });

  successResponse(
    res,
    `Welcome back ${data.existingUser.firstName}!`,
    data,
    200,
  );
});

//LOGOUT
export const logout = asyncHandler(async (req, res) => {
  //We are getting userId from req.id which we assigned in middleware
  const userId = req.id;
  const data = await logoutService({ userId });

  successResponse(res, "You are successfully logged out", data, 200);
});

//FORGOT PASSWORD ----functionality not added to frontend
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const data = await forgotPasswordService({ email });

  successResponse(res, "OTP sent to email successfully", data, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "OTP sent to email successfully",
  //   data: status,
  // });
});

//VERIFY OTP ----functionality not added to frontend
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  const data = await verifyOTPService({ otp, email });

  successResponse(res, "OTP verified successfully", data, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "OTP verified successfully",
  //   data: status,
  // });
});

//CHANGE PASSWORD ----functionality not added to frontend
export const changePassword = asyncHandler(async (req, res) => {
  //To change password we need new password and confirm password
  const { newPassword, confirmPassword } = req.body;
  const { email } = req.params;

  const data = await changePasswordService({
    newPassword,
    confirmPassword,
    email,
  });

  successResponse(res, "Password changed successfully", data, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "Password changed successfully!",
  //   data: status,
  // });
});
