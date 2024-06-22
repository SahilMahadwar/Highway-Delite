import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// // Adding an index to the email field for better query performance
// UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<User>("User", UserSchema);
