import express from "express";
import { userModel } from "../../DBModel/userModal/index.js";
import passport from "passport";
import { RequestModel } from "../../DBModel/RequestModel/index.js";
import { ExpensesFieldModel } from "../../DBModel/ExpenseFieldModel/index.js";
import { expenseModal } from "../../DBModel/expenseModal/index.js";

const Router = express.Router();

Router.post(
    "/sendrequest/:fieldId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { fieldId } = req.params;

        const { email, sanctionAmount, role, fieldName } = req.body;
        req.body.requesedBy = req.user._id;
        req.body.teamFieldId = fieldId
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) return res.status(404).json({ message: "user not found" })



            const request = await RequestModel.create({
                fieldName: fieldName,
                userId: user._id,
                requesedBy: req.user,
                teamFieldId: fieldId,
                sanctionAmount: sanctionAmount,
                role: role
            });
            return res.status(200).json({ message: "Request successfully send", request })

        } catch (error) {
            return res
                .status(400)
                .json({ message: "somthing went wrong", error: error.message });
        }
    }
);


Router.post("/acceptRequest/:reqId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { reqId } = req.params;

    try {
        const reqExist = await RequestModel.findById(reqId);

        if (!reqExist) return res.status(404).json({ message: "Request does not exist or already accepted" })

        const addMember = await ExpensesFieldModel.findByIdAndUpdate(reqExist.teamFieldId,
            {
                $addToSet: { members: { memberId: reqExist.userId, role: reqExist.role } }
            }, { new: true })

        const createField = await ExpensesFieldModel.create({
            fieldName: reqExist.fieldName,
            RecivedAmount: reqExist.sanctionAmount,
            userId: reqExist.userId,
            teamFieldId: reqExist.teamFieldId
        })
        await RequestModel.findByIdAndDelete(reqId)
        return res.status(200).json({ message: "User has been added to field", addMember, createField })

    } catch (error) {
        return res.status(400).json({ message: "something went worng", error: error.message })
    }
})

Router.get("/getAllRequest", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { _id } = req.user
    console.log(req.user.email);


    try {
        const allRequestList = await RequestModel.find({ userId: _id })

        return res.status(200).json({ message: "Fetched all request", allRequestList })
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong" })
    }

})

Router.post("/rejectRequest/:reqId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { reqId } = req.params;

    try {
        const reqExist = await RequestModel.findById(reqId)

        if (!reqExist) return res.status(404).json({ message: "Request not found or already rejected" })

        await reqExist.deleteOne();
        return res.status(200).json({ message: "request rejected successfully" })
    } catch (error) {
        return res.status(400).json({ message: "somthing went worng", error: error.message })
    }
})

export default Router