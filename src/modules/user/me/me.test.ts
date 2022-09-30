import { User } from "../../../entity/User";
import { createTypeormConnection } from "../../../utils/createTypeormConnection";
import { TestClient } from "../../../testUtils/TestClient";

let userId: string;
const email = "bob@bob.com";
const password = "cjdkvbndsjvk";

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

describe("me", () => {
  const client = new TestClient("graphql");

  test("return null if no cookie", async () => {
    const response = await client.me();
    expect(response.data.me).toBeNull();
  });

  test("get current user", async () => {
    await client.login(email, password);
    const response = await client.me();
    expect(response.data).toEqual({
      me: {
        id: userId,
        email,
      },
    });
  });
});
