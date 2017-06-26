const { Readable } = require('stream');
const memwatch = require('memwatch-next');
const knex = require('knex')(':memory:');

describe.only('test()', () => {
  let rs;
  let ws;
  before(() => {
    ws = require('./write-stream')(knex);
    rs = new Readable({ read: (size) => {}, objectMode: true });
    rs.pipe(ws);
    return knex.schema.createTable('users', function (table) {
      table.increments();
      table.string('name');
      table.timestamps();
    }).then(() => console.log('schema done'));
  });

  it('does not leak when doing stuff', function (done) {
    memwatch.once('leak', function (info) { console.log(info); });
    this.timeout(20000);
    for (let i = 0; i < 30000; i++) {
      rs.push({ my: Buffer.alloc(100000) });
    }
    rs.push(null);
    ws.on('finish', () => done());
  });
});
