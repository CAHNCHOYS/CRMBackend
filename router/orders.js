import * as OrdersContoller from "../controllers/orders.js";
import { Router } from "express";

import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/:user_id", OrdersContoller.getAllOrders);
router.get("/search/:user_id", OrdersContoller.searchOrders);
router.post("/", verifyToken, OrdersContoller.addOrder);
router.patch("/", verifyToken, OrdersContoller.updateOrder);
router.delete("/:order_id", verifyToken, OrdersContoller.deleteOrder);

export default router;
