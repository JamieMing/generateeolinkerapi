const { getModuleFromHistory } = require("./util");
const { login, logout, getApiList } = require("./request");
const { generateFile, generateTypeFile } = require("./generateFile");
(async () => {
  await login();
  const history = await getModuleFromHistory();
  const apiList = await getApiList({
    projectId: history.projectId,
    groupId: history.id,
  });

  await generateFile(apiList, history.name, history.projectId);
  await generateTypeFile(apiList, history.name, history.projectId);
  await logout();
})();
