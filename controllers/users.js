import { pool } from "../database/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const JWT_KEY = "CRMApp";
const __dirname = path.resolve();

export const registerUser = (req, res) => {
  console.log(req.body);

  const { name, email, password, city } = req.body;
  pool.query(
    `SELECT name, email from users WHERE email = '${req.body.email}'`,
    (error, results) => {
      if (!error) {
        if (results.length > 0) {
          res.status(500).json({ isUserAlreadyRegistered: true });
        } else {
          console.log(password);
          const salt = bcrypt.genSaltSync(5);
          const hiddenPassword = bcrypt.hashSync(password, salt);
          console.log(hiddenPassword);

          pool.query(
            `INSERT INTO users (name, email, password, city) VALUES ('${name}','${email}', '${hiddenPassword}', '${city}')`,
            (error, results) => {
              if (!error) {
                res.json({ isSuccess: true });
              } else {
                res.json({ error: error.message });
              }
            }
          );
        }
      } else res.status(500).json({ error: error.message });
    }
  );
};

export const loginUser = (req, res) => {
  const { email, password, isUpdatingData } = req.body;
  console.log(req.body);

  pool.query(
    `SELECT id, name, email, password, city, avatar from users WHERE email = '${email}' `,
    (error, results) => {
      if (!error) {
        if (results.length === 0) {
          res.json({ isNoExistEmail: true });
        } else {
          let user = results[0];

          if (isUpdatingData) {

            let token = jwt.sign({ ...user }, JWT_KEY, { expiresIn: "2h" });
            res.json({ loginData: { user, token } });

          } else {
            let checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
              res.json({ isWrongPassword: true });
            } else {
              let token = jwt.sign({ ...user }, JWT_KEY, { expiresIn: "2h" });

              res.json({ loginData: { user, token } });
            }
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
      res.json({ isInvalidToken: true });
    } else {
      res.json({ userData: decoded });
    }
  });
};

export const updatePublicUserInfo = (req, res) => {
  const { name, email, city, id } = req.body;

  const avatar = req.files.avatar;
  const avatarName = avatar.name;

  console.log(avatar);
  console.log(avatarName);
  const insertName = `user${id}` + avatarName;
  console.log(path.resolve(__dirname, "Images", "UserAvatars"));

  avatar.mv(
    path.resolve("Images", "UserAvatars", `user${id}`) + avatarName,
    function (error) {
      if (error) {
        console.log(error);
        res.json({ error });
      } else {
        pool.query(
          `UPDATE users SET name = '${name}', email = '${email}', city = '${city}', avatar = '${insertName}' WHERE users.id = ${+id}`,
          (error, results) => {
            if (!error) {
              res.json({ isInfoUpdated: true });
            } else {
              res.json({ error: error.message });
            }
          }
        );
      }
    }
  );
};

const updateUserPassword = (req, res)=>{
    
  res.json({isPasswordUpdated: true});

}
