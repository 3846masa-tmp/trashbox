const fs = require('fs-promise');
const { sync: glob } = require('glob');
const fm = require('front-matter');
const { slugize } = require('hexo-util');
const path = require('path');

const files = glob('./*.md');

Promise.all(
  files.map((file) => {
    const pm = Promise.resolve()
      .then(() => fs.readFile(file, 'utf8'))
      .then((md) => fm(md))
      .then((d) => d.attributes.title)
      .then((title) => `${slugize(title)}.md`)
      .then((newName) => fs.move(file, newName));
    return pm;
  })
).then(() => {})
.catch((err) => console.error(err.stack || err));
