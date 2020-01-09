const jwt = require('jsonwebtoken');
const moment = require('moment');

const parseAuthHeader = (context) => {
  // let authorization = null;

  // if (context.request) {
  //   authorization = context.request.get('Authorization');
  // }

  // if (!authorization) {
  //   authorization = lodash.get(context, "connection.context.Authorization");
  // }
  // authorization = lodash.get(context, "request")

  return context.req.headers.authorization;
};

const getUserId = (context) => {
  try {
    const Authorization = parseAuthHeader(context);

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');
      const {userId} = jwt.verify(token, process.env.APP_SECRET);
      return userId;
    }

    console.log('Not authenticated');
    throw new Error('Not authenticated');
  } catch (err) {
    throw err;
  }
};

const getUser = (context) => {
  return context.prisma.getUser({id: getUserId(context)});
};

const getTimestamp = () => {
  return moment().unix();
};

module.exports = {
  getUserId,
  getUser,
  getTimestamp,
};
