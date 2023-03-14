import { Router } from "express";

import {
  registerUser,
  loginUser,
  verifyUserToken,
  updatePublicUserInfo,
  updateUserToken,
  updateUserPassword,
  deleteUserAccount,
} from "../controllers/users.js";

import {getAllUserProducts, deleteProduct, getProductsCategories, updateUserProduct, addUserProduct} from "../controllers/products.js";


const router = Router();

router.get("/api/AllUserProducts/:user_id", getAllUserProducts);
router.get("/api/ProductCategories",getProductsCategories);



router.post("/api/Registration", registerUser);
router.post("/api/Login", loginUser);
router.post("/api/VerifyToken", verifyUserToken);
router.post("/api/AddProduct", addUserProduct);


router.patch("/api/UpdateToken", updateUserToken);
router.patch("/api/UpdateUserInfo", updatePublicUserInfo);
router.patch("/api/UpdateUserPassword", updateUserPassword);
router.patch("/api/UpdateUserProduct", updateUserProduct);


router.delete("/api/DeleteAccount/:user_id", deleteUserAccount);
router.delete("/api/DeleteProduct/:product_id", deleteProduct);


export { router };
