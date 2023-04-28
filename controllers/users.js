import { pool } from "../database/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./tokens.js";

dotenv.config();

const __dirname = path.resolve();

export const registerUser = (req, res) => {
  console.log(req.body);

  const { name, email, password, country } = req.body;
  pool.query(
    `SELECT name, email from users WHERE email = '${req.body.email}'`,
    (error, results) => {
      if (!error) {
        if (results.length > 0) {
          res.status(409).json({
            error: `Пользователь с эмейлом ${email} уже был зарегистрирован`,
          });
        } else {
          const salt = bcrypt.genSaltSync(5);
          const hiddenPassword = bcrypt.hashSync(password, salt);
          console.log(hiddenPassword);

          pool.query(
            `INSERT INTO users (name, email, password, country) VALUES ('${name}','${email}', '${hiddenPassword}', '${country}')`,
            (error, results) => {
              if (!error) {
                res.json({ isSuccess: true });
              } else res.status(500).json({ error: error.message });
            }
          );
        }
      } else res.status(500).json({ error: error.message });
    }
  );
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  pool.query(
    `SELECT id, name, email, password, country, avatar from users WHERE email = '${email}' `,
    (error, results) => {
      if (!error) {
        if (results.length === 0) {
          res.status(404).json({
            error: `Пользователель с введенным  емайлом ${email} не найден!`,
          });
        } else {
          let user = results[0];
          let checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword) {
            res
              .status(400)
              .json({ error: "Неверный пароль, повторите попытку!" });
          } else {
            const accessToken = createAccessToken(user.id);

            const refreshToken = createRefreshToken(user.id);
            console.log("refresh", refreshToken);
            console.log(accessToken, "accessToken");
            sendRefreshToken(res, refreshToken);
            res.json({ user, accessToken });
          }
        }
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const getUserByToken = (req, res) => {
  const userId = req.userId;

  pool.query(
    `SELECT id, name, email, password, country, avatar from users WHERE users.id = '${userId}'`,
    (error, results) => {
      if (!error) {
        res.json({ user: results[0] });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updatePublicUserInfo = (req, res) => {
  try {
    const { name, email, country } = req.body;
    const userId = req.userId;
    const avatar = req.files.avatar;
    const avatarName = avatar.name;

    const insertName = `user${userId}` + avatarName;

    avatar.mv(
      path.resolve(__dirname, "Images", "UserAvatars", `user${userId}`) +
        avatarName,
      function (error) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: error });
        } else {
          pool.query(
            `UPDATE users SET name = '${name}', email = '${email}', country = '${country}', avatar = '${insertName}' WHERE users.id = ${userId}`,
            (error, results) => {
              if (!error) {
                res.json({ isInfoUpdated: true });
              } else {
                res.status(500).json({ error: error.message });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserPassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req.userId;

  pool.query(
    `SELECT id, name, email, country, password, avatar from users WHERE id = ${userId}`,
    (error, results) => {
      if (!error) {
        let userPassword = results[0].password;
        let checkPassword = bcrypt.compareSync(oldPassword, userPassword);
        if (checkPassword) {
          const hiddenPassword = bcrypt.hashSync(
            newPassword,
            bcrypt.genSaltSync(5)
          );

          pool.query(
            `UPDATE users SET password = '${hiddenPassword}' WHERE id = ${+userId}`,
            (error, results) => {
              if (!error) {
                res.json({ isInfoUpdated: true });
              } else res.status(500).json({ error: error.message });
            }
          );
        } else
          res.status(400).json({ error: "Неверный старый пароль от аккаунта" });
      } else res.status(500).json({ error: error.message });
    }
  );
};


export const logOut = (req, res)=>{
  res.clearCookie('refreshtoken');
  res.send('logout successful');
}


export const deleteUserAccount = (req, res) => {
  const user_id = req.params.user_id;

  pool.query(`DELETE from users WHERE id = ${+user_id}`, (error, results) => {
    if (!error) {
      res.json({ isAccountDeleted: true });
    } else res.status(500).json({ error: error.message });
  });
};
