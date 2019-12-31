"use strict";

require("dotenv").config();

const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
// const User = require("./resolvers/User");
const Board = require("./resolvers/Board");
const Column = require("./resolvers/Column");
const Task = require("./resolvers/Task");

const resolvers = { Query, Mutation, Subscription, Board, Column, Task };

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => {
    return {
      ...req,
      prisma
    };
  }
});

server.start(() => {
  console.log(`Server is running on http://localhost:4000`);
});
