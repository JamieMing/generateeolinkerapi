#! /usr/bin/env node
const [, , ...args] = process.argv;

if (args[0] == "update") {
  require("../src/update.js");
} else {
  require("../src/index.js");
}
