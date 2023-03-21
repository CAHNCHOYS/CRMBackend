import { Router } from "express";


import * as UserController from "../controllers/users.js";

import * as ProductController from "../controllers/products.js";


const router = Router();

router.get("/api/AllUserProducts/:user_id", ProductController.getAllUserProducts);
router.get("/api/ProductCategories", ProductController.getProductsCategories);



router.post("/api/Registration", UserController.registerUser);
router.post("/api/Login", UserController.loginUser);
router.post("/api/VerifyToken", UserController.verifyUserToken);
router.post("/api/AddProduct", ProductController.addUserProduct);


router.patch("/api/UpdateToken", UserController.updateUserToken);
router.patch("/api/UpdateUserInfo", UserController.updatePublicUserInfo);
router.patch("/api/UpdateUserPassword", UserController.updateUserPassword);
router.patch("/api/UpdateUserProduct", ProductController.updateUserProduct);


router.delete("/api/DeleteAccount/:user_id", UserController.deleteUserAccount);
router.delete("/api/DeleteProduct/:product_id", ProductController.deleteProduct);


export { router };
