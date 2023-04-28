import { Router } from "express";

import { verifyToken } from "../middlewares/auth.js";
import * as ProductController from "../controllers/products.js";

const router = Router();

router.get("/:user_id", ProductController.getAllUserProducts);
router.get("/categories/all", ProductController.getProductsCategories);
router.get("/search/:user_id", ProductController.searchProducts);
router.post("/", verifyToken, ProductController.addUserProduct);
router.delete("/:product_id", verifyToken, ProductController.deleteProduct);
router.patch("/", verifyToken, ProductController.updateUserProduct);

export default router;
