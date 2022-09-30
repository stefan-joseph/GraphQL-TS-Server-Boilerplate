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

describe("logout", () => {
  test("multiple sessions", async () => {
    //computer 1
    const session1 = new TestClient("graphql");
    //computer 2
    const session2 = new TestClient("graphql");

    await session1.login(email, password);
    await session2.login(email, password);
    expect(await session1.me()).toEqual(await session2.me());
    await session1.logout();
    expect(await session1.me()).toEqual(await session2.me());
  });

  test("test logging out a user", async () => {
    const client = new TestClient("graphql");

    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email,
      },
    });

    await client.logout();

    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});
