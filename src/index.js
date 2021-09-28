const axios = require("axios");
// const fs = require("fs");
const qs = require("qs");
const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
const writeFile = require("./writeFile");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
console.log(__config__);

let currentModuleName = "";
const http = axios.create({
  headers: {
    Cookie: "PHPSESSID=gf6bohf0ed444spjdan1l0kvt5",
    Host: __config__.domain.replace("https://", ""),
    Origin: __config__.domain,
    "Content-Type": "application/x-www-form-urlencoded",
    //go_admin_session: '', //会自动添加
  },
});
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    // console.log(response.request)
    let res = response.data;
    // console.log(res);
    // 提前判断
    return res;
  },
  async (error) => {
    let response = error.response;
    console.log(response);
    return Promise.reject(response.data);
  }
);
const main = async () => {
  // 登录
  console.log("登录中");
  let { userID } = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Guest&o=login`,
    qs.stringify({
      loginName: __config__.username,
      loginPassword: __config__.password,
    })
  );
  if (userID) {
    console.log("登录成功");
  } else {
    console.error("登录失败");
    return;
  }

  console.log(
    "获取模块列表中，有时候很快，有时候可能需要两分钟，耐心等一下就好"
  );
  let { groupList } = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Group&o=getGroupList`,
    qs.stringify({
      projectID: __config__.projectId,
      groupID: -1,
      childGroupID: -1,
    })
  );

  if (!groupList) {
    console.error(
      "列表获取有问题，可能是用户账号和密码错误，也可能是项目id不正确"
    );
    return;
  } else {
    console.log("获取模块列表成功");
  }
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
      name: "group",
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
      // choices: groupList.map(item => {
      //     return {
      //         name: item.groupName,
      //         value: item.groupID
      //     }
      // })
    },
  ];

  let { group } = await inquirer.prompt(promptList);
  console.log(group);
  console.log("获取api列表中");
  currentModuleName = groupList
    .find((i) => i.groupID == group)
    .groupName.trim()
    .replace("->", "/");
  let { apiList } = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApiList`,
    qs.stringify({
      projectID: __config__.projectId,
      groupID: group,
      orderBy: 1,
      asc: 1,
    })
  );
  console.log("获取api列表成功");
  console.log(apiList);
  await generateFile(apiList);
  await generateTypeFile(apiList);

  // 退出登录
  await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=User&o=logout`
  );
};

main();

function getApiName(uri) {
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
  return [apiName.replace(/^\w/, ($0) => $0.toLowerCase()), apiName];
}
function generateFile(data) {
  let file = `
import request from './request';`;
  file += data
    .map((api) => {
      let [apiName, ApiName] = getApiName(api.apiURI);
      let temp = `
/**
 * ${api.apiName}
 * ${__config__.domain}/#/home/project/inside/api/detail?groupID=${
        api.groupID
      }&apiID=${
        api.apiID
      }&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=${
        __config__.projectId
      }
*/
export async function ${apiName}(params: API.${ApiName}Params): Promise<API.${ApiName}Responce> {
    return request.${
      api.apiRequestType == "1" ? "get" : "post"
    }(\`${api.apiURI.replace(/:(\w+)/g, function ($0, $1) {
        return `\$\{params.${$1}\}`;
      })}\`, ${api.apiRequestType == "1" ? "{params}" : "params"})
}`;
      return temp;
    })
    .join("");
  try {
    writeFile(file, __config__, currentModuleName, false);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
}
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
  12: "number[]",
  13: "Record<string, unknown>", // object
  14: "number", //number
};
const getParamType = (request) => {
  const { paramType, paramValueList } = request;
  if (paramValueList.length) {
    return paramValueList
      .map((item) => {
        return (
          (paramTypeDict[paramType] == "string"
            ? `'${item.value}'`
            : item.value) + `/** ${item.valueDescription} */`
        );
      })
      .join(" | ");
  }
  if (paramTypeDict[paramType]) {
    return paramTypeDict[paramType];
  }
  return "未知，请检查";
};
async function generateTypeFile(data) {
  let file = `
declare namespace API {`;
  let tasks = data.map((api) => {
    return new Promise(async (resolve) => {
      let {
        apiInfo: { requestInfo, resultInfo },
      } = await http.post(
        `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApi`,
        qs.stringify({
          projectID: __config__.projectId,
          groupID: api.groupID,
          apiID: api.apiID,
        })
      );
      let [apiName, ApiName] = getApiName(api.apiURI);
      let params = `\n    type ${ApiName}Params = {\n${requestInfo
        .map((request) => {
          return `        /** ${request.paramName} */\n       ${
            request.paramKey
          }${request.paramNotNull == "1" ? "?" : ""}: ${getParamType(request)}`;
        })
        .join("\n")}\n   }`;

      let respObj = generateResponce(resultInfo);
      params += `\n       type ${ApiName}Responce = ${handleGenerateResponceType(
        resultInfo
      )(respObj.data)}${respObj.data && respObj.data.isArray ? "[]" : ""}`;

      resolve(params);
    });
  });
  let params = await Promise.all(tasks);
  file += params.join("");
  file += "\n}";

  try {
    writeFile(file, __config__, currentModuleName, true);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
}

function generateResponce(data) {
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
}
function handleGenerateResponceType(resultInfo) {
  function findRespTypeName(keys) {
    let res = resultInfo.find((item) => {
      return item.paramKey == keys;
    });
    return res ? res.paramName : "";
  }
  const generateResponceType = (data, paramKey = "data") => {
    data = data || {};
    let params = [];
    for (let key in data) {
      if (key != "isArray") {
        if (typeof data[key] == "string") {
          // if (key != 'isArray') {
          // console.log(key)
          params.push(
            `/** ${findRespTypeName(paramKey + ">>" + key)} */\n'${key}': ${
              data[key]
            }`
          );
          // }
        } else {
          params.push(
            `'${key}': ${generateResponceType(
              data[key],
              paramKey + ">>" + key
            )}${data[key].isArray ? "[]" : ""}`
          );
        }
      }
    }
    if (params.length == 0) {
      return `Record<string, unknown>`;
    }
    return `{\n${params.join(",\n")}}`;
  };
  return generateResponceType;
}
