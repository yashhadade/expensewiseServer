import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";


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
        required: true,
        validate: {
            validator: (val) => val.length >= 8,
            message: 'password should be 8 digits'
        }

    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
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

userSchema.statics.findByEmail = async ({ email }) => {
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
        throw new Error("User already exist...")
    }
    return false;
}

userSchema.methods.matchPassword = function (oldPassword, callback) {
    bcrypt.compare(oldPassword, this.password, (error, isMatch) => {
        if (error) callback(error);
        callback(null, isMatch);
    })
}

userSchema.statics.findByEmailAndPass = async ({ email, password }) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("user not exist");

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        throw new Error("invalid credentials")
    }
    return user;
};

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