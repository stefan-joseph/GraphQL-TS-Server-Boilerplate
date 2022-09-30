import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { forgotPasswordPrefix } from "./constants";

export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = uuidv4();

  await redis.set(`${forgotPasswordPrefix}${id}`, userId, "EX", 60 * 20); // 20 min
  return `${url}change-password/${id}`;
};
