const helpers = require('../helpers');
const _data = require('../data');

const _tokens = {};

// POST /tokens handler
_tokens.post = async data => {
  const { phone = null, password = null } = data.payload;

  if (phone && password) {
    try {
      const userData = await _data.read('users', phone);

      if (helpers.hash(password) === userData.hashedPassword) {
        const id = helpers.createRandomString(20);
        const expires = Date.now() + 1000 * 60 * 60; // 1 hour
        const token = { phone, id, expires };

        try {
          await _data.create('tokens', id, token);
          return [200, token];
        } catch (err) {
          console.log(err);
          return [500, { error: 'Could not create token' }];
        }
      } else {
        return [400, { error: 'Password did not match the stored password' }];
      }
    } catch (err) {
      return [400, { error: 'Could not find the specified user' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// POST /tokens handler
_tokens.get = async data => {
  const { id = null } = data.query;

  if (id && id.length === 20) {
    try {
      const tokenData = await _data.read('tokens', id);
      return [200, tokenData];
    } catch (err) {
      return [404, { error: 'Token not found' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// POST /tokens handler
_tokens.put = async data => {
  const { id = null, extend = false } = data.query;

  if (id && id.length === 20 && extend) {
    try {
      const tokenData = await _data.read('tokens', id);

      if (tokenData.expires > Date.now()) {
        tokenData.expires = Date.now() + 1000 * 60 * 60; // 1 hour

        try {
          await _data.update('tokens', id, tokenData);
          return [200, { success: 'Token expiration is updated' }];
        } catch (err) {
          console.log(err);
          return [500, { error: 'Could not update token expiration' }];
        }
      } else {
        return [404, { error: 'Token is expired already' }];
      }
    } catch (err) {
      return [404, { error: 'Token not found' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

// POST /tokens handler
_tokens.delete = async data => {
  const { id = null } = data.query;

  if (id) {
    try {
      await _data.read('tokens', id);

      try {
        await _data.delete('tokens', id);
        return [200, { success: 'The token has been deleted' }];
      } catch (err) {
        console.log(err);
        return [500, { error: 'Could not delete the specified token' }];
      }
    } catch (err) {
      return [400, { error: 'Could not find the specified token' }];
    }
  } else {
    return [400, { error: 'Missing required fields' }];
  }
};

module.exports = _tokens;
