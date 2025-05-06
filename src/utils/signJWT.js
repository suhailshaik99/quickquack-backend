import jwt from "jsonwebtoken";

function signJWT(payload, JWT_Secret, expiresIn) {
  const token = jwt.sign(payload, JWT_Secret, { expiresIn });
  return token;
};

export default signJWT;
