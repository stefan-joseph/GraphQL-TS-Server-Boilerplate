// import { loadSchemaSync } from "@graphql-tools/load";
// import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
// import { addResolversToSchema, mergeSchemas } from "@graphql-tools/schema";
// import { join } from "path";
// import { readdirSync } from "fs";
// import { GraphQLSchema } from "graphql";

// export const generateSchema = () => {
//   const schemas: GraphQLSchema[] = [];

//   const folders = readdirSync(join(__dirname, "../modules"));

//   folders.forEach((folder) => {
//     const { resolvers } = require(`../modules/${folder}/resolvers`);
//     const schema = loadSchemaSync(
//       join(__dirname, `../modules/${folder}/schema.graphql`),
//       {
//         loaders: [new GraphQLFileLoader()],
//       }
//     );
//     schemas.push(
//       addResolversToSchema({
//         schema,
//         resolvers,
//       })
//     );
//   });
//   return mergeSchemas({ schemas });
// };
