import { Router } from "express";

import { verifyToken } from "../middlewares/auth.js";

import * as UserController from "../controllers/users.js";

import * as ProductController from "../controllers/products.js";

import * as NotesController from "../controllers/notes.js";

import * as CustomersController  from "../controllers/customers.js";

import * as OrdersContoller from "../controllers/orders.js";

const router = Router();

//router.get("/api/Products/:user_id", ProductController.getAllUserProducts);
//router.get("/api/ProductCategories", ProductController.getProductsCategories);
//router.get("/api/Notes/:user_id", NotesController.getUserNotes);
router.get("/api/FetchUser", UserController.getUserByToken);
//router.get("/api/Clients/:user_id",CustomersController.getAllClients);
//router.get("/api/SearchProducts/:user_id", ProductController.searchProducts);
//router.get("/api/SearchClients/:user_id", CustomersController.searchClients);
//router.get("/api/SearchOrders/:user_id", OrdersContoller.searchOrders);
//router.get("/api/Orders/:user_id", OrdersContoller.getAllOrders);

router.post("/api/Registration", UserController.registerUser);
router.post("/api/Login", UserController.loginUser);
//router.post("/api/Products",verifyToken, ProductController.addUserProduct);
//router.post("/api/Notes", NotesController.addNote);
//router.post("/api/Clients",verifyToken, CustomersController.addClient);
//router.post("/api/Orders", verifyToken, OrdersContoller.addOrder);


router.patch("/api/UpdateUserInfo", verifyToken,UserController.updatePublicUserInfo);
router.patch("/api/UpdateUserPassword",verifyToken, UserController.updateUserPassword);
//router.patch("/api/Products", verifyToken,ProductController.updateUserProduct);
//router.patch("/api/Notes", NotesController.updateUserNote);
//router.patch("/api/Clients", verifyToken, CustomersController.updateClient);
//router.patch("/api/Orders", verifyToken,  OrdersContoller.updateOrder);


router.delete("/api/DeleteAccount/:user_id", UserController.deleteUserAccount);
//router.delete("/api/Products/:product_id", verifyToken , ProductController.deleteProduct);
//router.delete("/api/Notes/:note_id", NotesController.deleteNote);
//router.delete("/api/Clients/:client_id", verifyToken,  CustomersController.deleteClient);
//router.delete("/api/Orders/:order_id",verifyToken, OrdersContoller.deleteOrder)


export { router };
