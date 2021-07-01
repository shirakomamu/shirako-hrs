'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210616031714 extends Migration {

  async up() {
    this.addSql('alter table "member" drop constraint if exists "member_display_name_check";');
    this.addSql('alter table "member" alter column "display_name" type varchar(255) using ("display_name"::varchar(255));');
    this.addSql('alter table "member" alter column "display_name" drop default;');
  }

}
exports.Migration20210616031714 = Migration20210616031714;
