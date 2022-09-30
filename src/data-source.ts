import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "graphql-ts-server-boilerplate",
  synchronize: true,
  logging: true,
  dropSchema: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export const AppDataSourceTEST = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "graphql-ts-server-boilerplate-TEST",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
