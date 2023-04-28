import * as UserController from "../controllers/users.js";
import { verifyToken } from "../middlewares/auth.js";

import { updateAccessToken } from "../controllers/tokens.js";
import { Router } from "express";

const router = Router();

router.get("/FetchUser", verifyToken, UserController.getUserByToken);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logOut);
router.patch(
  "/UpdateUserInfo",
  verifyToken,
  UserController.updatePublicUserInfo
);
router.patch(
  "/UpdateUserPassword",
  verifyToken,
  UserController.updateUserPassword
);

router.patch("/refresh", updateAccessToken);

router.delete(
  "/delete/:user_id",
  verifyToken,
  UserController.deleteUserAccount
);

export default router;
