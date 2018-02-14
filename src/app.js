const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config');

http.createServer((req, res) => {
  const filePath = path.join(conf.static, req.url);
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Something Wrong!');
      return;
    }

    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream(filePath)
        .pipe(res);
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plane');
        res.end(files.join(','));
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.end(`Can't find ${filePath}`);
    }
  });
})
  .listen(conf.port, conf.hostname, () => {
    const addr = chalk.green(`Server running at ${conf.hostname}:${conf.port}`);
    console.log(addr); // eslint-disable-line
  });
