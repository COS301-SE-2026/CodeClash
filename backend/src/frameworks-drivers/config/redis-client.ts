import dotenv from 'dotenv';
import Redis from "ioredis";
dotenv.config()

const redis_url = process.env.NODE_ENV === 'test'? process.env.REDIS_LOCAL_URL :process.env.REDIS_URL; 
//redis instance
const redis = new Redis(redis_url!);

export default redis;