import { Router } from "express";
import {
  createSpaceController,
  deleteSpaceController,
  getSpaceDetailsController,
  getSpaceListController,
} from "../controller/space";

const router = Router();

router.post("/create", createSpaceController);
router.delete("/delete/:spaceID", deleteSpaceController);
router.get("/list", getSpaceListController);
router.get("/details/:spaceID", getSpaceDetailsController);

export default router;
