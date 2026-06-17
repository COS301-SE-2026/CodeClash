// import Redis from "ioredis";
import {createClient} from "redis";

const redisClient = createClient({url : process.env.FRONTEND_URL || 'http://localhost:5173'}); //i am not sure if this is the correct url, must come back

// redis instance
// const redis = new Redis();

// export default redis;
