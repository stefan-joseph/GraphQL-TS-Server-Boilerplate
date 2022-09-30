import { Resolvers } from "../../../types/types";
import { removeAllOfUsersSessions } from "../../../utils/removeAllOfUsersSessions";

export const resolvers: Resolvers = {
  Mutation: {
    logout: async (_, __, { req, redis }) => {
      const { userId } = req.session;
      if (userId) {
        await removeAllOfUsersSessions(userId, redis);
        return true;
      }
      return false;
    },
  },
};
