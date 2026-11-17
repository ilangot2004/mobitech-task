const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "..", "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

module.exports = { readData, writeData };
