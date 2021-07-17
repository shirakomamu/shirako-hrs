'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210717024853 extends Migration {

  async up() {
    this.addSql('alter table "destination" drop constraint if exists "destination_display_phone_check";');
    this.addSql('alter table "destination" alter column "display_phone" type varchar(255) using ("display_phone"::varchar(255));');
  }

}
exports.Migration20210717024853 = Migration20210717024853;
