// middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface AuthRequest extends Request {
  user?: any;
}

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

export default authenticateToken;
