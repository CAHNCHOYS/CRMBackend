import { pool } from "../database/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

import dotenv from "dotenv";

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
  console.log(req.body);

  pool.query(
    `SELECT id, name, email, password, country, avatar from users WHERE email = '${email}' `,
    (error, results) => {
      if (!error) {
        if (results.length === 0) {
          res.status(404).json({
            error: `Пользователель с введенным 
          емайлом ${email} не найден!`,
          });
        } else {
          let user = results[0];
          let checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword) {
            res
              .status(400)
              .json({ error: "Неверный пароль, повторите попытку!" });
          } else {
            let token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
              expiresIn: "2h",
            });
            res.json({ user, token });
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
  try {
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
      if (err) {
        res.status(401).json({
          error:
            "Токен не валиден! Пароль был обновлен, но при следующем заходе придется вводить данные заново",
        });
      } else {
        pool.query(
          `SELECT id, name, email, password, country, avatar from users WHERE users.id = '${decoded.id}'`,
          (error, results) => {
            if (!error) {
              res.json({ user: results[0] });
            } else {
              console.log(error);
              res.status(500).json({ error: error.message });
            }
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePublicUserInfo = (req, res) => {
  try {
    const { name, email, country } = req.body;
    const userId = req.userId;
    const avatar = req.files.avatar;
    const avatarName = avatar.name;

    const insertName = `user${userId}` + avatarName;
    console.log(path.resolve(__dirname, "Images", "UserAvatars"));

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

export const deleteUserAccount = (req, res) => {
  const user_id = req.params.user_id;

  pool.query(`DELETE from users WHERE id = ${+user_id}`, (error, results) => {
    if (!error) {
      res.json({ isAccountDeleted: true });
    } else res.status(500).json({ error: error.message });
  });
};
