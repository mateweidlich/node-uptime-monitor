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

helpers.createRandomString = strLen => {
  if (typeof strLen === 'number' && strLen > 0) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for (let i = 1; i <= strLen; ++i) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
  } else {
    return false;
  }
};

module.exports = helpers;
