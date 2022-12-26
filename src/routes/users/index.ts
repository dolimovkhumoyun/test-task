import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import CONFIG from "../../config";
import Users from "../../database/users";
import authMiddlware from "../../middlewares/auth";
import { catchReject } from "../../common/helpers";
import { authSchema, createUserSchema, updateUserSchema } from "./schema";

const router = express.Router();
const { APP } = CONFIG;

const authUser = catchReject(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = authSchema.validate(req.body);
  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  const { username, password } = value;
  const user = await Users.auth(username, password);
  if (!user) {
    return next({ status: 401, message: "Authentication failed!" });
  }

  const token = jwt.sign({ user }, APP.SECRET, { expiresIn: APP.SESSION_TIMEOUT });

  return res.send({ status: 200, service: "GetUsers", data: user, token });
});

const getUsers = catchReject(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.page) {
    return next({ status: 400, message: "Page number is required!" });
  }
  const page = Number(req.query.page);
  const users = await Users.getUsers(page);

  return res.send({ status: 200, service: "GetUsers", data: users });
});

const getUser = catchReject(async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.user_id);

  const user = await Users.getUser(userId);

  return res.send({ status: 200, service: "GetUsers", data: user });
});

const createUser = catchReject(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  const users = await Users.createUser(value);

  return res.send({ status: 200, service: "GetUsers", data: users });
});

const updateUser = catchReject(async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  const users = await Users.updateUser(value);

  return res.send({ status: 200, service: "GetUsers", data: users });
});

router.get("/:user_id", getUser);
router.get("/", getUsers);

router.post("/auth", authUser);
router.post("/", authMiddlware, createUser);
router.put("/", authMiddlware, updateUser);

export default router;
