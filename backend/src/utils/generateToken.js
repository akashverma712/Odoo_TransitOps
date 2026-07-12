import jwt from "jsonwebtoken";

const generateToken = (organizationId) => {
  return jwt.sign(
    { id: organizationId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;