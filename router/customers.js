import { Router } from "express";

import { verifyToken } from "../middlewares/auth.js";
import * as CustomersController from "../controllers/customers.js";

const router = Router();

router.get("/:user_id", CustomersController.getAllClients);
router.get("/search/:user_id", CustomersController.searchClients);
router.post("/", verifyToken, CustomersController.addClient);
router.patch("/", verifyToken, CustomersController.updateClient);
router.delete("/:customer_id", verifyToken, CustomersController.deleteClient);

export default router;
