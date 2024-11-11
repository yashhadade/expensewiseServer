import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    fieldName: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    requesedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    teamFieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExpenseField",
    },
    sanctionAmount: { type: Number },
    role: { type: String },
}, {
    timestamps: true
});

export const RequestModel = mongoose.model("requestfield", requestSchema)
