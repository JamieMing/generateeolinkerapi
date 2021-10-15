
import request from './request';
/**
 * 活动管理-新增活动
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23042&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityAdd(params: API.OperationActivityAddParams): Promise<API.OperationActivityAddResponce> {
    return request.post(`/operation/activity/add`, params)
}
/**
 * 活动管理-活动列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23039&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityList(params: API.OperationActivityListParams): Promise<API.OperationActivityListResponce> {
    return request.get(`/operation/activity/list`, {params})
}
/**
 * 活动报表-活动对比
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23081&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityRelative(params: API.OperationActivityRelativeParams): Promise<API.OperationActivityRelativeResponce> {
    return request.get(`/operation/activity/relative`, {params})
}
/**
 * 活动管理-修改活动
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23044&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityUpdate(params: API.OperationActivityUpdateParams): Promise<API.OperationActivityUpdateResponce> {
    return request.post(`/operation/activity/update`, params)
}
/**
 * 活动管理-删除活动
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23046&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityDelete(params: API.OperationActivityDeleteParams): Promise<API.OperationActivityDeleteResponce> {
    return request.post(`/operation/activity/delete`, params)
}
/**
 * 商品-删除活动商品
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23045&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityGoodsDelete(params: API.OperationActivityGoodsDeleteParams): Promise<API.OperationActivityGoodsDeleteResponce> {
    return request.post(`/operation/activity/goods/delete`, params)
}
/**
 * 商品-活动商品列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23041&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityGoodsList(params: API.OperationActivityGoodsListParams): Promise<API.OperationActivityGoodsListResponce> {
    return request.get(`/operation/activity/goods/list`, {params})
}
/**
 * 商品-新增活动商品
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23043&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityGoodsAdd(params: API.OperationActivityGoodsAddParams): Promise<API.OperationActivityGoodsAddResponce> {
    return request.post(`/operation/activity/goods/add`, params)
}
/**
 * 活动报表-数据概况
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23083&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationReportFormOverview(params: API.OperationReportFormOverviewParams): Promise<API.OperationReportFormOverviewResponce> {
    return request.get(`/operation/report_form/overview`, {params})
}
/**
 * 活动报表-产品销售情况
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23084&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivitySale(params: API.OperationActivitySaleParams): Promise<API.OperationActivitySaleResponce> {
    return request.get(`/operation/activity/sale`, {params})
}
/**
 * 活动报表-订单状态
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=5003&apiID=23092&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=183
*/
export async function operationActivityOrderStatus(params: API.OperationActivityOrderStatusParams): Promise<API.OperationActivityOrderStatusResponce> {
    return request.get(`/operation/activity/order/status`, {params})
}