const jwt = require("jsonwebtoken");
const moment = require("moment");

const getUserId = context => {
  const Authorization = context.request
    ? context.request.get("Authorization")
    : context.connection.context.Authorization;

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return userId;
  }

  console.log("Not authenticated");
  throw new Error("Not authenticated");
};

const getUser = context => {
  return context.prisma.getUser({ id: getUserId(context) });
};

const getTimestamp = () => {
  return moment().unix();
};

module.exports = {
  getUserId,
  getUser,
  getTimestamp
};
