import { Router } from "express";
import {
  createTodoWorkSpace,
  deleteTodoWorkSpace,
  listTodoWorkSpace,
  updateTodoWorkSpace,
} from "../controller/todoWorkSpace";

const router = Router();

router.post("/create/:userSpaceId", createTodoWorkSpace);
router.delete("/delete/:userSpaceId/:id", deleteTodoWorkSpace);
router.get("/list/:userSpaceId", listTodoWorkSpace);
router.put("/update/:id", updateTodoWorkSpace);

export default router;
