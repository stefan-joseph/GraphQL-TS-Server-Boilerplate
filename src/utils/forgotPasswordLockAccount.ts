import Redis from "ioredis";
import { User } from "../entity/User";
import { removeAllOfUsersSessions } from "./removeAllOfUsersSessions";

export const forgotPasswordLockAccount = async (
  userId: string,
  redis: Redis
) => {
  // prevent login
  await User.update({ id: userId }, { forgotPasswordLocked: true });
  // remove all sessions
  await removeAllOfUsersSessions(userId, redis);
};
