import express from "express";
import { userModel } from "../../DBModel/userModal/index.js";
import passport from "passport";
import { RequestModel } from "../../DBModel/RequestModel/index.js";

const Router = express.Router();

Router.post(
    "/add-members/:fieldId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { fieldId } = req.params;

        const { email, sanctionAmount, role,fieldName } = req.body;
        req.body.requesedBy = req.user._id;
        req.body.teamFieldId = fieldId
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) return res.status(404).json({ message: "user not found" })

            req.body.userId = user._id;

            const request = await RequestModel.create(req.body);
            return res.status(200).json({ message: "Request successfully send", request })



            // const field = await ExpensesFieldModel.findByIdAndUpdate(
            //     fieldId,
            //     {
            //         $addToSet: { members: { $each: existingUser } },
            //     },
            //     { new: true }
            // );

            // if (missingEmail.length > 0) return res.status(200).json({ message: "Some emails not found in database and others has been added", missingEmail, foundUser })


        } catch (error) {
            return res
                .status(400)
                .json({ message: "somthing went wrong", error: error.message });
        }
    }
);

export default Router