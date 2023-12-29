import express from "express";
// import dotenv from "dotenv";

// dotenv.config()

export const app = express();
export const port = 8888;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
