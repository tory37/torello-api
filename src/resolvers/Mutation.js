const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserId, getTimestamp } = require("../utils");
const { authenticateGoogle } = require("../passport");
const lodash = require("lodash");

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user
  };
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user
  };
};

const authGoogle = async (parent, { token }, context) => {
  const { req, res, prisma } = context;
  req.body = {
    ...req.body,
    access_token: token
  };

  try {
    //data contains the accessToken, refreshToken and profile from passport
    const { data, info } = await authenticateGoogle(req, res);
    console.log("Data: ");
    console.log(data);

    if (data) {
      const userEmail = lodash.get(data, "profile._json.email");

      const user = await prisma.user({ email: userEmail });

      if (!user) {
        const userName = lodash.get(data, "profile.name.givenName", null);
        user = await prisma.createUser({
          name: userName,
          email: userEmail
        });
      }

      if (user) {
        return {
          user
        };
      }

      throw new Error("Something went wrong");
    }

    if (info) {
      console.log(info);
      switch (info.code) {
        case "ETIMEDOUT":
          return new Error("Failed to reach Google: Try Again");
        default:
          return new Error("something went wrong");
      }
    }
    return Error("server error");
  } catch (error) {
    return error;
  }
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

const updateColumn = (parent, args, context) => {
  const id = args.id;
  delete args.id;
  return context.prisma.updateColumn({
    where: {
      id
    },
    data: {
      ...args,
      updatedAt: getTimestamp()
    }
  });
};

const createTask = (parent, args, context) => {
  const userId = getUserId(context);
  const { columnId } = args;
  delete args.columnId;

  return context.prisma.createTask({
    ...args,
    column: { connect: { id: columnId } },
    createdBy: { connect: { id: userId } },
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  });
};

const updateTask = (parent, args, context) => {
  const id = args.id;
  delete args.id;
  return context.prisma.updateTask({
    where: {
      id
    },
    data: {
      ...args,
      updatedAt: getTimestamp()
    }
  });
};

module.exports = {
  signup,
  login,
  authGoogle,
  createBoard,
  updateBoard,
  createColumn,
  updateColumn,
  createTask,
  updateTask
};
