'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210720001303 extends Migration {

  async up() {
    this.addSql('alter table "destination" drop constraint if exists "destination_timezone_check";');
    this.addSql('alter table "destination" alter column "timezone" type varchar(255) using ("timezone"::varchar(255));');
    this.addSql('alter table "destination" alter column "timezone" drop not null;');
  }

}
exports.Migration20210720001303 = Migration20210720001303;
