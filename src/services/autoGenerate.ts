
import request from './request';
/**
 * 获取属性列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4988&apiID=22990&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function attributeList(params: API.AttributeListParams): Promise<API.AttributeListResponce> {
    return request.get(`/attribute/list`, {params})
}
/**
 * 数据类型列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4988&apiID=22995&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function dataTypeList(params: API.DataTypeListParams): Promise<API.DataTypeListResponce> {
    return request.get(`/data_type/list`, {params})
}
/**
 * 编辑属性
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4988&apiID=23001&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function attributeUpdate(params: API.AttributeUpdateParams): Promise<API.AttributeUpdateResponce> {
    return request.post(`/attribute/update`, params)
}
/**
 * 新增属性
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4988&apiID=22994&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function attributeAdd(params: API.AttributeAddParams): Promise<API.AttributeAddResponce> {
    return request.post(`/attribute/add`, params)
}