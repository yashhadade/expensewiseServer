
import mongoose from "mongoose";
import { ExpensesFieldModel } from "../../DBModel/ExpenseFieldModel/index.js";
import { expenseModal } from "../../DBModel/expenseModal/index.js";
import express from "express";
import passport from "passport";
const Router = express.Router();


Router.post("/:id/addexpense", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        const feildExist = await ExpensesFieldModel.findById(id);
        if (!feildExist) return res.status(404).json({ message: "Feild not found first create feild" })
        req.body.feildId = id;
        const newExpense = await expenseModal.create(req.body);
        return res.status(201).json({ status: "expense Created", newExpense })
    } catch (error) {
        return res.status(400).json({ status: "somthing went wrong", error: error.message })
    }
})

Router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fieldExist = await ExpensesFieldModel.findById(id);
        if (!fieldExist) return res.status(404).json({ message: "Feild not found first create feild" })


        const expensesList = await expenseModal.find({ fieldId: new mongoose.Types.ObjectId(id) });

        return res.status(201).json({ expensesList })
    } catch (error) {
        return res.status(400).json({ status: "Somthing went wrong", error: error.message })
    }
})

Router.delete("/deleteExpense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await expenseModal.findByIdAndDelete(id);
        await commanExpenseFieldModal.findOneAndDelete({ expenseId: id })
        return res.status(200).json({ status: 'deleted succesfully' })
    } catch (error) {
        return res.status(400).json({ status: "Somthing went wrong", error: error.message })
    }
})

Router.put("/udpateExpense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const oldData = req.body;

        const updatedExpenses = await expenseModal.findByIdAndUpdate(id, oldData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        return res.status(201).json({ status: "Expense updated succesfully", updatedExpenses })
    } catch (error) {
        return res.status(400).json({ status: "Somthing went wrong", error: error.message })
    }
})

export default Router