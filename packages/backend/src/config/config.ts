import express from "express";
import dotenv from 'dotenv'

dotenv.config()
export const app = express();
export const port = 8888;
export const NODE_ENV = process.env.NODE_ENV
export const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD
export const MONGODB_URI_DEV = process.env.MONGODB_URI_DEV
export const MONGODB_URI = NODE_ENV == 'prod' ? MONGODB_URI_PROD : MONGODB_URI_DEV;
export const JWT_SECRET = process.env.JWT_SECRET;
