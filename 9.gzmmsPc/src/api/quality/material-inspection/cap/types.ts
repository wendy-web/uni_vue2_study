export namespace CapModule {
  /**
   * 请求参数类型
   */
  export interface ListQuery {
    /** 分页参数 */
    page?: number;
    /** 分页参数 */
    size?: number;
    /** 单据编号 */
    order_no: string;
    /** 生产批号 */
    batch_no: string;
    /** 检测开始时间 */
    check_date_start: string;
    /** 检测结束时间 */
    check_date_end: string;
    /** 供应商ID */
    supplier_id: number;
    /** 单据状态 0 暂存 1 待审核 2 已审核 3 审核不通过 */
    status: number;
    /** 产品品牌 ND1 红牛 ND2 战马 */
    brand: string;
  }
  /**
   * 单据类型
   */
  export interface ListItem {
    /** 单据ID */
    id: number;
    /** 单据编号 */
    order_no: string;
    /** 供应商名称 */
    supplier_name: string;
    /** 产品品牌 */
    brand: string;
    /** 产品类型 */
    sku: string;
    /** 生产批号 */
    batch_no: string;
    /** 检验结果 0 不及格 1 及格 */
    check_ret: number;
    /** 检测日期 */
    check_date: string;
    /** 检测员名称 */
    check_user_name: string;
    /** 单据状态 0 暂存 1 待审核 2 已审核 3 审核不通过 */
    status: number;
    /** 创建人 */
    ct_name: string;
    /** 备注 */
    remark: string | null;
    /** 创建时间 */
    create_time: string;
    /** 权限类型 */
    assoc_type: number[];
    /** 品牌名称 */
    brand_name: string;
    /** 产品类型名称 */
    sku_name: string;
    /** 单据状态文本 */
    status_text: string;
    /** 检验结果文本 */
    check_ret_text: string;
  }

  /**
   * 子项类型
   */
  export interface ChildItem {
    /** ID */
    id: string;
    /** 名称 */
    name: string;
  }

  /**
   * 品牌数据类型
   */
  export interface BrandData {
    /** ID */
    id: string;
    /** 名称 */
    name: string;
    /** 子项 */
    child: ChildItem[];
  }

  /**
   * 基础数据类型
   */
  export interface BasicData {
    /** ID */
    id: number;
    /** 名称 */
    name: string;
  }

  /**
   * 数据类型
   */
  export interface BaseData {
    /** 品牌数据 */
    brand_data: BrandData[];
    /** 检验初始数据 */
    check_init: BasicData[];
    /** 状态 */
    status: BasicData[];
    /** 检验员列表 */
    check_user_list: BasicData[];
    /** 供应商 */
    supplier: BasicData[];
  }
}
