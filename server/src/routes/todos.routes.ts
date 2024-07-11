import { Router } from "express";
import {
  pokeTodoController,
  pullTodoController,
  pushTodoController,
} from "../controller/todos";

const router = Router();

router.post("/push", pushTodoController);
router.post("/pull", pullTodoController);
router.get("/poke", pokeTodoController);

export default router;
