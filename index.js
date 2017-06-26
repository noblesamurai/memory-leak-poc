const { Readable, Writable } = require('stream');
const memwatch = require('memwatch-next');
const knex = require('knex')(':memory:');

describe.only('test()', () => {
  let rs;
  let ws;
  before(() => {
    rs = new Readable({ read: (size) => {} });
    ws = new Writable({ write: (rec, enc, cb) => {
      knex('users').select();
      cb();
    }, highWaterMark: 1 });
    rs.pipe(ws)
    return knex.schema.createTable('users', function (table) {
      table.increments();
      table.string('name');
      table.timestamps();
    });
  });
  it('does not leak when doing stuff', async function () {
    memwatch.once('leak', function(info) { console.log(info); });
    this.timeout(20000);
    for (i = 0; i < 30; i++) {
      await new Promise((resolve, reject) => {
        rs.push('beep\n');
        ws.once('drain', () => {
          resolve();
        });
      });
    }
    memwatch.removeAllListeners('leak');
  });
});

function Person() {
  this.age = 1;
  this.name = 'mike';
}
