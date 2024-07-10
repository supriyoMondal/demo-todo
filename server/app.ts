import express from "express";
import { ENV } from "./src/config/envs";
import { testConnection } from "./src/test";
import { mutators } from "shared";

console.log(mutators);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Todo App!");
});

app.listen(ENV.PORT, () => {
  console.log("Example app listening on port 3000!");
});
