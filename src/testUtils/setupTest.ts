import { startServer } from "../startServer";

module.exports = async () => {
  process.env.TEST_HOST = "http://localhost:4000/";
  await startServer();
};
