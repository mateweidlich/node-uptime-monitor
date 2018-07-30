const fs = require('fs');
const path = require('path');

const helpers = require('./helpers');

const lib = {
  baseDir: path.join(__dirname, '/../.data')
};

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.writeFile(fileDescriptor, JSON.stringify(data), err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(null);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exists');
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
    if (!err && data) {
      callback(false, helpers.parseJsonToObject(data));
    } else {
      callback(err, data);
    }
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.truncate(fileDescriptor, err => {
        if (!err) {
          fs.writeFile(fileDescriptor, JSON.stringify(data), err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(null);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet');
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
    if (!err) {
      callback(null);
    } else {
      callback('Error deleting file');
    }
  });
};

module.exports = lib;
