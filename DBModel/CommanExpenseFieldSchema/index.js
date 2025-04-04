import mongoose, { Schema } from "mongoose";

const commanExpenseFieldSchema = new mongoose.Schema(
    {
        fieldId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "expensefields"
        },
        expenseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "expenses"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        isFixed: {
            type: Boolean,
            default: false
        }
    },

)

export const commanExpenseFieldModal = mongoose.model("commanExpnseField", commanExpenseFieldSchema)