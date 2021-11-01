declare namespace API {
  type LayoutGetParams = {
    /** 仪表盘id */
    report_id: number;
  };
  type LayoutGetResponce = undefined;
  type LayoutUpdateParams = {
    /** 布局id */
    id: number;
    /** 配置素组（非必传） */
    layout?: {
      h: string;
      i: string;
      isDraggable: string;
      isResizable: string;
      maxH: string;
      maxW: string;
      minH: string;
      minW: string;
      moved: string;
      static: string;
      w: string;
      x: string;
      y: string;
    }[];
    /** 仪表盘id */
    report_id?: number;
  };
  type LayoutUpdateResponce = undefined;
  type LayoutCreateParams = {
    /** 仪表盘id */
    report_id: number;
    /** 配置数组 */
    layout: {
      h: string;
      i: string;
      isDraggable: string;
      isResizable: string;
      maxH: string;
      maxW: string;
      minH: string;
      minW: string;
      moved: string;
      static: string;
      w: string;
      x: string;
      y: string;
    }[];
  };
  type LayoutCreateResponce = undefined;
}
