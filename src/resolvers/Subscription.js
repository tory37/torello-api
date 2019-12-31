const { getUserId } = require("../utils");

const board = {
  subscribe: async (parent, args, context) => {
    const userId = getUserId(context);
    const sub = context.prisma.$subscribe.board({
      mutation_in: ["CREATED"],
      node: {
        createdBy: { id: userId }
      }
    });
    return sub.node();
  },
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  board
};
