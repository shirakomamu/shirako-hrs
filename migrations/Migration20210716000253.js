'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210716000253 extends Migration {

  async up() {
    this.addSql('alter table "destination" add column "name" varchar(255) not null, add column "url" varchar(255) not null, add column "price" varchar(255) not null, add column "rating" int4 not null, add column "review_count" int4 not null, add column "display_address" text[] not null, add column "display_phone" int4 not null, add column "hours" text[] not null, add column "special_hours" text[] not null;');
  }

}
exports.Migration20210716000253 = Migration20210716000253;
