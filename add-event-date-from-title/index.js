const fs = require('fs-promise');
const { sync: glob } = require('glob');
const fm = require('front-matter');
const YAML = require('js-yaml');

const files = glob('./*.md');

Promise.all(
  files.map((file) => {
    const pm = Promise.resolve()
      .then(() => fs.readFile(file, 'utf8'))
      .then((md) => fm(md))
      .then((d) => {
        const matches = d.attributes.title.match(/^([\d\.-]+)\s+(.+)$/);
        if (!matches) {
          return;
        }
        d.attributes.event_date = matches[1];
        d.attributes.title = matches[2];
        const data = `---\n${YAML.dump(d.attributes)}\n---\n${d.body}`;
        return fs.writeFile(file, data);
      });
    return pm;
  })
).then(() => {})
.catch((err) => console.error(err.stack || err));
