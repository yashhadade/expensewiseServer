import express from "express";
import { organizationModel } from "../../DBModel/organizationModal/index.js";
import passport from "passport";
const Router = express.Router();

Router.post("/signup", async (req, res) => {
    try {
        await organizationModel.findByEmail(req.body);
        const newOrg = await organizationModel.create(req.body);
        const token = newOrg.genrateJwtToken();

        return res.status(201).json({ status: "Success", token })
    } catch (error) {
        return res.status(400).json({ status: "Failed", error: error.message })
    }
})

Router.post("/signin", async (req, res) => {
    try {
        const org = await organizationModel.findByEmailAndPass(req.body);
        const token = org.genrateJwtToken();

        return res.status(201).json({ status: "Success", token })

    } catch (error) {
        return res.status(400).json({ status: "Failed", error: error.message })
    }
})

Router.get("/getOrg", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { name, email, _id,users } = req.user;
        
        return res.status(201).json({ organization: { name, email, _id ,users} })
    } catch (error) {
        return res.status(500).json({ status: "failed", message: error.message })
    }
})

export default Router;


