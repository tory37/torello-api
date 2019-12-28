const { getUserId } = require("../utils");

const feed = (parent, args, context, info) => {
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};

  const links = context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });

  const count = await context.prisma
    .linksConnection({
      where,
    }).aggregate().count()

  return {
    links,
    count
  }
};

const userLinks = (parent, args, context, info) => {
  const userId = getUserId(context);

  const user = context.prisma.user({ id: userId });

  const data = context.prisma.links({ where: { postedBy: user } });
  return data;
};

module.exports = {
  feed,
  userLinks
};
