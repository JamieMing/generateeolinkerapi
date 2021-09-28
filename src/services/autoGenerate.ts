
import request from './request';
/**
 * 获取事件列表
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4907&apiID=22791&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function analyseList(params: API.AnalyseListParams): Promise<API.AnalyseListResponce> {
    return request.get(`/analyse/list`, {params})
}
/**
 * 事件分析
 * https://eolinker.yidejia.com/#/home/project/inside/api/detail?groupID=4907&apiID=22785&projectName=%E3%80%90golang%E3%80%91%E5%9F%8B%E7%82%B9%E7%B3%BB%E7%BB%9F&projectID=224
*/
export async function analyseEvent(params: API.AnalyseEventParams): Promise<API.AnalyseEventResponce> {
    return request.get(`/analyse/event`, {params})
}