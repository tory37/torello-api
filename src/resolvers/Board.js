const createdBy = (parent, args, context) => {
  return context.prisma.board({ id: parent.id }).createdBy();
};

const columns = (parent, args, context) => {
  return context.prisma.board({ id: parent.id }).columns();
};

const columnCount = async (parent, args, context) => {
  const columns = await context.prisma.columns({
    where: { board: { id: parent.id } }
  });
  return columns.length;
};

const taskCount = async (parent, args, context) => {
  const tasks = await context.prisma.tasks({
    where: { column: { board: { id: parent.id } } }
  });
  return tasks.length;
};

module.exports = {
  createdBy,
  columns,
  columnCount,
  taskCount
};
