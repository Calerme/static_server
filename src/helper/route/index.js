const path = require('path');
const fs = require('fs');
const conf = require('../../config');
const { promisify } = require('util');
const pug = require('pug');
const mime = require('../mime');
const compress = require('../compress');
const range = require('../range');
const isFresh = require('../cache');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const htmlGenerator = pug.compileFile(path.resolve(conf.root, 'src/template/index.pug'));


module.exports = async function route(req, res) {
  try {
    const filePath = path.join(conf.static, req.url);
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const fileMime = mime(filePath);
      res.setHeader('Content-Type', `${fileMime}; charset=utf-8`);

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const { code, start, end } = range(stat.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end });
      }
      if (path.extname(filePath).match(conf.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf8');
      const files = await readdir(filePath);
      const dir = path.relative(conf.static, filePath);
      const data = {
        title: path.basename(filePath),
        path: dir ? `/${dir}` : '',
        files,
      };
      const html = htmlGenerator(data);
      res.end(html);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf8');
      res.end(`Can't find ${filePath}`);
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf8');
    res.end('服务器错误');
    console.error(err); // eslint-disable-line
  }
};
