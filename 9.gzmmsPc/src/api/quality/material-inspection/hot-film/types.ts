export namespace HotFilmModule {
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
    /** 类型 1 普通版 2 强化版 3 PE彩膜 */
    film: number;
    /** 检测开始日期 */
    check_date_start: string;
    /** 检测结束日期 */
    check_date_end: string;
    /** 单据状态 0 暂存 1 待审核 2 已审核 3 审核不通过 4 撤回 */
    status: number;
  }
  /**
   * 列表子项
   */
  export interface ListItem {
    /** 单据ID */
    id: number;
    /** 单据编号 */
    order_no: string;
    /** 产品品牌 ND1 红牛 ND2 战马 */
    brand: string;
    /** 类型 1 普通版 2 强化版 3 PE彩膜 */
    film: number;
    /** 生产批号 */
    batch_no: string;
    /** 到货数量 */
    num: number;
    /** 供应商名称 */
    supplier_name: string;
    /** 样品日期 */
    sample_date: string;
    /** 检验结果 0 不及格 1 及格 */
    check_ret: number;
    /** 检测日期 */
    check_date: string;
    /** 检测员名称 */
    check_user_name: string;
    /** 单据状态 0 暂存 1 待审核 2 已审核 3 审核不通过 */
    status: number;
    /** 制单人 */
    ct_name: string;
    /** 备注 */
    remark: string | null;
    /** 创建时间 */
    create_time: string;
    /** 按钮权限 */
    assoc_type: string;
    /** 产品名称 */
    brand_name: string;
    /** 类型名称 */
    film_name: string;
    /** 单据状态文本 */
    status_text: string;
    /** 检验结果文本 */
    check_ret_text: string;
  }
  /**
   * 子项类型
   */
  interface ChildItem {
    /** ID */
    id: string;
    /** 名称 */
    name: string;
  }

  /**
   * 类型
   */
  interface Film {
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
    /** 类型 */
    film: Film[];
  }

  /**
   * 基础数据类型
   */
  interface BasicData {
    /** ID */
    id: number;
    /** 名称 */
    name: string;
  }

  /**
   * 检查用户列表类型
   */
  interface CheckUser {
    /** ID */
    id: number;
    /** 名称 */
    name: string;
  }

  /**
   * 供应商类型
   */
  interface Supplier {
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
    check_user_list: CheckUser[];
    /** 供应商 */
    supplier: Supplier[];
    workshop_init: BasicData[];
  }
}
