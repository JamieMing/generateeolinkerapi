const fs = require("fs");
const pinyin = require("pinyin");
/**
 *  按需写入文件
 * @param {string} file 文件字符串
 * @param {object} __config__ 配置
 * @param {string} moduleName 模块名称
 * @param {boolean} isType 是否ts类型文件
 */
module.exports = function (file, __config__, moduleName, isType) {
  moduleName = moduleName
    .split("/")
    .map((item) => {
      return pinyin(item, {
        style: pinyin.STYLE_NORMAL,
      })
        .map((word) => word[0].replace(/^\w/, ($0) => $0.toUpperCase()) || "")
        .join("");
    })
    .join("/");

  // 文件名
  let filename =
    __config__.distType == "inner"
      ? `${isType ? "typings.d.ts" : "index.ts"}`
      : `${__config__.distFileName}${isType ? ".d.ts" : ".ts"}`;
  // 路径
  let dir =
    __config__.distType == "inner"
      ? `${__config__.distDir}/${moduleName}`
      : `${__config__.distDir}`;
  let url = `${dir}/${filename}`;
  fs.access(dir, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(url, file, function (err) {
      if (err) {
        console.log("写入失败", err);
      } else {
        console.log(`写入${isType ? "参数类型" : "api方法"}成功`);
      }
    });
  });
};
