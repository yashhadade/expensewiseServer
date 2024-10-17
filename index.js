import express from "express";
import dotenv from "dotenv";
import DBConnect from "./DBModel/DBConnection.js"
import cors from "cors";
import bodyParser from "body-parser";
import expensesAPI from "./API/expenses/index.js"
import userAPI from "./API/user/index.js";
import organizationAPI from './API/organization/index.js';
import expenseFeildAPI from "./API/ExpenseField/index.js"
import privateConfig from "./Config/routeConfig.js";
import passport from "passport";
import session from "express-session";


dotenv.config();

const app = express();
privateConfig(passport);
app.use(express.json());
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(session({ secret: "newProject" }));
app.use(bodyParser.json());
app.use("/expenses", expensesAPI);
app.use("/user", userAPI);
app.use("/organization", organizationAPI);
app.use("/field", expenseFeildAPI)

app.listen(8000, () => {
    DBConnect().then(() => {
        console.log("server connected");
    }).catch((error) => {
        console.error(error);
    })
    console.log(`Server Started at ${3000}`)
})