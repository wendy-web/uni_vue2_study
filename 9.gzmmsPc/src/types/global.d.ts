import type { TableColumns } from "@pureadmin/table";
import type { PlusColumn } from "plus-pro-components";
import { type RouteComponent } from "vue-router";

declare global {
  /** 常用的下拉列表数据类型 */
  type SelectOpitonType = {
    id: number;
    name: string;
    val?: string;
    num?: number;
    /**可能存在的- 是否已使用绑定 */
    is_bind?: boolean;
    bind_id?: number;
    /**可能存在的- 是否已使用字段 */
    disable?: boolean;
  };

  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  interface PageResult<T> {
    list: T;
    total: number;
  }
  type DialogType = {
    title?: string;
    visible: boolean;
  };

  type OptionType = {
    value: string;
    label: string;
    checked?: boolean;
    children?: OptionType[];
  };
  type OptionsValueType = {
    label: string;
    value: number;
    checked?: boolean;
  };

  type FormNumType = number | undefined;

  /**
   *  继承 `plus-pro-components` 的 `PlusColumn` ，方便全局直接调用
   */
  interface PlusColumnList extends Array<PlusColumn> {}

  /**
   *  继承 `@pureadmin/table` 的 `TableColumns` ，方便全局直接调用
   */
  interface TableColumnList extends Array<TableColumns> {}

  /* 详情商品数据转换的类型 - 旧 */
  type uniqueListType = {
    unique: string;
    old_num: number;
  };
  /* 详情商品数据转换的类型 - 新 */
  type stockIdListType = {
    stock_id: number;
    old_num?: number;
  };

  /**
   * @description 新建页面goods列表的部分数据类型
   * @barcode   商品编码
   * @title   商品名称
   * @spec  规格
   * @brand  品牌
   * @measure_name  计量单位
   * @class_name  分类
   * @price  价格
   * @sup_name  供应商名称
   * @note  备注
   *
   */
  interface AddGoodsType {
    /** 商品编码 */
    barcode: string;
    /** 商品名称 */
    title: string;
    /** 规格 */
    spec: string;
    /** 品牌 */
    brand: string;
    /** 计量单位 */
    measure_name: string;
    /** 分类 */
    class_name: string;
    /** 价格 */
    price: string;
    /** 供应商名称 */
    sup_name: string;
    /** 备注 */
    note: string;
  }

  /**
   * @description 通用-列表页面返回的list类型
   */
  interface OrderItemType {
    id: number;
    /** 采购单号 */
    procure_no: string;
    /** 采购金额 */
    all_price: string;
    /** 采购数量 */
    all_num: number;
    /** 总备注 */
    note: string;
    /** 附件信息 */
    file_info: {
      src: string;
      name: string;
    };
    /** 部门id */
    dept_id?: number; //
    /** 创建人 */
    ct_name: string; //
    /** uid */
    ct_uid: number;
    /** 状态  0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废,7已审核 */
    status: number;
    /** create_time */
    create_time: string;
    /** 0查看,1创建人,2审批,3抄送 */
    assoc_type: number;
  }

  /**
   * @description 通用-列表页面返回的总体数据类型
   * @list 数据列表-泛型数组
   * @total 总条数
   * @page 第几页
   * @size 每页条数
   */
  interface OrderListType<T> {
    /** 数据列表 */
    list: T[];
    /** 总条数 */
    total: number;
    /** 第几页 */
    page: string;
    /** 每页条数 */
    size: string;
  }

  /**
   * @description 完整子路由配置表
   */
  interface RouteChildrenConfigsTable {
    /** 子路由地址 `必填` */
    path: string;
    /** 路由名字（对应不要重复，和当前组件的`name`保持一致）`必填` */
    name?: string;
    /** 路由重定向 `可选` */
    redirect?: string;
    /** 按需加载组件 `可选` */
    component?: RouteComponent;
    meta?: {
      /** 菜单名称 `必填` */
      title: string;
      /** 菜单图标 `可选` */
      icon?: string;
      /** 是否在菜单中显示`可选` */
      hidden?: boolean;
      /** 路由组件缓存（开启 `true`、关闭 `false`）`可选`,默认false */
      keepAlive?: boolean;
      /** 设置侧边栏高亮列表的路由 */
      activeMenu?: string;
      /** 如果设置为true，它则会固定在tags-view中(默认 false) */
      affix?: boolean;
    };
    /** 子路由配置项 */
    children?: Array<RouteChildrenConfigsTable>;
  }

  /**
   * @description 整体路由配置表（包括完整子路由）
   */
  interface RouteConfigsTable {
    /** 路由地址 `必填` */
    path: string;
    /** 路由名字（保持唯一）`可选` */
    name?: string;
    /** `Layout`组件 `可选` */
    component?: RouteComponent;
    /** 路由重定向 `可选` */
    redirect?: string;
    meta?: {
      /** 菜单名称必填` */
      title: string;
      /** 菜单图标 `可选` */
      icon?: string;
      /** 是否在菜单中显示`可选` */
      hidden?: boolean;
      /** 菜单升序排序，值越高排的越后（只针对顶级路由）`可选` */
      rank?: number;
    };
    /** 子路由配置项 */
    children?: Array<RouteChildrenConfigsTable>;
  }
}
export {};
