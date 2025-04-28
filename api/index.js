import express from "express";
import dotenv from "dotenv";
import DBConnect from "../DBModel/DBConnection.js";
import cors from "cors";
import bodyParser from "body-parser";
import expensesAPI from "../routes/expenses/index.js";
import userAPI from "../routes/user/index.js";
import organizationAPI from '../routes/organization/index.js';
import expenseFeildAPI from "../routes/ExpenseField/index.js";
import requestAPI from "../routes/Request/index.js";
import privateConfig from "../Config/routeConfig.js";
import passport from "passport";
import session from "express-session";
import serverless from "serverless-http"; // ADD THIS

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
app.use(session({
    secret: "newProject",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());

app.get("/", (req, res) => res.redirect('https://expensewisee.vercel.app/'));

app.use("/expenses", expensesAPI);
app.use("/user", userAPI);
app.use("/organization", organizationAPI);
app.use("/field", expenseFeildAPI);
app.use("/request", requestAPI);

try {
    await DBConnect(); // Ensure DB connection happens once function is called
    console.log("connected to database");

} catch (error) {
    console.log("Error while connecting DB", error);

}

export default serverless(app); // ✅ correct

