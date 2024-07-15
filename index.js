import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import DBConnect from "./DBModel/DBConnection.js"
import cors from "cors";
import bodyParser from "body-parser";
import expensesAPI from "./API/expenses/index.js"
dotenv.config();

const app = express();

app.use(express.json());
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/expenses", expensesAPI);

app.listen(8000, () => {
    DBConnect().then(() => {
        console.log("server connected");
    }).catch((error) => {
        console.error(error);
    })
    console.log(`Server Started at ${3000}`)
})