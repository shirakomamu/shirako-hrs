'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210720000746 extends Migration {

  async up() {
    this.addSql('create table "destination" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "yelp_id" varchar(255) not null, "name" varchar(255) not null, "url" varchar(512) not null, "price" varchar(255) not null, "rating" int4 not null, "review_count" int4 not null, "display_address" jsonb not null, "display_phone" varchar(255) not null, "timezone" varchar(255) not null, "hours" jsonb not null, "special_hours" jsonb not null);');
    this.addSql('alter table "destination" add constraint "destination_yelp_id_unique" unique ("yelp_id");');

    this.addSql('create table "member" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "sub" varchar(255) not null);');
    this.addSql('alter table "member" add constraint "member_sub_unique" unique ("sub");');

    this.addSql('create table "friend" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "user_id" bigint not null, "friend_id" bigint not null);');

    this.addSql('create table "destination_list" ("id" bigserial primary key, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "owner_id" bigint not null, "name" varchar(255) not null, "description" varchar(255) null, "visibility" text check ("visibility" in (\'list\', \'friends\', \'anyone\')) not null);');

    this.addSql('create table "destination_list_destinations" ("destination_list_id" bigint not null, "destination_id" bigint not null);');
    this.addSql('alter table "destination_list_destinations" add constraint "destination_list_destinations_pkey" primary key ("destination_list_id", "destination_id");');

    this.addSql('create table "destination_list_shared_with" ("destination_list_id" bigint not null, "member_id" bigint not null);');
    this.addSql('alter table "destination_list_shared_with" add constraint "destination_list_shared_with_pkey" primary key ("destination_list_id", "member_id");');

    this.addSql('alter table "friend" add constraint "friend_user_id_foreign" foreign key ("user_id") references "member" ("id") on update cascade;');
    this.addSql('alter table "friend" add constraint "friend_friend_id_foreign" foreign key ("friend_id") references "member" ("id") on update cascade;');

    this.addSql('alter table "destination_list" add constraint "destination_list_owner_id_foreign" foreign key ("owner_id") references "member" ("id") on update cascade;');

    this.addSql('alter table "destination_list_destinations" add constraint "destination_list_destinations_destination_list_id_foreign" foreign key ("destination_list_id") references "destination_list" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "destination_list_destinations" add constraint "destination_list_destinations_destination_id_foreign" foreign key ("destination_id") references "destination" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "destination_list_shared_with" add constraint "destination_list_shared_with_destination_list_id_foreign" foreign key ("destination_list_id") references "destination_list" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "destination_list_shared_with" add constraint "destination_list_shared_with_member_id_foreign" foreign key ("member_id") references "member" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "friend" add constraint "userFriend" unique ("user_id", "friend_id");');
  }

}
exports.Migration20210720000746 = Migration20210720000746;
