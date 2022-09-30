import { User } from "../../../entity/User";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { createTypeormConnection } from "../../../utils/createTypeormConnection";
import { TestClient } from "../../../testUtils/TestClient";
import Redis from "ioredis";
import { forgotPasswordLockAccount } from "../../../utils/forgotPasswordLockAccount";
import { forgotPasswordLockedError } from "../login/errorMessages";
import { passwordNotLongEnough } from "../register/errorMessages";
import { expiredKeyError } from "./errorMessages";

let userId: string;
const redis = new Redis();
const email = "bob@bob.com";
const password = "forgottenPassword";
const newPassword = "newPassword";

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

describe("forgot password", () => {
  const client = new TestClient("graphql");
  let key: string;
  test("make sure user cannot log in after starting process", async () => {
    await forgotPasswordLockAccount(userId, redis);
    const url = await createForgotPasswordLink("", userId, redis);

    const urlChunks = url.split("/");
    key = urlChunks[urlChunks.length - 1];

    expect(await client.login(email, password)).toEqual({
      data: {
        login: [
          {
            path: "email",
            message: forgotPasswordLockedError,
          },
        ],
      },
    });
  });

  test("try changing password to something invalid", async () => {
    expect(await client.changeForgottenPassword("short", key)).toEqual({
      data: {
        changeForgottenPassword: [
          {
            path: "newPassword",
            message: passwordNotLongEnough,
          },
        ],
      },
    });
  });

  test("change password is successful", async () => {
    const response = await client.changeForgottenPassword(newPassword, key);
    expect(response.data).toEqual({
      changeForgottenPassword: null,
    });
  });

  test("make sure redis key expires after password has been changed", async () => {
    expect(await client.changeForgottenPassword("tryAgain", key)).toEqual({
      data: {
        changeForgottenPassword: [
          {
            path: "key",
            message: expiredKeyError,
          },
        ],
      },
    });
  });

  test("user can log in with new password", async () => {
    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null,
      },
    });
  });
});
