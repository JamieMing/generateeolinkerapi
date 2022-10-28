const writeFile = require("./writeFile");
const { apiRequestTypeDict } = require("./dict");
const { getApiName, getParamType, getJsonDataFromApi } = require("./util");
const { getApi, checkLogin, login } = require("./request");
const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
const generateFile = (data, currentModuleName, projectId) => {
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
      }&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=${projectId}
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
};
async function queue(arr) {
  const result = [];
  for (let p of arr) {
    result.push(await p);
  }
  return result;
}
const generateTypeFile = async (data, currentModuleName, projectId) => {
  let file = `
  declare namespace API {`;
  const tasks = data.map(async (api) => {
    return new Promise(async (resolve) => {
      try {
        const check = await checkLogin();
        if (check.statusCode == "120005") {
          await login(true);
        }
        // console.log(check);
        let {
          apiInfo: { requestInfo, resultInfo },
        } = await getApi({ projectId, api });
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
      } catch (err) {
        console.log(api.apiName, err.message);
        resolve("");
      }
    });
  });
  let params1 = await Promise.all(tasks);
  // let params2 = [];
  // let params2 = await Promise.all(tasks.slice(5));
  file += params1.join("");
  file += "\n}";
  // console.log(file);
  try {
    writeFile(file, __config__, currentModuleName, true);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
};

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
      return item.paramKey == keys;
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

module.exports = {
  generateFile,
  generateTypeFile,
};
