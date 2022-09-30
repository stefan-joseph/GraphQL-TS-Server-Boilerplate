import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // schema: "http://localhost:4000/graphql",
  schema: "./src/modules/**/*.graphql",
  //   documents: ["src/**/*.tsx"],
  generates: {
    "./src/types/types.ts": {
      //   preset: "client",
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
