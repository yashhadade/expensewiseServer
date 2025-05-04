import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        validate: {
            validator: (val) => val.length >= 8,
            message: 'password should be 8 digits'
        }

    },
    expensesField: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    }],
    role: {
        type: String, // accountant, co-accontant,member
        // required: true
    },
    resetPasswordToken: String,
    resetPasswordExipre: String
},
    { timestamps: true });

userSchema.methods.genrateJwtToken = function () {
    return jwt.sign({ user: this._id.toString() }, "newProject", { expiresIn: "10d" })
}

userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(15).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExipre = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

userSchema.statics.findByEmail = async (req, res) => {
    const { email } = req.body

    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
        return checkEmail

    }
    return;
}

userSchema.methods.matchPassword = function (oldPassword, callback) {
    bcrypt.compare(oldPassword, this.password, (error, isMatch) => {
        if (error) callback(error);
        callback(null, isMatch);
    })
}

userSchema.statics.findByEmailAndPass = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("USER_NOT_FOUND");

    const isMatch = await bcrypt.compare(String(password), String(user.password));
    if (!isMatch) throw new Error("INVALID_CREDENTIALS");
    return user;
};
// hashing password here
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();


    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            user.password = hash;
            return next();
        })
    })
})

export const userModel = mongoose.model("User", userSchema);