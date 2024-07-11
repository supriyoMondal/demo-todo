import { Router } from "express";
import todos from "./todos.routes";
const router = Router();

// router.use((req, res, next) => {
//   console.log(req.url);
//   next();
// });

router.use("/todo", todos);

export default router;
