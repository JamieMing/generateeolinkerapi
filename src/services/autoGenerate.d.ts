
declare namespace API {
    type ProjectDeleteParams = {
        /** 项目物理ID */
       id: number
        /** 项目ID，url必传，请求参数可以不填 */
       project_id?: string
   }
       type ProjectDeleteResponce = any
    type ProjectUpdateParams = {
        /** 项目物理ID */
       id: number
        /** 名称 */
       project_name?: string
        /** 描述 */
       description?: string
        /** 平台 */
       platform?: 1/** PC */ | 2/** Android */ | 3/** IOS */ | 4/** H5 */ | 0/** 全部 */ | 5/** 小程序 */
        /** 是否启用 */
       is_valid?: 1/** 启用 */ | 0/** 暂停 */
        /** 管理员集合get,post：manager_staff_ids=1&manager_staff_ids=2，json：[] */
       manager_staff_ids?: (number | string)[]
        /** 项目ID，url必传，请求参数可以不填 */
       project_id?: string
   }
       type ProjectUpdateResponce = any
    type ProjectListParams = {
        /** 是否启用 */
       is_valid?: 1/** 启用 */ | 0/** 暂停 */
        /** 搜索关键字 */
       keyword?: string
        /** 平台 */
       platform?: 1/** PC */ | 2/** Android */ | 3/** IOS */ | 4/** H5 */ | 0/** 全部 */ | 5/** 小程序 */
        /** 页码 */
       page?: number
        /** 条数 */
       per_page?: number
        /** 返回类型 */
       resp_type?: 'list'/** 列表 */ | 'table'/** 表格 */
   }
       type ProjectListResponce = {
'total': string,
'table_header': {
'group_id': string,
'group_name': string,
'columns': {
'id': string,
'order': string,
'show_title': string,
'column': string}[]},
'data': {
'id': number,
'project_name': string,
'project_id': string,
'platform': string,
'platform_str': string,
'is_valid': number,
'description': string,
'created_at': string,
'manager': {
'staff_id': string,
'staff_name': string}[]}[]}
    type ProjectAddParams = {
        /** 标识 */
       project_id: string
        /** 名称 */
       project_name: string
        /** 描述 */
       description?: string
        /** 平台 */
       platform: 1/** PC */ | 2/** Android */ | 3/** IOS */ | 4/** H5 */ | 0/** 全部 */ | 5/** 小程序 */
        /** 管理员ids集合 get,post：manager_staff_ids=1&manager_staff_ids=2，json：[] */
       manager_staff_ids?: (number | string)[]
   }
       type ProjectAddResponce = any
    type StaffListParams = {
        /** 关键字 */
       keyword: string
        /** 页码 */
       page?: number
        /** 条数 */
       per_page?: number
   }
       type StaffListResponce = {
'total': string,
'data': {
'staff_id': string,
'staff_name': string}[]}
}