const NODE_ENV = import.meta.env.VITE_NODE_ENV
const API_URL_PROD = import.meta.env.VITE_API_URL_PROD
const API_URL_DEV = import.meta.env.VITE_API_URL_DEV
export const API_URL = NODE_ENV == 'prod' ? API_URL_PROD : API_URL_DEV