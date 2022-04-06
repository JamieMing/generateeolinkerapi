// 请求方式
const apiRequestTypeDict = {
  0: ["post", "params"],
  1: ["get", "{params}"],
  2: ["put", "params"], //
  3: ["delete", "{params}"], //
  4: ["head", "{params}"],
  5: ["options", "{params}"],
  6: ["patch", "params"],
};
const paramTypeDict = {
  0: "string",
  1: "any", // file
  2: "Record<string, unknown>", // json
  3: "number", //int
  4: "number", // float
  5: "number", // double
  6: "string", //date
  7: "string", //datetime
  8: "boolean",
  9: "number", // byte
  10: "number", // short
  11: "number", // long
  12: "(number | string)[]",
  13: "Record<string, unknown>", // object
  14: "number", //number
};

module.exports = {
  apiRequestTypeDict,
  paramTypeDict,
};
