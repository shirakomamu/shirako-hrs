const path = require("path");
const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  server: path.join(__dirname, "/src/"),
  common: path.join(__dirname, "/../common/"),
});

module.exports = require("./src/app");
