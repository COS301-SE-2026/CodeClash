import dotenv from 'dotenv';
import Redis from "ioredis";
dotenv.config()

//redis instance
const redis = new Redis(process.env.REDIS_URL!);

export default redis;
