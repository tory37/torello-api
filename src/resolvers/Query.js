const { getUserId } = require("../utils");

const board = (parent, args, context, info) => {
  return context.prisma.board({ id: args.id });
};

const boards = (parent, args, context, info) => {
  const boards = context.prisma.boards({
    where: { createdBy: { id: getUserId(context) } }
  });

  console.log(boards);

  return boards;
};

module.exports = {
  board,
  boards
};
