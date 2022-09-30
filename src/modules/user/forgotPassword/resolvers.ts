import { User } from "../../../entity/User";
import { hash } from "bcryptjs";
import { Resolvers } from "../../../types/types";
import { forgotPasswordPrefix } from "../../../utils/constants";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { forgotPasswordLockAccount } from "../../../utils/forgotPasswordLockAccount";
import { expiredKeyError } from "./errorMessages";
import * as yup from "yup";
import { passwordValidation } from "../../../utils/yepSchemas";
import { formatYupError } from "../../../utils/formatYupError";

// 20 minutes
// lock account

const schema = yup.object().shape({
  newPassword: passwordValidation,
});

export const resolvers: Resolvers = {
  Mutation: {
    sendForgotPasswordEmail: async (_, { email }, { redis }) => {
      if (!email) return true; // 'undefined' email will still return first user in db
      const user = await User.findOne({ where: { email } });
      if (!user) return true;
      // if no user with inputted email then return same response so as
      // to not concede whether that email is associeted with a user

      await forgotPasswordLockAccount(user.id, redis);
      // @todo add frontend url
      await createForgotPasswordLink("", user.id, redis);

      // @todo send email with url
      return true;
    },

    changeForgottenPassword: async (_, { newPassword, key }, { redis }) => {
      const redisKey = `${forgotPasswordPrefix}${key}`;
      const userId = await redis.get(redisKey);
      if (!userId) {
        return [
          {
            path: "key",
            message: expiredKeyError,
          },
        ];
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch (error) {
        return formatYupError(error as yup.ValidationError);
      }

      const hashedPassword = await hash(newPassword, 10);

      const updateUserPromise = User.update(
        { id: userId },
        {
          forgotPasswordLocked: false,
          password: hashedPassword,
        }
      );

      const deleteKeyPromise = redis.del(redisKey);

      await Promise.all([updateUserPromise, deleteKeyPromise]);

      return null;
    },
  },
};
