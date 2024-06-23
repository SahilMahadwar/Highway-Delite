import bcrypt from "bcryptjs";

import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  transform(): Record<string, unknown>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add user name"],
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method("transform", function () {
  const fields = ["_id", "name", "email", "createdAt", "updatedAt"] as const;
  return fields.reduce((transformed: Record<string, unknown>, field) => {
    transformed[field] = this[field];
    return transformed;
  }, {});
});

export default mongoose.model<User>("User", UserSchema);
