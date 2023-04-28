import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    if (!header) {
      res.status(401).json({ error: "Не авторизирован!" });
    } else {
      const bearerToken = header.split(" ")[1];
      console.log(bearerToken, "access token from verify auth");
      jwt.verify(bearerToken, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if (!err) {
          req.userId = decoded.id;
          next();
        } else {
          res.status(403).json({
            error: "Срок авторизации истек, пожалуйста, авторизируйтесь снова",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
