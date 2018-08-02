const crypto = require('crypto');

const config = require('./config');

const helpers = {};

helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    return crypto
      .createHmac('sha256', config.hashSecret)
      .update(str)
      .digest('hex');
  } else {
    return null;
  }
};

helpers.parseJsonToObject = str => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return { error: 'JSON parse failed' };
  }
};

module.exports = helpers;
