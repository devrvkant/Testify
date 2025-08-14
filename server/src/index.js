import { config } from "./config/env.js";

import express from "express";
import cors from "cors";

import githubRouter from "./routes/github.routes.js";
import testcaseRouter from "./routes/testcase.routes.js";

const PORT = config.port;
const app = express();

// middlewares
app.use(express.json());
app.use(cors({origin: config.clientUrl}))

// routes
app.get("/", (req, res) => {
  res.send("Welcome to Testify Server.")
});
app.use("/api/github", githubRouter)
app.use("/api/testcase", testcaseRouter);


app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
