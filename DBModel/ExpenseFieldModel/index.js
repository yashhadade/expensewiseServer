import mongoose from "mongoose";
import { strategies } from "passport";


const fieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
    },
    RecivedAmount: {
        type: Number,
    },
    balance: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    { timestamps: true }
)


export const ExpensesFieldModel = mongoose.model("ExpenseField", fieldSchema) 