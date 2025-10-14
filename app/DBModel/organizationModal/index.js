import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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
    try {
      const [salt, originalHash] = this.password.split(":");
      const hash = crypto
        .pbkdf2Sync(oldPassword, salt, 10000, 64, "sha512")
        .toString("hex");
  
      const isMatch = hash === originalHash;
      callback(null, isMatch);
    } catch (err) {
      callback(err);
    }
  };

  organizationSchema.statics.findByEmailAndPass = async ({ email, password }) => {
    const org = await organizationModel.findOne({ email });
    if (!org) throw new Error("Organization not exist");
  
    try {
      // Split salt and hash stored in DB
      const [salt, originalHash] = org.password.split(":");
      // Recompute hash from provided password
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
  
      if (hash !== originalHash) {
        throw new Error("Invalid credentials");
      }
  
      return org;
    } catch (err) {
      throw new Error("Invalid credentials");
    }
  };
organizationSchema.pre("save", function (next) {
    const org = this;
    if (!org.isModified("password")) return next();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(org.password, salt, 10000, 64, "sha512")
      .toString("hex");

    org.password = `${salt}:${hash}`; // Store "salt:hash"
    next();
})


export const organizationModel = mongoose.model("Organization", organizationSchema);

