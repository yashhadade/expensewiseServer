import mongoose from "mongoose";


const fieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,

    },
    expenses: [{
        expensesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "expenses"
        }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    { timestamps: true }
)


export const ExpensesFieldModel = mongoose.model("ExpenseField", fieldSchema) 