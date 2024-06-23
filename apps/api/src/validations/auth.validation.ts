import Joi from "joi";

export const loginValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const signUpValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    signUpToken: Joi.string().required(),
  }),
};

export const verifyOtpValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

export const sendEmailVerificationOTPValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
