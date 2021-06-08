const path = require("path");
const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  "~~": path.join(__dirname, "/../"),
  "@@": path.join(__dirname, "/../"),
  src: path.join(__dirname, "/src/"),
});

module.exports = require("./app");
