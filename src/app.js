const http = require('http');
const chalk = require('chalk');
const conf = require('./config');
const route = require('./helper/route');
const openUrl = require('./helper/open');

module.exports = class Server {
  constructor(cusConf) {
    this.conf = Object.assign({}, conf, cusConf);
  }
  start() {
    http.createServer((req, res) => {
      route(req, res, this.conf);
    })
      .listen(this.conf.port, this.conf.hostname, () => {
        const addr = `http://${this.conf.hostname}:${this.conf.port}`;
        console.log(`Server running at ${chalk.green(addr)}`); // eslint-disable-line
        openUrl(addr);
      });
  }
};
