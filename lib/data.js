const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const helpers = require('./helpers');

const _data = {
  baseDir: path.join(__dirname, '/../.data'),
  fsOpen: promisify(fs.open),
  fsClose: promisify(fs.close),
  fsTruncate: promisify(fs.ftruncate),
  fsUnlink: promisify(fs.unlink),
  fsReadFile: promisify(fs.readFile),
  fsWriteFile: promisify(fs.writeFile)
};

_data.getFilePath = (dir, file) => {
  return `${_data.baseDir}/${dir}/${file}.json`;
};

_data.create = async (dir, file, data) => {
  const fileDescriptor = await _data.fsOpen(_data.getFilePath(dir, file), 'wx');
  await _data.fsWriteFile(fileDescriptor, JSON.stringify(data));
  await _data.fsClose(fileDescriptor);
};

_data.read = async (dir, file) => {
  const data = await _data.fsReadFile(_data.getFilePath(dir, file), 'utf8');
  return helpers.parseJsonToObject(data);
};

_data.update = async (dir, file, data) => {
  const fileDescriptor = await _data.fsOpen(_data.getFilePath(dir, file), 'r+');
  await _data.fsTruncate(fileDescriptor);
  await _data.fsWriteFile(fileDescriptor, JSON.stringify(data));
  await _data.fsClose(fileDescriptor);
};

_data.delete = async (dir, file) => {
  await _data.fsUnlink(_data.getFilePath(dir, file));
};

module.exports = _data;
