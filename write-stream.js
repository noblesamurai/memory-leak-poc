const { Writable } = require('stream');

class MyStream extends Writable {
  constructor (knex) {
    super({ objectMode: true });
    this.knex = knex;
  }
  _write (rec, enc, cb) {
    this.knex('users').where({ name: 'blah' }).first().then(() => {
      cb();
    });
  }
}

module.exports = function (knex) {
  return new MyStream(knex);
};
