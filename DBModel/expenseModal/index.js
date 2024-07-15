import moment from "moment";
import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
    {
        desc: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,

        },
        qyt: {
            type: Number,

        },
        price: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true,
            validate: {
                validator: (val) => moment(val, 'YYYY-MM-DD', true).isValid(),
                message: 'Invalid date format, should be YYYY-MM-DD'
            }
        }
    }
)

export const expenseModal = mongoose.model("Expense", expensesSchema);  