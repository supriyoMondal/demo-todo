import { z } from "zod";
import { db } from "../db";
import { todoWorkSpace } from "../db/schema";
import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { eq } from "drizzle-orm";

const userSpaceIdSchema = z.object({
  userSpaceId: z.string(),
});

export const createTodoWorkSpace = async (req: Request, res: Response) => {
  try {
    const { name } = z
      .object({
        name: z.string().min(1),
      })
      .parse(req.body);

    const { userSpaceId } = userSpaceIdSchema.parse(req.params);

    const [userSpaceVersion] = await db
      .insert(todoWorkSpace)
      .values({ name, userSpaceId })
      .returning();

    res.send(userSpaceVersion);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteTodoWorkSpace = async (req: Request, res: Response) => {
  try {
    const { id, userSpaceId } = z
      .object({
        id: z.string().min(1).transform(Number),
        userSpaceId: z.string(),
      })
      .parse(req.params);

    await db.delete(todoWorkSpace).where(eq(todoWorkSpace.id, id));

    res.send("Workspace deleted");
  } catch (error) {
    handleError(error, res);
  }
};

export const listTodoWorkSpace = async (req: Request, res: Response) => {
  try {
    const { userSpaceId } = userSpaceIdSchema.parse(req.params);

    const workspaces = await db
      .select()
      .from(todoWorkSpace)
      .where(eq(todoWorkSpace.userSpaceId, userSpaceId));

    res.send([
      { name: "Fav", id: -1 },
      { name: "My Todos", id: -2 },
      ...workspaces,
    ]);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateTodoWorkSpace = async (req: Request, res: Response) => {
  try {
    const { id } = z
      .object({
        id: z.string().min(1).transform(Number),
      })
      .parse(req.params);

    const { name } = z
      .object({
        name: z.string().min(1),
      })
      .parse(req.body);

    await db
      .update(todoWorkSpace)
      .set({ name })
      .where(eq(todoWorkSpace.id, id));

    res.send("Workspace updated");
  } catch (error) {
    handleError(error, res);
  }
};
