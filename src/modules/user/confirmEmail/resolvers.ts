import { User } from "../../../entity/User";
// import { ResolverMap } from "../../types/graphql-utils";
import { Resolvers } from "../../../types/types";

export const resolvers: Resolvers = {
  Mutation: {
    confirmEmail: async (_, args, { redis }) => {
      const { id } = args;
      const userId = await redis.get(id);
      if (userId) {
        await User.update({ id: userId }, { confirmed: true });
        await redis.del(id);
        return true;
      } else {
        return false;
      }
    },
  },
};
