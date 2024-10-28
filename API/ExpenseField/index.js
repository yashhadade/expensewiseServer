import express from "express";
import passport from "passport";
import { ExpensesFieldModel } from "../../DBModel/ExpenseFieldModel/index.js";
import { userModel } from "../../DBModel/userModal/index.js";
const Router = express.Router();

Router.post("/createField", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.user;
        req.body.userId = _id

        const response = await ExpensesFieldModel.create(req.body)
        return res.status(200).json({ message: "field created", response: response })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})

Router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id } = req.user;

    try {
        const userExist = await userModel.findById(_id);
        if (!userExist) return res.status(404).json({ message: "user dose not exist" });

        const expenseField = await ExpensesFieldModel.find({ userId: _id });
        if (!expenseField) return res.status(404).json({ message: "Add Expese field " })

        return res.status(202).json({ expenseField })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})

Router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { id } = req.params
        const fieldExist = await ExpensesFieldModel.findById(id);
        if (!fieldExist) return res.status(404).json({ message: "Feild does not exist" })

        await ExpensesFieldModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Field deleted successfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})

Router.put("/:id/update", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {

        const { id } = req.params;
        const fieldExist = await ExpensesFieldModel.findById(id);
        if (!fieldExist) return res.status(404).json({ message: "Feild does not exist" })

        const response = await ExpensesFieldModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        return res.status(200).json({ message: "field created", response: response })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})
export default Router