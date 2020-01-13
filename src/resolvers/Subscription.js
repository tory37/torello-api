const {getUserId} = require('../utils');

const boardSub = {
  subscribe: async (parent, args, context) => {
    console.log('Subscription established');
    const userId = getUserId(context, args.authToken);
    const node = {
      createdBy: {id: userId},
    };

    const sub = context.prisma.$subscribe.board({
      mutation_in: ['CREATED', 'UPDATED'],
      node,
    });
    return sub.node();
  },
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  boardSub,
};
