import { User } from "../../../entity/User";
import { compare } from "bcryptjs";
import { Resolvers } from "../../../types/types";
import {
  confirmEmailError,
  forgotPasswordLockedError,
  invalidLogin,
} from "./errorMessages";
import { userSessionIdPrefix } from "../../../utils/constants";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin,
  },
];

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }, { req, redis }) => {
      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      }

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: confirmEmailError,
          },
        ];
      }

      if (user.forgotPasswordLocked) {
        return [
          {
            path: "email",
            message: forgotPasswordLockedError,
          },
        ];
      }

      const validPassword = await compare(password, user.password as string);
      if (!validPassword) {
        return errorResponse;
      }

      // login now succesful
      req.session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    },
  },
};
