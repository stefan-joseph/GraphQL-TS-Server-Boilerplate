import { Redis } from "ioredis";

export interface Session extends Express.SessionStore {
  userId?: string;
}

export interface Request {
  session: Session;
}

export interface Context {
  redis: Redis;
  url: string;
  session: Session;
  req: any;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type GraphQlMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
