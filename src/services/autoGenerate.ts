
import request from './request';
/**
 * 获取指定仪表盘布局
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=2810&apiID=15036&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function layoutGet(params: API.LayoutGetParams): Promise<API.LayoutGetResponce> {
    return request.get(`/layout/get`, {params})
}
/**
 * 修改布局
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=2810&apiID=15035&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function layoutUpdate(params: API.LayoutUpdateParams): Promise<API.LayoutUpdateResponce> {
    return request.post(`/layout/update`, params)
}
/**
 * 创建布局
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=2810&apiID=15034&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function layoutCreate(params: API.LayoutCreateParams): Promise<API.LayoutCreateResponce> {
    return request.post(`/layout/create`, params)
}