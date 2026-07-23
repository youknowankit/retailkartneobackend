const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10min expiry
  return { otp, otpExpiry };
};

export default generateOtp;
