import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import expensesAPI from "../routes/expenses/index.js"
import userAPI from "../routes/user/index.js";
import organizationAPI from '../routes/organization/index.js';
import expenseFeildAPI from "../routes/ExpenseField/index.js";
import requestAPI from "../routes/Request/index.js";
import privateConfig from "../Config/routeConfig.js";
import passport from "passport";
import session from "express-session";
import DBConnection from "../DBModel/DBConnection.js";
import serverless from "serverless-http";

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
app.use("/request", requestAPI)

// app.use("/", (req, res) => {
//     res.redirect('https://expensewisee.vercel.app/');
// })

DBConnection().then(() => {
    console.log("✅ DB Connected");
}).catch((error) => {
    console.error("❌ DB Connection Error:", error);
});

export const handler = serverless(app);