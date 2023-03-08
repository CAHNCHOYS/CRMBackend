import { Router } from "express";

import { registerUser, loginUser, verifyUserToken, updatePublicUserInfo } from "../controllers/users.js";

const router = Router();


router.post("/api/registration", registerUser);
router.post("/api/login", loginUser);
router.post("/api/verifyToken", verifyUserToken);

router.post("/api/updatePublicInfo", updatePublicUserInfo);


export { router };
