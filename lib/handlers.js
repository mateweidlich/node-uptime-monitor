const handlers = {};

// user handlers
handlers._users = require('./handlers/user');
handlers.users = async data => {
  const methods = ['post', 'get', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    return await handlers._users[data.method](data);
  } else {
    return [405]; // not acceptable method
  }
};

// token handlers
handlers._tokens = require('./handlers/token');
handlers.tokens = async data => {
  const methods = ['post', 'get', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    return await handlers._tokens[data.method](data);
  } else {
    return [405]; // not acceptable method
  }
};

// ping handler
handlers.ping = async (data, callback) => {
  return [200];
};

// 404 handler
handlers.notFound = async (data, callback) => {
  return [404];
};

module.exports = handlers;
