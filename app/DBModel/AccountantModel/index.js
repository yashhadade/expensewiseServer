import mongoose from "mongoose";


const accountantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        }
    },
    {
        timestamps: true
    }
)

export const accountantModel = mongoose.model("Accountant", accountantSchema); 
