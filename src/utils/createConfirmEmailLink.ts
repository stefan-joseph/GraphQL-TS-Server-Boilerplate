import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = uuidv4();
  await redis.set(id, userId, "EX", 60 * 60 * 24);
  // return id;
  return `${url}confirm/${id}`;
};
