const createdBy = (parent, args, context) => {
  return context.prisma.task({ id: parent.id }).createdBy();
};

const column = (parent, args, context) => {
  return context.prisma.task({ id: parent.id }).column();
};

module.exports = {
  createdBy,
  column
};
