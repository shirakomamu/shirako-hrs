'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210617175101 extends Migration {

  async up() {
    this.addSql('alter table "member" drop constraint "fullUsername";');

    this.addSql('alter table "member" add constraint "fullDisplayName" unique ("display_name", "discriminator");');
  }

}
exports.Migration20210617175101 = Migration20210617175101;
