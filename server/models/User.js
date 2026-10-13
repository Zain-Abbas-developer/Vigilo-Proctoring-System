import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
      index: true,
    },
    department: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    profileImage: {
      type: String,
      select: false, // Exclude profileImage from query results by default
    },
    faceEnrolled: {
      type: Boolean,
      default: false,
      index: true,
    },
    faceEmbedding: {
      type: String,
      default: null,
      select: false,
    },
    faceModelVersion: {
      type: String,
      default: undefined,
      select: false,
    },
    faceEnrolledAt: {
      type: Date,
      default: undefined,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    violations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Violation",
      },
    ],
    lastViolation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Violation",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLoginAt: Date,
    passwordResetToken: {
      type: String,
      select: false, // Exclude passwordResetToken from query results by default
    },
    passwordResetExpires: {
      type: Date,
      select: false, // Exclude passwordResetExpires from query results by default
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.profileImage;
  return userObject;
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.profileImage;

  delete userObject.faceEmbedding;
  delete userObject.faceModelVersion;

  return userObject;
};

const User = mongoose.model("User", userSchema);
export default User;
