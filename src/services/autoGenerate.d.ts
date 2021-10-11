declare namespace API {
  type AttributeListParams = {
    /** 搜索关键字 */
    keyword?: string;
    /** 是否有数据上报 */
    data_report:
      | 0 /** 默认没有数据上报 */
      | 1 /** 有数据上报 */
      | 2 /** 全部 */;
    /** 数据类型 */
    data_type?:
      | "数值NUMBER"
      | "文本STRING"
      | "时间DATATIME"
      | "布尔BOOL"
      | "列表LIST";
    /**  */
    page?: number;
    /**  */
    per_page?: number;
  };
  type AttributeListResponce = {
    /**  */
    total: number;
    table_header: {
      /**  */
      group_id: number;
      /**  */
      group_name: string;
      columns: {
        /**  */
        id: number;
        /**  */
        order: number;
        /**  */
        show_title: string;
        /**  */
        column: string;
      }[];
    };
    data: {
      /**  */
      id: number;
      /**  */
      name: string;
      /**  */
      show_title: string;
      /**  */
      data_type: string;
      /**  */
      data_report: string;
    }[];
  };
  type DataTypeListParams = {};
  type DataTypeListResponce = Record<string, unknown>[];
  type AttributeUpdateParams = {
    /** 属性id */
    id: number;
    /** 显示名称 */
    show_title?: string;
    /** 数据类型 */
    data_type?: string;
    /** 描述 */
    description?: string;
    /** 数据字典 */
    data_dict?: string;
  };
  type AttributeUpdateResponce = Record<string, unknown>;
  type AttributeAddParams = {
    /** 属性名称 */
    name: string;
    /** 显示名称 */
    show_title: string;
    /** 数据类型 枚举 */
    data_type:
      | "数值NUMBER"
      | "文本STRING"
      | "时间DATETIME"
      | "布尔BOOL"
      | "列表LIST";
    /** 描述 */
    description: string;
    /** 数据字典 */
    data_dict: string;
  };
  type AttributeAddResponce = Record<string, unknown>;
}
