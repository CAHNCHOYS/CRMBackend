import express, { json } from "express";
import cors from "cors";

import path from "path";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import productsRoutes from "./router/products.js";
import customersRoutes from "./router/customers.js";
import ordersRoutes from "./router/orders.js";
import notesRoutes from "./router/notes.js";
import authRoutes from "./router/auth.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(json());
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5173","https://cahnchoys.github.io/CRMAdminDelpoy"],
  })
);
app.use(fileUpload());

app.use(cookieParser());

app.use("/api/Auth", authRoutes);
app.use("/api/Products", productsRoutes);
app.use("/api/Customers", customersRoutes);
app.use("/api/Orders", ordersRoutes);
app.use("/api/Notes", notesRoutes);


const __dirname = path.resolve();
app.use(express.static(path.resolve(__dirname, "Images")));

app.get("/", (req, res) => {
  res.json("Main page");
});

app.listen(PORT, () => {
  console.log("server is running on PORT " + PORT);
});
