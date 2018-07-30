const helpers = require('./helpers');
const _data = require('./data');

const handlers = {};

// user handlers
handlers.users = (data, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    // not acceptable method
    callback(405);
  }
};

handlers._users = {};

// GET /users handler
handlers._users.get = (data, callback) => {
  const { phone = false } = data.query;

  if (phone) {
    _data.read('users', phone, (err, data) => {
      if (!err && data) {
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// POST /users handler
handlers._users.post = (data, callback) => {
  const {
    firstName = false,
    lastName = false,
    phone = false,
    password = false,
    tosAgreement = false
  } = data.payload;

  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read('users', phone, (err, data) => {
      if (err) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const user = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement
          };

          _data.create('users', phone, user, err => {
            if (!err) {
              callback(200, { success: 'New user have been created' });
            } else {
              console.log(err);
              callback(500, { error: 'Could not create the new user' });
            }
          });
        } else {
          callback(500, { error: 'Could not hast the password' });
        }
      } else {
        callback(400, { error: 'User already exists' });
      }
    });
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// PUT /users handler
handlers._users.put = (data, callback) => {
  const {
    firstName = false,
    lastName = false,
    phone = false,
    password = false
  } = data.payload;

  if (phone) {
    if (firstName || lastName || password) {
      _data.read('users', phone, (err, userData) => {
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }

          if (lastName) {
            userData.lastName = lastName;
          }

          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }

          _data.update('users', phone, userData, err => {
            if (!err) {
              callback(200, { success: 'User is updated' });
            } else {
              console.log(err);
              callback(500, { error: 'Could not update the user' });
            }
          });
        } else {
          callback(400, { error: 'The user does not exists' });
        }
      });
    } else {
      callback(400, { error: 'Missing fields to update' });
    }
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// DELETE /users handler
handlers._users.delete = (data, callback) => {
  const { phone = false } = data.query;

  if (phone) {
    _data.read('users', phone, (err, data) => {
      if (!err && data) {
        _data.delete('users', phone, err => {
          if (!err) {
            callback(200, { success: 'The user has been deleted' });
          } else {
            callback(500, { error: 'Could not delete the specified user' });
          }
        });
      } else {
        callback(400, { error: 'Could not find the specified user' });
      }
    });
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// 404 handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
