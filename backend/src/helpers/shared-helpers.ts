import { Response } from "express";
import { FM } from "shared-library/src/constants";

export const handleCatchError = (res: Response, error: any, customError?: string) => {
  console.error(error);
  return res.sendStatus(500).json({ message: FM.serverError });
};
