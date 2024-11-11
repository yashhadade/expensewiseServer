import express from "express";
import passport from "passport";
import { ExpensesFieldModel } from "../../DBModel/ExpenseFieldModel/index.js";
import { userModel } from "../../DBModel/userModal/index.js";
import { expenseModal } from "../../DBModel/expenseModal/index.js";
const Router = express.Router();

// create field
Router.post(
    "/createField",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { _id } = req.user;
            req.body.userId = _id;

            const response = await ExpensesFieldModel.create(req.body);
            return res.status(200).json({ message: "field created", response });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
);

// get field
Router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { _id } = req.user;
        const { fieldType } = req.query;

        try {
            const userExist = await userModel.findById(_id);
            if (!userExist)
                return res.status(404).json({ message: "user dose not exist" });

            const query = { userId: _id };

            // Add fieldType to query if it is present
            if (fieldType) {
                query.fieldType = fieldType;
            }

            const expenseField = await ExpensesFieldModel.find(query)

            if (expenseField.length === 0)
                return res.status(404).json({ message: "Add Expese field " });

            return res.status(202).json({ expenseField });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
);

// get field by id

Router.get("/:fieldId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { fieldId } = req.params;
    try {
        const field = await ExpensesFieldModel.findById(fieldId).populate('expenses');

        return res.status(200).json({ field })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
)
// add expenses (we have to shift this in expenses api
Router.post(
    "/add-expense/:fieldId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { fieldId } = req.params;
        const { _id } = req.user;
        req.body.fieldId = _id;

        const expense = await expenseModal.create(req.body);

        const field = await ExpensesFieldModel.findByIdAndUpdate(
            fieldId,
            {
                $push: { expenses: expense._id },
            },
            { new: true }
        );

        if (!field) return res.status(404).json({ message: "field not found" });

        res.status(200).json({ message: "Expenses added successfully", field });
    }
);

// https://chatgpt.com/share/672bd7a5-c66c-8001-a453-4757b3f870ce

// create team
// todo send request to get in team
// Router.post(
//     "/add-members/:fieldId",
//     passport.authenticate("jwt", { session: false }),
//     async (req, res) => {
//         const { fieldId } = req.params;
//         const { emails } = req.body;

//         if (!emails || !Array.isArray(emails)) {
//             return res
//                 .status(400)
//                 .json({ message: "Please provide emails in array format" });
//         }

//         try {
//             const users = await userModel.find({ email: { $in: emails } });

//             const existingUser = users.map((user) => user._id);
//             const foundUser = users.map((user) => user.email);

//             const missingEmail = emails.filter((email) => !foundUser.includes(email));

//             const field = await ExpensesFieldModel.findByIdAndUpdate(
//                 fieldId,
//                 {
//                     $addToSet: { members: { $each: existingUser } },
//                 },
//                 { new: true }
//             );

//             if (missingEmail.length > 0) return res.status(200).json({ message: "Some emails not found in database and others has been added", missingEmail, foundUser })


//         } catch (error) {
//             return res
//                 .status(400)
//                 .json({ message: "somthing went wrong", error: error.message });
//         }
//     }
// );

// todo api
// accept request when request accepted that time create field with sanction amout in there and add main field id into team field so it will be get verfied 


// merge expenses into main feild
Router.post(
    "/team-expenses/:fieldId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { fieldId } = req.params; 
        const { _id } = req.user;
        const { myFieldId } = req.body;

        try {
            const teamField = await ExpensesFieldModel.findById(fieldId);

            if (!teamField)
                return res.status(404).json({ message: "Feild does not exist" });

            const myExpenses = await ExpensesFieldModel.findById(myFieldId);
            const memberExpenseEntry = teamField.membersExpenses.find(
                (me) => me.memberId.toString() === _id.toString()
            );

            if (!memberExpenseEntry) {
                // Step 3: Add a new entry for the member if it doesn't exist
                await ExpensesFieldModel.findByIdAndUpdate(fieldId, {
                    $push: {
                        membersExpenses: { memberId: _id, expenses: [], status: "Pending" },
                    },
                });
            }

            const addExpensesField = await ExpensesFieldModel.findByIdAndUpdate(
                fieldId,
                {
                    $push: {
                        "membersExpenses.$[member].expenses": {
                            $each: myExpenses?.expenses,
                        },
                    },
                },
                { arrayFilters: [{ "member.memberId": _id }], new: true }
            );
            return res
                .status(200)
                .json({ message: "Expenses upated", addExpensesField });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
);

// status will change to approve and expenses will added to field expenses list 
Router.post("/review-Pr/:fieldId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { fieldId } = req.params;
    const { review, prId } = req.body;

    try {
        const teamField = await ExpensesFieldModel.findOneAndUpdate({ _id: fieldId, "membersExpenses._id": prId }, {
            $set: { "membersExpenses.$.status": review }
        }, { new: true });

        if (!teamField) {
            return res.status(404).json({ message: "Team field or member expense not found" });
        }

        return res.status(200).json({ message: "Field status has been changed", teamField })

    } catch (error) {
        return res.status(400).json({ message: "Somthing went wrong", error: error.message })
    }

})



Router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { id } = req.params;
            const fieldExist = await ExpensesFieldModel.findById(id);
            if (!fieldExist)
                return res.status(404).json({ message: "Feild does not exist" });

            await ExpensesFieldModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Field deleted successfully" });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
);

Router.put(
    "/:id/update",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { id } = req.params;
            const fieldExist = await ExpensesFieldModel.findById(id);
            if (!fieldExist)
                return res.status(404).json({ message: "Feild does not exist" });

            const response = await ExpensesFieldModel.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );
            return res
                .status(200)
                .json({ message: "field created", response: response });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
);
export default Router;
