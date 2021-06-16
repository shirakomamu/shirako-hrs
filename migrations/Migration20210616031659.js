'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210616031659 extends Migration {

  async up() {
    this.addSql('alter table "member" drop constraint if exists "member_email_check";');
    this.addSql('alter table "member" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "member" alter column "email" set not null;');
  }

}
exports.Migration20210616031659 = Migration20210616031659;
