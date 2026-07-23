import jwt from "jsonwebtoken";

const generateToken = ({id, expiry}) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expiry });
};

export default generateToken;
