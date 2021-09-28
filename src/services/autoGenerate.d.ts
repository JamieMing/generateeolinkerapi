
declare namespace API {
    type AnalyseListParams = {
        /** 项目id */
       project_id: string
        /**  */
       page?: 1/** 默认第一页 */
        /**  */
       per_page?: 15/** 默认15个 */
   }
       type AnalyseListResponce = {
/**  */
'total': number,
'data': {
/**  */
'id': number,
/**  */
'module_name': string,
/**  */
'event_name': string,
/**  */
'show_title': string}[]}
    type AnalyseEventParams = {
        /** 项目id */
       project_id: string
        /** 事件id */
       event_id: number
        /** 开始时间 */
       start_at: string
        /** 结束时间 */
       end_at: string
   }
       type AnalyseEventResponce = {
/**  */
'A': string,
/**  */
'num': number,
/**  */
'消息数量': string}[]
}