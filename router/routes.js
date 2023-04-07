import { Router } from "express";


import * as UserController from "../controllers/users.js";

import * as ProductController from "../controllers/products.js";

import * as NotesController from "../controllers/notes.js";

import * as ClientsController  from "../controllers/clients.js";


const router = Router();

router.get("/api/Products/:user_id", ProductController.getAllUserProducts);
router.get("/api/ProductCategories", ProductController.getProductsCategories);
router.get("/api/Notes/:user_id", NotesController.getUserNotes);
router.get("/api/FetchUser", UserController.getUserByToken);
router.get("/api/Clients/:user_id",ClientsController.getAllClients);


router.post("/api/Registration", UserController.registerUser);
router.post("/api/Login", UserController.loginUser);
router.post("/api/Products", ProductController.addUserProduct);
router.post("/api/Notes",NotesController.addNote);
router.post("/api/Clients", ClientsController.addClient);


router.patch("/api/UpdateUserInfo", UserController.updatePublicUserInfo);
router.patch("/api/UpdateUserPassword", UserController.updateUserPassword);
router.patch("/api/Products", ProductController.updateUserProduct);
router.patch("/api/Notes", NotesController.updateUserNote);
router.patch("/api/Clients", ClientsController.updateClient);


router.delete("/api/DeleteAccount/:user_id", UserController.deleteUserAccount);
router.delete("/api/Products/:product_id", ProductController.deleteProduct);
router.delete("/api/Notes/:note_id", NotesController.deleteNote);
router.delete("/api/Clients/:client_id", ClientsController.deleteClient);


export { router };
