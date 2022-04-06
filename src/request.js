const qs = require("qs");
const axios = require("axios");

const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);

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
/**
 * 登录eolinker
 * @returns
 */
const login = async () => {
  // 登录
  console.log("登录中");
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Guest&o=login`,
    qs.stringify({
      loginName: __config__.username,
      loginPassword: __config__.password,
    })
  );
  if (res.userID) {
    console.log("登录成功");
    return res;
  } else {
    console.error("登录失败");
    return;
  }
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
  const res = await http.post(
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
};
