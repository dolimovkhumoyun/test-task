import Joi from "joi";
import { AuthBody, FullUser, User } from "./types";

export const authSchema = Joi.object<AuthBody, false>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const createUserSchema = Joi.object<User, false>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  phone_number: Joi.string().required(),
});

export const updateUserSchema = Joi.object<FullUser, false>({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  full_name: Joi.string().optional(),
  phone_number: Joi.string().optional(),
});
