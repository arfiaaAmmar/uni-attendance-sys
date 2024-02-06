import express from "express";

export const app = express();
export const port = 8888;
export const NODE_ENV = process.env.NODE_ENV
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
