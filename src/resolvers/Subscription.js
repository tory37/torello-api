const onLinkCreateSubscribe = (parent, args, context, info) => {
  return context.prisma.$subscribe.link({ mutation_in: ["CREATED"] }).node();
};

const onLinkCreate = {
  subscribe: onLinkCreateSubscribe,
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  onLinkCreate
};
