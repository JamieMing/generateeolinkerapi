const qs = require("qs");
const axios = require("axios");

const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
axios.defaults.timeout = 30000;
const http = axios.create({
  headers: {
    Cookie:
      "PHPSESSID=dhbsrr5j53kr336hbkao84f1t4; Hm_lvt_7c64d0bc53a1ac316ae162c808d87958=1652058633; Hm_lpvt_7c64d0bc53a1ac316ae162c808d87958=1652061979",
    Host: __config__.domain.replace("https://", ""),
    Origin: __config__.domain,
    Referer: __config__.domain + "/",
    "Content-Type": "application/x-www-form-urlencoded",
    "sec-ch-ua": `"Chromium";v="94", "Microsoft Edge";v="94", ";Not A Brand";v="99"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31",
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
/**
 * 登录eolinker
 * @returns
 */
const login = async (noTip) => {
  // 登录
  !noTip && console.log("登录中");
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Guest&o=login`,
    qs.stringify({
      loginName: __config__.username,
      loginPassword: __config__.password,
    })
  );
  if (res.userID) {
    !noTip && console.log("登录成功");
    return res;
  } else {
    !noTip && console.error("登录失败");
    return;
  }
};

const checkLogin = () => {
  return http.post(
    `${__config__.domain}/server/index.php?g=Web&c=User&o=getUserInfo`
  );
};
/**
 *
 * @returns {{projectID: "183",projectName: "【golang】观星台",projectType: "0",projectUpdateTime: "2022-04-02 17:33:18",projectVersion: "1.0",userType: "2"}}
 */
const getProjectList = async () => {
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Project&o=getProjectList`,
    qs.stringify({
      projectType: -1,
    })
  );
  return res.projectList;
};

const getGroupList = async (projectID) => {
  console.log(
    "获取模块列表中，有时候很快，有时候可能需要两分钟，耐心等一下就好"
  );
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Group&o=getGroupList`,
    qs.stringify({
      projectID,
      groupID: -1,
      childGroupID: -1,
    })
  );
  if (!res.groupList) {
    console.error(
      "列表获取有问题，可能是用户账号和密码错误，也可能是项目id不正确"
    );
    return [];
  } else {
    console.log("获取模块列表成功");
    return res.groupList;
  }
};

const getApiList = async ({ projectId, groupId }) => {
  console.log("获取api列表中");
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApiList`,
    qs.stringify({
      projectID: projectId,
      groupID: groupId,
      orderBy: 1,
      asc: 1,
    })
    // {
    //   headers: {
    //     Cookie: `PHPSESSID=dhbsrr5j53kr336hbkao84f1t${(
    //       Math.random() * 10
    //     ).toFixed(0)};`,
    //   },
    // }
  );
  console.log("获取api列表成功");
  return res.apiList;
};

const logout = async () => {
  // 退出登录
  return await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=User&o=logout`
  );
};

const getApi = async ({ projectId, api }) => {
  return http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApi`,
    qs.stringify({
      projectID: projectId,
      groupID: api.groupID,
      apiID: api.apiID,
    })
  );
  return res;
};
module.exports = {
  http,
  login,
  getGroupList,
  getProjectList,
  getApiList,
  logout,
  getApi,
  checkLogin,
};
