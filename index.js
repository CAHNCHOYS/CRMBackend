import express, { json } from "express";
import cors from 'cors';
import { router } from "./router/index.js";
import  path from 'path';
import fileUpload from "express-fileupload"

const app = express();

const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());
app.use(fileUpload());
app.use(router);


const __dirname = path.resolve();


app.use(express.static(path.resolve(__dirname, "Images")));




app.get("/", (req, res) => {
    res.json("Main page");
});

app.listen(PORT, () => {
  console.log("server is running on PORT " + PORT);
});


