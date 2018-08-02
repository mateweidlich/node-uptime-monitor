const helpers = require('../helpers');
const _data = require('../data');

const _users = {};

_users.verifyToken = async (id, phone) => {
  try {
    const tokenData = await _data.read('tokens', id);
    return tokenData.phone === phone && tokenData.expires > Date.now();
  } catch (err) {
    return false;
  }
};

// POST /users handler
_users.post = async data => {
  const {
    firstName = null,
    lastName = null,
    phone = null,
    password = null,
    tosAgreement = null
  } = data.payload;

  if (firstName && lastName && phone && password && tosAgreement) {
    try {
      await _data.read('users', phone);
      return [400, { error: 'User already exists' }];
    } catch (err) {
      const hashedPassword = helpers.hash(password);

      if (hashedPassword) {
        const user = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosAgreement
        };

        try {
          await _data.create('users', phone, user);
          return [200, { success: 'New user have been created' }];
        } catch (err) {
          console.log(err);
          return [500, { error: 'Could not create the new user' }];
        }
      } else {
        return [500, { error: 'Could not hash the password' }];
      }
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// GET /users handler
_users.get = async data => {
  const { phone = null } = data.query;
  const { token = null } = data.headers;

  if (phone && token) {
    if (await _users.verifyToken(token, phone)) {
      try {
        const userData = await _data.read('users', phone);
        delete userData.hashedPassword;
        return [200, userData];
      } catch (err) {
        return [404, { error: 'User not found' }];
      }
    } else {
      return [403, { error: 'Invalid or expired token' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// PUT /users handler
_users.put = async data => {
  const {
    firstName = null,
    lastName = null,
    phone = null,
    password = null
  } = data.payload;
  const { token = null } = data.headers;

  if (phone && token) {
    if (await _users.verifyToken(token, phone)) {
      if (firstName || lastName || password) {
        try {
          const userData = await _data.read('users', phone);
          userData.firstName = firstName || userData.firstName;
          userData.lastName = lastName || userData.lastName;
          userData.hashedPassword =
            helpers.hash(password) || userData.hashedPassword;

          try {
            await _data.update('users', phone, userData);
            return [200, { success: 'User is updated' }];
          } catch (err) {
            console.log(err);
            return [500, { error: 'Could not update the user' }];
          }
        } catch (err) {
          return [400, { error: 'The user does not exists' }];
        }
      } else {
        return [400, { error: 'Missing fields to update' }];
      }
    } else {
      return [403, { error: 'Invalid or expired token' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// DELETE /users handler
_users.delete = async data => {
  const { phone = null } = data.query;
  const { token = null } = data.headers;

  if (phone && token) {
    if (await _users.verifyToken(token, phone)) {
      try {
        await _data.read('users', phone);

        try {
          await _data.delete('users', phone);
          return [200, { success: 'The user has been deleted' }];
        } catch (err) {
          console.log(err);
          return [500, { error: 'Could not delete the specified user' }];
        }
      } catch (err) {
        return [400, { error: 'Could not find the specified user' }];
      }
    } else {
      return [403, { error: 'Invalid or expired token' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

module.exports = _users;
