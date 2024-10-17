import express from "express";
import passport from "passport";
import { ExpensesFieldModel } from "../../DBModel/ExpenseFieldModel/index.js";

const Router = express.Router();

Router.post("/createField", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.user;
        const { fieldName } = req.body

        const response = await ExpensesFieldModel.create({
            fieldName: fieldName,
            userId: _id
        })
        return res.status(200).json({ response })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})


export default Router