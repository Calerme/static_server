// const path = require('path');

module.exports = {
  port: 9527,
  hostname: '127.0.0.1',
  static: process.cwd(),
  root: process.cwd(),
  compress: /(html|js|css|md)/,
  cache: {
    maxAge: 600, // 秒
    expires: true,
    cacheControl: true,
    lastModified: true,
    eTag: true,
  },
};
