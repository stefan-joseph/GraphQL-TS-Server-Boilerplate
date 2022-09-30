import { AppDataSource, AppDataSourceTEST } from "../data-source";

export const createTypeormConnection = async () => {
  if (process.env.NODE_ENV === "test") {
    return await AppDataSourceTEST.initialize();
  } else {
    return await AppDataSource.initialize();
  }
};
