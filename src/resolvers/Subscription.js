const { getUserId } = require("../utils");

const boardSub = {
  subscribe: async (parent, args, context) => {
    const userId = getUserId(context);
    const node = {
      createdBy: { id: userId }
    };

    if (args.id) {
      node.id = args.id;
    }
    const sub = context.prisma.$subscribe.board({
      mutation_in: ["CREATED", "UPDATED"],
      node
    });
    return sub.node();
  },
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  boardSub
};
