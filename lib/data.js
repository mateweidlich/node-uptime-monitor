const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const helpers = require('./helpers');

const lib = {
  baseDir: path.join(__dirname, '/../.data'),
  fsOpen: promisify(fs.open),
  fsClose: promisify(fs.close),
  fsTruncate: promisify(fs.ftruncate),
  fsUnlink: promisify(fs.unlink),
  fsReadFile: promisify(fs.readFile),
  fsWriteFile: promisify(fs.writeFile)
};

lib.getFilePath = (dir, file) => {
  return `${lib.baseDir}/${dir}/${file}.json`;
};

lib.create = async (dir, file, data) => {
  const fileDescriptor = await lib.fsOpen(lib.getFilePath(dir, file), 'wx');
  await lib.fsWriteFile(fileDescriptor, JSON.stringify(data));
  await lib.fsClose(fileDescriptor);
};

lib.read = async (dir, file) => {
  const data = await lib.fsReadFile(lib.getFilePath(dir, file), 'utf8');
  return helpers.parseJsonToObject(data);
};

lib.update = async (dir, file, data) => {
  const fileDescriptor = await lib.fsOpen(lib.getFilePath(dir, file), 'r+');
  await lib.fsTruncate(fileDescriptor);
  await lib.fsWriteFile(fileDescriptor, JSON.stringify(data));
  await lib.fsClose(fileDescriptor);
};

lib.delete = async (dir, file) => {
  await lib.fsUnlink(lib.getFilePath(dir, file));
};

module.exports = lib;
