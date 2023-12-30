import { FM } from "packages/shared-library/src/constants";
import { Response } from "express";

export const handleCatchError = (
  res: Response,
  error: any,
  customError?: string
) => {
  console.error(error);
  return res.sendStatus(500).json({ message: customError ?? FM.serverError });
};