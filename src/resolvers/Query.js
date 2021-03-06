const { getUserId } = require("../utils");

const user = (parent, args, context, info) => {
  const user = context.prisma.user({ id: getUserId(context) });
};

const board = (parent, args, context, info) => {
  return context.prisma.board({ id: args.id });
};

const boards = (parent, args, context, info) => {
  const boards = context.prisma.boards({
    where: { createdBy: { id: getUserId(context) } }
  });

  return boards;
};

const columns = (parent, args, context, info) => {
  const columns = context.prisma.columns({
    where: { createdBy: { id: getUserId(context) } }
  });

  return columns;
};

module.exports = {
  user,
  board,
  boards,
  columns
};
