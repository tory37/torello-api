const jwt = require("jsonwebtoken");
const APP_SECRET = "pokaya-37-kwah";
const moment = require("moment");

const getUserId = context => {
  const Authorization = context.request.get("Authorization");
  if (context && Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not authenticated");
};

const getUser = context => {
  return context.prisma.getUser({ id: getUserId(context) });
};

const getTimestamp = () => {
  return moment().unix();
};

module.exports = {
  APP_SECRET,
  getUserId,
  getUser,
  getTimestamp
};
