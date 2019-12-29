const createdBy = (parent, args, context) => {
  return context.prisma.column({ id: parent.id }).createdBy();
};

const tasks = (parent, args, context) => {
  return context.prisma.column({ id: parent.id }).tasks();
};

const board = (parent, args, context) => {
  return context.prisma.column({ id: parent.id }).board();
};

module.exports = {
  createdBy,
  tasks,
  board
};
