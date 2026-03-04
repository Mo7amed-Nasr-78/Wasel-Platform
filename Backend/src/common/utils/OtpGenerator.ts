export const OtpGenerator = (length: number = 6) => {
  const nums = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += nums[Math.floor(Math.random() * nums.length)];
  }
  return otp;
};
