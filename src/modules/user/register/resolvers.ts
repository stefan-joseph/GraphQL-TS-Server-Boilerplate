import * as yup from "yup";
import { User } from "../../../entity/User";
import { formatYupError } from "../../../utils/formatYupError";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
} from "./errorMessages";
// import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
// import { sendEmail } from "../../utils/sendEmail";
import { Resolvers } from "../../../types/types";
import { passwordValidation } from "../../../utils/yepSchemas";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: passwordValidation,
});

export const resolvers: Resolvers = {
  Mutation: {
    register: async (
      _,
      args
      // { redis, url }
    ) => {
      const { email, password } = args;
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return formatYupError(error as yup.ValidationError);
      }
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"],
      });

      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: duplicateEmail,
          },
        ];
      }

      const user = User.create({
        email,
        password,
      });

      await user.save();

      // if (process.env.NODE_ENV !== "test") {
      //   await sendEmail(
      //     email,
      //     await createConfirmEmailLink(url, user.id, redis)
      //   );
      // }

      return null;
    },
  },
};
