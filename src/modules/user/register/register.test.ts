import { User } from "../../../entity/User";
import { createTypeormConnection } from "../../../utils/createTypeormConnection";
import { TestClient } from "../../../testUtils/TestClient";

import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

beforeAll(async () => {
  await createTypeormConnection();
});

const email = "bob@bob.com";
const password = "dsjkvd";

describe("Register user", () => {
  const client = new TestClient("graphql");
  it("registers a user", async () => {
    // registers a user
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("attempt to sign up with duplicate email", async () => {
    const response = await client.register(email, password);
    expect(response.data.register).toHaveLength(1);
    expect(response.data.register[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    });
  });

  it("checks for bad email", async () => {
    const response = await client.register("b", password);

    expect(response.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
      ],
    });
  });

  it("checks for bad password", async () => {
    const response = await client.register(email, "asdsd");

    expect(response.data).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });

  it("checks for bad email and password", async () => {
    const response = await client.register("bo", "asdsd");

    expect(response.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
