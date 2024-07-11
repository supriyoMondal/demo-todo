import express from "express";
import { ENV } from "./src/config/envs";
import routes from "./src/routes";

const app = express();

app.use(express.urlencoded({ extended: true }), express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello Todo App!");
});

app.listen(ENV.PORT, () => {
  console.log("Example app listening on port 3000!");
});
