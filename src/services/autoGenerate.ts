import request from "./request";
/**
 * 删除
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22771&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectDelete(
  params: API.ProjectDeleteParams,
  project_id: string
): Promise<API.ProjectDeleteResponce> {
  return request.post(`/project/delete/${project_id}`, params);
}
/**
 * 修改
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22770&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectUpdate(
  params: API.ProjectUpdateParams,
  project_id: string
): Promise<API.ProjectUpdateResponce> {
  return request.post(`/project/update/${project_id}`, params);
}
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
 * 添加
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=22758&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function projectAdd(
  params: API.ProjectAddParams
): Promise<API.ProjectAddResponce> {
  return request.post(`/project/add`, params);
}
/**
 * 获取员工列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4900&apiID=23024&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
 */
export async function staffList(
  params: API.StaffListParams
): Promise<API.StaffListResponce> {
  return request.get(`/staff/list`, { params });
}
