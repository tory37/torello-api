const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId, getTimestamp } = require("../utils");

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

const login = async (parent, args, context, info) => {
  console.log("loggin in");
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  console.log(token);

  return {
    token,
    user
  };
};

const createBoard = (parent, args, context, info) => {
  return context.prisma.createBoard({
    ...args,
    createdBy: { connect: { id: getUserId(context) } },
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  });
};

const updateBoard = (parent, args, context, info) => {
  const id = args.id;
  delete args.id;
  return context.prisma.updateBoard({
    where: {
      id
    },
    data: {
      ...args,
      updatedAt: getTimestamp()
    }
  });
};

const createColumn = (parent, args, context, info) => {
  const userId = getUserId(context);
  const { boardId } = args;
  delete args.boardId;

  return context.prisma.createColumn({
    ...args,
    board: { connect: { id: boardId } },
    createdBy: { connect: { id: userId } },
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  });
};

module.exports = {
  signup,
  login,
  createBoard,
  updateBoard,
  createColumn
};
