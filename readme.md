该模块主要是为了前端方便使用 eolinker 上的接口，自动生成可直接使用的 api 方法以及对应的参数类型。当然需要在 eolinker 将每个接口的参数以及描述按规范设置好。

## 下载

```sh
npm install generateeolinkerapi -D
```

或者

```sh
yarn add generateeolinkerapi -D
```

## 开始

cli 命令为**generateApi**

> 可在 script 添加"api": "generateApi"方便使用，然后执行 npm run api 即可，当然也可以直接执行 generateApi

## 配置文件

在根目录下创建 generateApi.config.js，如下为默认配置

```js
module.exports = {
  username: "***", //eolinker登录名
  password: "**************************", //加密后的密码串，自行控制台查看登录接口参数
  projectId: 224, // 项目id - 埋点系统: 224,信用分系统: 284,观星台: 183,
  distDir: "./src/services", //输出目录，最好保证该目录已存在
  distFileName: "autoGenerate", //输出文件名，如果distType是inner模式，则忽略改参数
  domain: "https://eolinker.yidejia.com", //eolinker服务器域名
  distType: "inner" | "outer", //当使用inner模式，将根据接口的分组名创建api定义文件，中文则转成拼音 ； outer则创建固定名称的定义文件，默认为outer
};
```

## 输出样例

### Api 方法

> request 为 自定义的 axios 实例

```ts
import request from "./request";
/**
 * 列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22757&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectList(
  params: API.ProjectListParams
): Promise<API.ProjectListResponce> {
  return request.get(`/project/list`, { params });
}
/**
 * 修改
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22770&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectUpdate(
  params: API.ProjectUpdateParams
): Promise<API.ProjectUpdateResponce> {
  return request.post(`/project/update`, params);
}
/**
 * 添加
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22758&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectAdd(
  params: API.ProjectAddParams
): Promise<API.ProjectAddResponce> {
  return request.post(`/project/add`, params);
}
/**
 * 删除
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22771&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectDelete(
  params: API.ProjectDeleteParams
): Promise<API.ProjectDeleteResponce> {
  return request.post(`/project/delete`, params);
}
```

### 参数类型定义

```ts
declare namespace API {
  type ProjectListParams = {
    /** 是否启用 */
    is_valid?: 1 /** 启用 */ | 0 /** 暂停 */;
    /** 搜索关键字 */
    keyword?: string;
    /** 平台 */
    platform?:
      | 1 /** PC */
      | 2 /** Android */
      | 3 /** IOS */
      | 4 /** H5 */
      | 0 /** 全部 */
      | 5 /** 小程序 */;
    /** 页码 */
    page?: number;
    /** 条数 */
    per_page?: number;
    /** 返回类型 */
    resp_type?: "list" /** 列表 */ | "table" /** 表格 */;
  };
  type ProjectListResponce = {
    /**  */
    total: string;
    table_header: {
      /**  */
      group_id: string;
      /**  */
      group_name: string;
      columns: {
        /**  */
        id: string;
        /**  */
        order: string;
        /**  */
        show_title: string;
        /**  */
        column: string;
      }[];
    };
    data: {
      /**  */
      id: string;
      /**  */
      project_name: string;
      /**  */
      project_id: string;
      /**  */
      platform: string;
      /**  */
      platform_str: string;
      /**  */
      is_valid: number;
      /**  */
      description: string;
    }[];
  };
  type ProjectUpdateParams = {
    /** 项目物理ID */
    id: number;
    /** 标识 */
    project_id: string;
    /** 名称 */
    project_name: string;
    /** 描述 */
    description: string;
    /** 平台 */
    platform:
      | 1 /** PC */
      | 2 /** Android */
      | 3 /** IOS */
      | 4 /** H5 */
      | 0 /** 全部 */
      | 5 /** 小程序 */;
    /** 是否启用 */
    is_valid: 1 /** 启用 */ | 0 /** 暂停 */;
  };
  type ProjectUpdateResponce = Record<string, unknown>;
  type ProjectAddParams = {
    /** 标识 */
    project_id: string;
    /** 名称 */
    project_name: string;
    /** 描述 */
    description: string;
    /** 平台 */
    platform:
      | 1 /** PC */
      | 2 /** Android */
      | 3 /** IOS */
      | 4 /** H5 */
      | 0 /** 全部 */
      | 5 /** 小程序 */;
  };
  type ProjectAddResponce = Record<string, unknown>;
  type ProjectDeleteParams = {
    /** 项目物理ID */
    id: number;
  };
  type ProjectDeleteResponce = Record<string, unknown>;
}
```

## 注意事项

1. 在获取模块列表后，需要选择模块进行 api 方法的生成，此步骤支持模糊查询
2. eolinker 服务不一定稳定，因此接口请求时间可快可慢，耐心等待即可，如果失败了，请检查账号密码和项目 id 是否正确
3. 建议将输出文件添加 eslint 忽略
4. distType 若是 inner 模式，在选择接口模块的时候，建议选择子级模块，避免产生冲突

## 联系方式

邮箱：960492612@qq.com

伊的家云聊号：201109
