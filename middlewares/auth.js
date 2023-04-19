import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    console.log(process.env.JWT_KEY);
    const header = req.headers["authorization"];

    const bearerToken = header.split(" ")[1];
    console.log(bearerToken);
    jwt.verify(bearerToken, process.env.JWT_KEY, (err, decoded) => {
      if (!err) {
        console.log(decoded);
        req.userId = decoded.id;
        next();
      } else {
        res
          .status(401)
          .json({
            error: "Срок авторизации истек, пожалуйста, авторизируйтесь снова",
          });
      }
    });
  } catch (error) {
    res
    .status(500)
    .json({
      error: error.message,
    });
  }
};
