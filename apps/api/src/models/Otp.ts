import mongoose, { Document, Schema } from "mongoose";

export interface OTP extends Document {
  email: string;
  otp: string;
  expiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    expiry: { type: Date },
  },
  { timestamps: true }
);

OTPSchema.pre<OTP>("save", function (next) {
  if (!this.expiry) {
    this.expiry = new Date(Date.now() + 10 * 60 * 1000); // Set expiry to 10 minutes from now
  }
  next();
});

export default mongoose.model<OTP>("OTP", OTPSchema);
