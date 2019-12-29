const createdBy = (parent, args, context) => {
  return context.prisma.board({ id: parent.id }).createdBy();
};

const columns = (parent, args, context) => {
  return context.prisma.board({ id: parent.id }).columns();
};

module.exports = {
  createdBy,
  columns
};
