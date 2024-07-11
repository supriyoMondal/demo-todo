import type { Response } from "express";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const handleError = (err: unknown, res: Response) => {
  // @ts-expect-error err is unknown
  console.log(err.message || err);

  if (typeof err === "string") {
    return res.status(400).send(new Error(err));
  }

  if (err instanceof ZodError) {
    const validationErrors = fromZodError(err);
    return res.status(400).send(validationErrors.toString());
  }

  const message = err instanceof Error ? err.message : err;
  return res.status(400).send(message);
};
