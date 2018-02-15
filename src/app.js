const http = require('http');
const chalk = require('chalk');
const conf = require('./config');
const route = require('./helper/route');

http.createServer((req, res) => {
  route(req, res);
})
  .listen(conf.port, conf.hostname, () => {
    const addr = chalk.green(`Server running at ${conf.hostname}:${conf.port}`);
  console.log(addr); // eslint-disable-line
  });
