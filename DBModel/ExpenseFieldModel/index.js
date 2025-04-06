import mongoose from "mongoose";


const fieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
    },
    RecivedAmount: {
        type: Number,
    },
    balance: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    expiry: {
        type: String
    },
    fieldType: {
        type: String,
        enum: ['Personal', 'Team', 'Home','Primary'],
        default: 'Personal'
    },
    // teamFieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
    // expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    members: [
        {
            memberId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            role: {
                type: String,
                default: "member"
            }
        },
    ],
    // membersExpenses: [
    //     {
    //         memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    //         expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    //         status: { type: String, enum: ['Pending', 'Approve', 'Rejected'], default: 'Pending' }
    //     }
    // ],
 
},
    { timestamps: true }
)


export const ExpensesFieldModel = mongoose.model("ExpenseField", fieldSchema) 