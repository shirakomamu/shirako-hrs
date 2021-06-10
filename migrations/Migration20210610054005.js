'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210610054005 extends Migration {

  async up() {
    this.addSql('create table "member" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "username" varchar(255) not null, "discriminator" int4 not null, "email" varchar(255) null, "pw_hash" varchar(255) not null);');

    this.addSql('create table "api_key" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "key" varchar(255) not null, "use_count" int4 not null default 0, "member_id" bigint not null);');
    this.addSql('alter table "api_key" add constraint "api_key_key_unique" unique ("key");');

    this.addSql('alter table "api_key" add constraint "api_key_member_id_foreign" foreign key ("member_id") references "member" ("id") on update cascade;');

    this.addSql('alter table "member" add constraint "fullUsername" unique ("username", "discriminator");');
  }

}
exports.Migration20210610054005 = Migration20210610054005;
