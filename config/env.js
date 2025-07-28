import { config } from 'dotenv';

//extracts all path from env file 2 dotenvs, D
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

//accessing singular vars from dotenv
export const {
    PORT, 
    NODE_ENV, 
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    SERVER_URL,
    EMAIL_PASSWORD,
} = process.env;
