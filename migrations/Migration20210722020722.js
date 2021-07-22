'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210722020722 extends Migration {

  async up() {
    this.addSql('alter table "destination" add column "image_url" varchar(255) null;');
  }

}
exports.Migration20210722020722 = Migration20210722020722;
