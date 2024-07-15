import { expenseModal } from "../../DBModel/expenseModal/index.js";
import express from "express";
const Router = express.Router();


Router.post("/addexpense", async (req, res) => {
    try {
        console.log(req.body);
        const newExpense = await expenseModal.create(req.body);
        return res.status(201).json({ status: "expense Created", newExpense })
    } catch (error) {
        return res.status(400).json({ status: "somthing went wrong", error: error.message })
    }
})

Router.get("/", async (req, res) => {
    try {
        const expensesList = await expenseModal.find();

        return res.status(201).json({ expensesList })
    } catch (error) {
        return res.status(400).json({ status: "Somthing went wrong", error: error.message })
    }
})

Router.delete("/deleteExpense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await expenseModal.findByIdAndDelete(id);
        return res.status(200).json({ status: 'deleted succesfully' })
    } catch (error) {
        return res.status(400).json({ status: "Somthing went wrong", error: error.message })
    }
})

Router.put("/udpateExpense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const oldData  = req.body;
        console.log(req.body);

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