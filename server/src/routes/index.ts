import { Router } from "express";
import todos from "./todos.routes";
import space from "./space.routes";
const router = Router();

// router.use((req, res, next) => {
//   console.log(req.url);
//   next();
// });

router.use("/todo", todos);
router.use("/space", space);

export default router;
