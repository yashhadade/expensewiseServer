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
    },
    fieldType: {
        type: String,
        enum: ['Personal', 'Team', 'Home'],
        default: 'Personal'
    },
    teamFieldId:{type:mongoose.Schema.Types.ObjectId, ref:"Expense"},
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    membersExpenses: [
        {
            memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
            status: { type: String, enum: ['Pending', 'Approve', 'Rejected'], default: 'Pending' }
        }
    ]


},
    { timestamps: true }
)


export const ExpensesFieldModel = mongoose.model("ExpenseField", fieldSchema) 