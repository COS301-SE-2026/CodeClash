import Redis from "ioredis";
import dotenv from 'dotenv/config'

//redis instance
const redis = new Redis(process.env.REDIS_URL!);

export default redis;
