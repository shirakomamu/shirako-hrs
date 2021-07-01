'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210616231150 extends Migration {

  async up() {
    this.addSql('create table "member_verification" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "otp_code" varchar(255) not null, "otp_token" varchar(255) not null, "claimed" bool not null, "member_id" bigint not null);');
    this.addSql('alter table "member_verification" add constraint "member_verification_otp_token_unique" unique ("otp_token");');

    this.addSql('alter table "member_verification" add constraint "member_verification_member_id_foreign" foreign key ("member_id") references "member" ("id") on update cascade;');
  }

}
exports.Migration20210616231150 = Migration20210616231150;
