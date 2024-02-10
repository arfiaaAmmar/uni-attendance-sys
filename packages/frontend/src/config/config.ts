import dotenv from 'dotenv'

dotenv.config()
const NODE_ENV = process.env.NODE_ENV
const API_URL_PROD = process.env.API_URL_PROD
const API_URL_DEV = process.env.API_URL_DEV
export const API_URL = NODE_ENV === 'prod' ? API_URL_PROD : API_URL_DEV