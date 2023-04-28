import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: "10m",
  });

  return token;
};

export const createRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "3h",
  });

  return token;
};

export const updateAccessToken = (req, res) => {
  const refreshToken = req.cookies["refreshtoken"];

  if (!refreshToken) {
    res.status(401).json({ error: "Вы не авторизированы" });
  } else {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
      if (!err) {
        console.log(decoded);
        const accessToken = createAccessToken(decoded.id);
        res.json({ accessToken });
      } else {
        res
          .status(401)
          .json({ error: "Refresh token истек, авторизация невозможна" });
      }
    });
  }
};

export const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshtoken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    path: "/",
    secure: true,
    httpOnly: true,
  });
};
