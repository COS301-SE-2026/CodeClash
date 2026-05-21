import Redis from "ioredis";

// redis instance
// const redis = new Redis();
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export default redis;
