import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";

import CONFIG from "./config";
import { ErrorCustom } from "./types/errors";
import { errorMessageHandler } from "./common/helpers";

import authMiddlware from "./middlewares/auth";
import users from "./routes/users";

const { PORT } = CONFIG.APP;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Here different routes go
app.use("/users", users);
// If route is not found
app.use((req, res) => {
  return res.status(404).send({ message: "Not found!" });
});

// If error is thrown inside routes
app.use((err: ErrorCustom, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err.status) {
    const error = errorMessageHandler(err.status, err.message);
    return res.status(err.status).send(error);
  } else {
    return res.status(500).send(err);
  }
});

const startServer = () => {
  http.createServer(app).listen(PORT, () => console.log(`http server started on port: ${PORT}`));
};

setImmediate(startServer);
