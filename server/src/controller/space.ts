import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { z } from "zod";
import { db } from "../db";
import { userSpace } from "../db/schema";
import { eq } from "drizzle-orm";

const spaceIdSchema = z.object({
  spaceID: z.string(),
});
export const createSpaceController = async (req: Request, res: Response) => {
  try {
    const { spaceID } = spaceIdSchema.parse(req.body);

    const [userSpaceVersion] = await db
      .insert(userSpace)
      .values({ id: spaceID, version: 0, lastModified: new Date() })
      .returning();

    res.send(userSpaceVersion);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteSpaceController = async (req: Request, res: Response) => {
  try {
    const { spaceID } = spaceIdSchema.parse(req.params);

    await db.delete(userSpace).where(eq(userSpace.id, spaceID));

    res.send("Space deleted");
  } catch (error) {
    handleError(error, res);
  }
};

export const getSpaceListController = async (req: Request, res: Response) => {
  try {
    const spaces = await db.select().from(userSpace);
    res.send(spaces);
  } catch (error) {
    handleError(error, res);
  }
};

export const getSpaceDetailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { spaceID } = spaceIdSchema.parse(req.params);
    const [space] = await db
      .select()
      .from(userSpace)
      .where(eq(userSpace.id, spaceID));
    if (!space) {
      res.status(404).send("Space not found");
      return;
    }

    res.send(space);
  } catch (error) {
    handleError(error, res);
  }
};
