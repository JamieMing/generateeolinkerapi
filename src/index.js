// const fs = require("fs");

const { resolveConfig } = require("./resolveConfig");
const defaultConfig = require("../generateApi.config");
const { login, getGroupList, logout, getApiList } = require("./request");
const { generateFile, generateTypeFile } = require("./generateFile");
const { getGroupFromTerminal, getProjectFromTerminal } = require("./util");

let __config__ = resolveConfig.sync();
// 合并默认配置
__config__ = Object.assign({}, defaultConfig, __config__);
console.log(__config__);

(async () => {
  await login();

  let projectId = __config__.projectId; //默认是0
  // 填了项目id
  if (!__config__.projectId) {
    projectId = await getProjectFromTerminal();
  }

  const groupList = await getGroupList(projectId);
  const group = await getGroupFromTerminal({ groupList, projectId });
  // console.log(group);
  // groupId = group[0];
  const apiList = await getApiList({ projectId, groupId: group[0] });

  await generateFile(apiList, group[1], projectId);
  await generateTypeFile(apiList, group[1], projectId);
  await logout();
})();
