const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
const { getProjectList } = require("./request");
const { apiRequestTypeDict, paramTypeDict } = require("./dict");
const fs = require("fs");

let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
/**
 * 终端交互获取项目id
 */
const getProjectFromTerminal = async () => {
  console.log("获取项目列表中");
  const projectList = await getProjectList();
  const promptList = [
    {
      type: "list",
      name: "projectId",
      message: "请选择项目",
      choices: projectList.map((item) => {
        return {
          name: item.projectName,
          value: item.projectID,
        };
      }),
    },
  ];

  let { projectId } = await inquirer.prompt(promptList);
  console.log("项目id：", projectId);
  return projectId;
};

/**
 * 更新历史
 * @param {*} groupId
 * @param {*} groupName
 */
const updateHistory = (groupId, groupName, projectId) => {
  const dir = "./src/.generateApi";
  const prod_dir = "./node_modules/generateeolinkerapi/src/.generateApi";
  const history = require("./.generateApi/moduleHistory.js");
  const index = history.findIndex((item) => item.id == groupId);
  if (index > -1) {
    history.splice(index, 1);
  }
  history.unshift({ id: groupId, name: groupName, projectId });
  if (history.length > 100) {
    history = history.slice(0, 100);
  }
  try {
    // fs.accessSync(dir, fs.constants.F_OK);
    fs.accessSync(prod_dir, fs.constants.F_OK);
  } catch (error) {
    // fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(prod_dir, { recursive: true });
  }
  // fs.writeFileSync(
  //   dir + "/moduleHistory.js",
  //   `module.exports = ${JSON.stringify(history)}`
  // );
  fs.writeFileSync(
    prod_dir + "/moduleHistory.js",
    `module.exports = ${JSON.stringify(history)}`
  );
};
/**
 * 获取选择的模块id
 * */
const getGroupFromTerminal = async ({ groupList, projectId }) => {
  groupList = groupList.reduce((res, cur) => {
    res.push(cur);
    if (cur.childGroupList.length) {
      res = res.concat(
        cur.childGroupList.map((item) => {
          item.groupName = `  ${cur.groupName}->${item.groupName}`;
          return item;
        })
      );
    }
    return res;
  }, []);
  const promptList = [
    {
      type: "autocomplete",
      message: `选择模块${
        __config__.distType == "inner" ? "（建议子级模块优先）" : ""
      }:`,
      name: "groupId",
      // suggestOnly: true,
      pageSize: 10,
      source: (answers, input) => {
        input = input || "";
        return new Promise(function (resolve) {
          var fuzzyResult = fuzzy.filter(input, groupList, {
            extract: function (el) {
              return el.groupName;
            },
          });
          resolve(
            fuzzyResult.map(function (el) {
              return {
                name: el.original.groupName,
                value: el.original.groupID,
              };
            })
          );
        });
      },
    },
  ];

  const { groupId } = await inquirer.prompt(promptList);
  const groupName = groupList
    .find((i) => i.groupID == groupId)
    .groupName.trim()
    .replace("->", "/");
  updateHistory(groupId, groupName, projectId);
  return [groupId, groupName];
};

const formatFirstWordCase = () => {};
/**
 * 获取格式化后的api名称
 * */
const getApiName = (uri, apiRequestType) => {
  if (!apiRequestTypeDict[apiRequestType]) {
    throw new Error("请求方式有误");
  }
  const { isRestfulApi } = __config__;
  let apiName = uri.split("/").filter((i) => !/^\:/.test(i));
  const length = Math.ceil((apiName.length * 2) / 3);
  apiName = apiName
    .slice(length * -1) //动态截取
    .join("_");
  apiName = apiName == "delete" ? "remove" : apiName;
  // 下划线转大驼峰
  apiName = apiName
    .split("_")
    .map((i) => i.replace(/^\w/, ($0) => $0.toUpperCase()))
    .join("");
  const methodName = isRestfulApi
    ? apiRequestTypeDict[apiRequestType][0] + apiName
    : apiName.replace(/^\w/, ($0) => $0.toLowerCase());
  const typePrefixName = isRestfulApi
    ? apiRequestTypeDict[apiRequestType][0].replace(/^\w/, ($0) =>
        $0.toUpperCase()
      ) + apiName
    : apiName;
  return [methodName, typePrefixName];
};

/**
 * 获取参数类型
 * @param {*} request
 * @returns {string}
 */
const getParamType = (request) => {
  const { paramType, paramValueList } = request;
  if (paramValueList && paramValueList.length) {
    return paramValueList
      .map((item) => {
        return (
          (paramTypeDict[paramType] == "string"
            ? `'${item.value}'`
            : item.value) +
          (item.valueDescription ? `/** ${item.valueDescription} */` : "")
        );
      })
      .join(" | ");
  }
  if (paramTypeDict[paramType]) {
    return paramTypeDict[paramType];
  }
  return "未知，请检查";
};

/**
 * 从api数据当中构造参数json
 * @param {*} data
 * @returns {{[k in string]: 'string'|'number' }}
 */
const getJsonDataFromApi = (data) => {
  // data.map(item=>item.paramKey)
  return data.reduce((res, cur) => {
    let keys = cur.paramKey.split(">>");
    let lastObj = keys.reduce((obj, key) => {
      if (!obj) {
        console.log(res, "可能有参数未准确拼写，请在eolinker检查接口返回参数");
      }
      if (obj[key] == undefined) {
        if (cur.paramType < 12) {
          obj[key] = paramTypeDict[cur.paramType];
        } else {
          obj[key] = {
            ...(cur.paramType == 12 ? { isArray: true } : {}),
          };
        }
      }
      return obj[key];
    }, res);
    lastObj = { ...lastObj, ...cur };
    return res;
  }, {});
};

/**
 * 从历史中查找模块
 */
const getModuleFromHistory = async () => {
  const history = require("./.generateApi/moduleHistory");
  console.log("获取历史生成模块数据");
  const promptList = [
    {
      type: "list",
      name: "groupId",
      message: "选择模块",
      choices: history.map((item) => {
        return {
          name: item.name,
          value: item.id,
        };
      }),
    },
  ];

  let { groupId } = await inquirer.prompt(promptList);
  //   console.log("项目：", projectId);
  const res = history.find((i) => i.id == groupId);
  return res;
};

module.exports = {
  getProjectFromTerminal,
  getGroupFromTerminal,
  getApiName,
  getParamType,
  getJsonDataFromApi,
  getModuleFromHistory,
};
