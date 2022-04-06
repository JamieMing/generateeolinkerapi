// const fs = require("fs");
const qs = require("qs");
const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
const writeFile = require("./writeFile");

const { apiRequestTypeDict } = require("./dict");
const { http, login, getGroupList, logout, getApiList } = require("./request");
const {
  getGroupFromTerminal,
  getProjectFromTerminal,
  getApiName,
  getParamType,
  getJsonDataFromApi,
} = require("./util");

let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
console.log(__config__);

let currentModuleName = "";

function generateFile(data) {
  let file = `
import request from '${
    __config__.distType == "inner"
      ? `${currentModuleName
          .split("/")
          .map((i) => "../")
          .join("")}`
      : "./"
  }request';`;
  file += data
    .map((api) => {
      let [apiName, ApiName] = getApiName(api.apiURI, api.apiRequestType);
      let pathParams = "";
      let pathParamsUrl = api.apiURI.replace(/:(\w+)/g, function ($0, $1) {
        pathParams += `,${$1}: string\n`;
        return `\$\{${$1}\}`;
      });
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
export async function ${apiName}(params: API.${ApiName}Params${pathParams}): Promise<API.${ApiName}Responce> {
    return request.${
      apiRequestTypeDict[api.apiRequestType][0]
    }(\`${pathParamsUrl}\`, ${apiRequestTypeDict[api.apiRequestType][1]})
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
      let [apiName, ApiName] = getApiName(api.apiURI, api.apiRequestType);

      let requestObj = getJsonDataFromApi(requestInfo);

      let params = `\n type ${ApiName}Params = ${handleGenerateRequestType(
        requestInfo
      )(requestObj)}`;
      let respObj = getJsonDataFromApi(resultInfo);

      params += `\n       type ${ApiName}Responce = ${
        // 只有返回参数是对象类型才进入解析
        typeof respObj.data === "object"
          ? handleGenerateResponceType(resultInfo)(respObj.data)
          : respObj.data || "any"
      } ${respObj.data && respObj.data.isArray ? "[]" : ""}`;

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

/**
 * 递归处理返回参数
 * @param {*} resultInfo
 * @returns
 */
function handleGenerateResponceType(resultInfo) {
  function findRespType(keys) {
    let res = resultInfo.find((item) => {
      return item.paramKey == keys;
    });
    return res || { paramName: "" };
  }
  const generateResponceType = (data, paramKey = "data") => {
    data = data || {};
    let params = [];
    for (let key in data) {
      let respType = findRespType(paramKey + ">>" + key);
      const comment = respType.paramName;
      if (key != "isArray") {
        if (typeof data[key] == "string") {
          // if (key != 'isArray') {
          // console.log(key)
          // const comment = findRespTypeName(paramKey + ">>" + key);
          params.push(
            `${comment ? "/** " + comment + " */ \n" : ""}'${key}': ${
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
      return `any`;
    }
    return `{\n${params.join(",\n")}}`;
  };
  return generateResponceType;
}

/**
 * 递归处理请求参数
 * @param {*} resultInfo
 * @returns
 */
function handleGenerateRequestType(resultInfo) {
  function findRespType(keys) {
    let res = resultInfo.find((item) => {
      return item.paramKey.indexOf(keys) > -1;
    });
    return res || { paramName: "" };
  }
  const generateResponceType = (data, paramKey = "") => {
    data = data || {};
    let params = [];
    for (let key in data) {
      // console.log(paramKey ? paramKey + key : key);
      let respType = findRespType(paramKey ? paramKey + key : key);
      // if (!respType.paramValueList) {
      //   console.log(respType, data, key);
      // }
      const comment = respType.paramName;
      if (key != "isArray") {
        if (typeof data[key] == "string") {
          // if (key != 'isArray') {
          // console.log(key)
          // const comment = respType.paramName;
          params.push(
            `${comment ? "/** " + comment + " */ \n" : ""}'${key}'${
              respType.paramNotNull == "1" ? "?" : ""
            }: ${getParamType(respType)}`
          );
          // }
        } else {
          params.push(
            `${comment ? "/** " + comment + " */ \n" : ""}'${key}'${
              respType.paramNotNull == "1" ? "?" : ""
            }: ${generateResponceType(data[key], key + ">>")}${
              data[key].isArray ? "[]" : ""
            }`
          );
        }
      }
    }
    if (params.length == 0) {
      return `any`;
    }
    return `{\n${params.join(",\n")}}`;
  };
  return generateResponceType;
}

(async () => {
  await login();

  let groupId = 0;
  let projectId = __config__.projectId; //默认是0
  // 填了项目id
  if (!__config__.projectId) {
    projectId = await getProjectFromTerminal();
  }

  let groupList = await getGroupList(projectId);
  group = await getGroupFromTerminal({ groupList });
  console.log(group);
  groupId = group[0];
  currentModuleName = group[1];
  const apiList = await getApiList({ projectId, groupId });

  await generateFile(apiList);
  await generateTypeFile(apiList);
  await logout();
})();
