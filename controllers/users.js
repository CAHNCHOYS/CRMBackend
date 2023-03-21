import { pool } from "../database/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const JWT_KEY = "CRMApp";
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
            let token = jwt.sign({ ...user }, JWT_KEY, { expiresIn: "2h" });
            res.json({ userTokenData: { user, token } });
          }
        }
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const verifyUserToken = (req, res) => {
  const token = req.body.token;

  jwt.verify(token, JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ error: err.message });
    } else {
      res.json({ userData: decoded });
    }
  });
};

export const updateUserToken = (req, res) => {
  const { id } = req.body;

  pool.query(
    `SELECT id, name, email, password, country, avatar from users WHERE id = '${+id}'`,
    (error, results) => {
      if (!error) {
        let user = results[0];
        console.log(user);

        let token = jwt.sign({ ...user }, JWT_KEY, { expiresIn: "2h" });
        res.json({ userTokenData: { user, token } });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const updatePublicUserInfo = (req, res) => {
  try {
    const { name, email, country, id } = req.body;

    const avatar = req.files.avatar;
    const avatarName = avatar.name;

    console.log(avatar);
    console.log(avatarName);
    const insertName = `user${id}` + avatarName;
    console.log(path.resolve(__dirname, "Images", "UserAvatars"));

    avatar.mv(
      path.resolve(__dirname, "Images", "UserAvatars", `user${id}`) +
        avatarName,
      function (error) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: error  });
        } else {
          pool.query(
            `UPDATE users SET name = '${name}', email = '${email}', country = '${country}', avatar = '${insertName}' WHERE users.id = ${+id}`,
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
  const { oldPassword, newPassword, id } = req.body;
  console.log(oldPassword, newPassword, id);

  pool.query(
    `SELECT id, name, email, country, password, avatar from users WHERE id = ${+id}`,
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
            `UPDATE users SET password = '${hiddenPassword}' WHERE id = ${+id}`,
            (error, results) => {
              if (!error) {
                res.json({ isInfoUpdated: true });
              } else res.status(500).json({ error: error.message });
            }
          );
        } else res.status(400).json({ error: "Неверный старый пароль от аккаунта" });
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
