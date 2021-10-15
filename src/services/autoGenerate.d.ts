declare namespace API {
  type OperationActivityAddParams = {
    /** 对比活动的id */
    last_activity_id: string;
    /** 活动名 */
    name: string;
    /** 活动开始时间 */
    start_at: string;
    /** 活动结束时间 */
    end_at: string;
  };
  type OperationActivityAddResponce = string;
  type OperationActivityListParams = {
    /**  */
    page: number;
    /**  */
    per_page: number;
    /** 111 */
    表头: string;
  };
  type OperationActivityListResponce = {
    total: string;
    data: {
      id: string;
      goods_count: string;
      end_at: string;
      name: string;
      start_at: string;
      created_at: string;
    }[];
  };
  type OperationActivityRelativeParams = {
    /**  */
    id: number;
  };
  type OperationActivityRelativeResponce = {
    id: string;
    name: string;
    end_at: string;
    start_at: string;
  };
  type OperationActivityUpdateParams = {
    /** 对比活动的id */
    last_activity_id: string;
    /** 活动名 */
    name: string;
    /** 活动开始时间 */
    start_at: string;
    /** 活动结束时间 */
    end_at: string;
    /** 对应id */
    id: string;
  };
  type OperationActivityUpdateResponce = string;
  type OperationActivityDeleteParams = {
    /** 活动id */
    ids: (number | string)[];
  };
  type OperationActivityDeleteResponce = string;
  type OperationActivityGoodsDeleteParams = {
    /** 商品列表中的id，而不是goods_id和activity_id，多选 */
    ids: (number | string)[];
  };
  type OperationActivityGoodsDeleteResponce = string;
  type OperationActivityGoodsListParams = {
    /**  */
    page: number;
    /**  */
    per_page: number;
    /** 活动id(不选查询所有活动商品) */
    activity_id: string;
    /** 112 */
    表头: string;
  };
  type OperationActivityGoodsListResponce = {
    total: string;
    data: {
      id: string;
      activity_id: string;
      goods_id: string;
      activity_name: string;
      goods_name: string;
    }[];
  };
  type OperationActivityGoodsAddParams = {
    /** 活动id */
    activity_id: string;
    /** 选择商品id，多选 */
    goods_ids: (number | string)[];
  };
  type OperationActivityGoodsAddResponce = string;
  type OperationReportFormOverviewParams = {
    /** 活动id */
    id: number;
    /** 自定义本活动周期开始时间 */
    start_at?: string;
    /** 自定义本活动周期结束时间 */
    end_at?: string;
    /** 自定义上个活动周期开始时间 */
    last_start_at?: string;
    /** 自定义上个活动周期结束时间 */
    last_end_at?: string;
  };
  type OperationReportFormOverviewResponce = {
    total_achievement: {
      /** 本活动期 */
      current: string;
      /** 上个活动期 */
      last: string;
      /** 比率 */
      ratio: string;
    };
    per_achievement: {
      current: number;
      last: number;
      ratio: number;
    };
    new_customer_achievement: {
      current: number;
      last: number;
      ratio: number;
    };
    old_customer_achievement: {
      current: number;
      last: number;
      ratio: number;
    };
    per_order_price: {
      current: number;
      last: number;
      ratio: number;
    };
    new_customer_per_order_price: {
      current: number;
      last: number;
      ratio: number;
    };
    old_customer_per_order_price: {
      current: number;
      last: number;
      ratio: number;
    };
    customer_num: {
      current: number;
      last: number;
      ratio: number;
    };
    new_customer_num: {
      current: number;
      last: number;
      ratio: number;
    };
    old_customer_num: {
      current: number;
      last: number;
      ratio: number;
    };
    book_customer_num: {
      current: number;
      last: number;
      ratio: number;
    };
    has_order_num: {
      current: number;
      last: number;
      ratio: number;
    };
  };
  type OperationActivitySaleParams = {
    /** 页数 */
    page: number;
    /** 每页条数 */
    per_page: string;
    /** 开始时间 */
    start_at: string;
    /** 结束时间 */
    end_at: string;
    /** 对比：开始时间 */
    start_at_before: string;
    /** 对比：结束时间 */
    start_at_before: string;
    /** 是否拆分：true,false */
    split: string;
    /** 正序还是倒序，asc ，desc， */
    order: string;
    /** 排序字段 */
    sort_context: string;
    /** 由于这个接口是需要查询具体的商品，要么传入活动id，要么传入下面的商品id */
    activity_id: string;
    /** 都是全量查询活动的商品，所以和activity_id二选一 */
    goods_ids: (number | string)[];
    /** 有对比时间和无对比时间返回的参数结构不一样 */
    注意: string;
    /** 拆分114，不拆分f115 */
    表头: string;
  };
  type OperationActivitySaleResponce = {
    id: string;
    name: string;
    end_at: string;
    start_at: string;
    total: string;
    data: {
      can_use_quantity: {
        now: string;
        before: string;
        ratio: string;
      };
      cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      diamond_member: {
        now: string;
        before: string;
        ratio: string;
      };
      experience_member: {
        now: string;
        before: string;
        ratio: string;
      };
      gold_member: {
        now: string;
        before: string;
        ratio: string;
      };
      goods_id: {
        now: string;
        before: string;
        ratio: string;
      };
      goods_name: string;
      honor_member: {
        now: string;
        before: string;
        ratio: string;
      };
      lr_num: {
        now: string;
        before: string;
        ratio: string;
      };
      new_cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      old_cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      out_can_use_quantity: {
        now: string;
        before: string;
        ratio: string;
      };
      platina_member: {
        now: string;
        before: string;
        ratio: string;
      };
      silver_member: {
        now: string;
        before: string;
        ratio: string;
      };
    }[];
  };
  type OperationActivityOrderStatusParams = {
    /** 页数 */
    page: number;
    /** 每页条数 */
    per_page: string;
    /** 开始时间 */
    start_at: string;
    /** 结束时间 */
    end_at: string;
    /** 对比：开始时间 */
    start_at_before: string;
    /** 对比：结束时间 */
    start_at_before: string;
    /** 正序还是倒序，asc ，desc， */
    order: string;
    /** 排序字段 */
    sort_context: string;
    /** 由于这个接口是需要查询具体的商品，要么传入活动id，要么传入下面的商品id */
    activity_id: string;
    /** 都是全量查询活动的商品，所以和activity_id二选一 */
    goods_ids: (number | string)[];
    /** 有对比时间和无对比时间返回的参数结构不一样 */
    注意: string;
    /** 116 */
    表头: string;
  };
  type OperationActivityOrderStatusResponce = {
    total: string;
    data: {
      cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      diamond_member: {
        now: string;
        before: string;
        ratio: string;
      };
      experience_member: {
        now: string;
        before: string;
        ratio: string;
      };
      gold_member: {
        now: string;
        before: string;
        ratio: string;
      };
      goods_acash: {
        now: string;
        before: string;
        ratio: string;
      };
      honor_member: {
        now: string;
        before: string;
        ratio: string;
      };
      new_cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      old_cus_count: {
        now: string;
        before: string;
        ratio: string;
      };
      order_count: {
        now: string;
        before: string;
        ratio: string;
      };
      platina_member: {
        now: string;
        before: string;
        ratio: string;
      };
      price_avg: {
        now: string;
        before: string;
        ratio: string;
      };
      silver_member: {
        now: string;
        before: string;
        ratio: string;
      };
      status: string;
    }[];
  };
}
