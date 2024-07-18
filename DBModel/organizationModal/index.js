import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const organizationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    {
        timestamps: true
    }
)

organizationSchema.methods.genrateJwtToken = function () {
    return jwt.sign({ org: this._id.toString() }, "newProject", { expiresIn: "10d" })
}

organizationSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(15).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExipre = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

organizationSchema.statics.findByEmail = async ({ email }) => {
    const checkEmail = await organizationModel.findOne({ email });
    if (checkEmail) {
        throw new Error("Organization already exist...")
    }
    return false;
}

organizationSchema.methods.matchPassword = function (oldPassword, callback) {
    bcrypt.compare(oldPassword, this.password, (error, isMatch) => {
        if (error) callback(error);
        callback(null, isMatch);
    })
}

organizationSchema.statics.findByEmailAndPass = async ({ email, password }) => {
    const org = await organizationModel.findOne({ email });
    if (!org) throw new Error("Organization not exist");

    const checkPassword = await bcrypt.compare(password, org.password);
    if (!checkPassword) {
        throw new Error("invalid credentials")
    }
    return org;
};

organizationSchema.pre("save", function (next) {
    const org = this;
    if (!org.isModified("password")) return next();


    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        bcrypt.hash(org.password, salt, (error, hash) => {
            if (error) return next(error);

            org.password = hash;
            return next();
        })
    })
})


export const organizationModel = mongoose.model("Organization", organizationSchema);

