export namespace InnerFilmModule {
  // 列表接口类型
  export interface ListQuery {
    page: number;
    size: number;
    order_no?: string;
    batch_no?: string;
    check_date_start?: string;
    check_date_end?: string;
    version_name?: string;
    status?: number;
  }
  export interface ListItem {
    id: number;
    order_no: string;
    brand: string;
    sku: string;
    batch_no: string;
    check_date: string;
    check_user_name: string;
    status: number;
    remark?: any;
    create_time: string;
    version_name: string;
    check_ret: number;
    assoc_type: number[];
    brand_name: string;
    sku_name: string;
    status_text: string;
    check_ret_text: string;
    ct_name: string;
  }
  export type List = OrderListType<ListItem>;

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
    film: ChildItem[];
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
   * 版本类型
   */
  interface Version {
    /** 版本ID */
    id: number;
    /** 名称 */
    name: string;
    /** 编号 */
    version_no: string;
  }

  /**
   * 试剂类型
   */
  interface Reagent {
    /** 试剂ID */
    id: number;
    /** 试剂名称 */
    name: string;
  }

  /**
   * 空罐线别类型
   */
  interface Line {
    /** 空罐线别ID */
    id: number;
    /** 空罐线别名称 */
    name: string;
  }

  //   下拉选项数据类型
  export interface InnerFilmInitOptions {
    /** 品牌数据 */
    brand_data: BrandData[];
    /** 检验初始数据 */
    check_init: BasicData[];
    /** 状态 */
    status: BasicData[];
    /** 检验员列表 */
    check_user_list: BasicData[];
    /** 空罐尺寸初始数据 */
    size_init: BasicData[];
    /** 版本 */
    version: Version[];
    /** 试剂初始数据 */
    reagent_init: Reagent[];
    /** 空罐线别初始数据 */
    line_init: Line[];
    /** 彩印铁厂家 */
    print_factor: BasicData[];
  }

  // 创建编辑传参类型
  /**
   * 检测项详情类型
   */
  interface CheckJson {
    /** 键值 */
    key: string;
    /** 包号 */
    pack_no: string;
    /** 电流检测数 */
    electric: string;
    /** 启破力检测数 */
    open: string;
  }
  /**
   * 检验信息类型
   */
  export interface CheckInfo {
    /** 检验信息ID 新增不传 编辑要传 */
    id?: number;
    /** 报告单ID */
    batch_no: string;
    /** 检测项详情 */
    check_json: CheckJson[];
    /** 检测时间 */
    check_time: string;
    /** 彩印铁厂家ID */
    print_factor_id: string;
    /** 彩印铁厂家 */
    print_factor: string;
    [key: string]: any;
  }

  /**
   * 文件信息类型
   */
  interface File {
    /** 文件名 */
    file_name: string;
    /** 文件链接 */
    file_url: string;
    /** 备注 */
    note: string;
  }
  // 复核数组单项
  export interface recheckItem {
    recheck_uid: number;
    recheck_name: string;
    recheck_date: string;
    recheck_sign: string;
    check_remark: string;
  }
  /**
   * 接口返回数据类型
   */
  export interface SaveOrderQuery {
    /** 单据ID 新增不传，编辑要传 */
    id?: number;
    order_no?: string;
    /** 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装 */
    sku: string;
    /** 生产批号 */
    batch_no: string;
    /** 产品品牌 ND1 红牛 ND2 战马 */
    brand: string;
    /** 检测日期 */
    check_date: string;
    /** 样品日期 */
    sample_date: string;
    /** 空罐尺寸 */
    size_id: number;
    /** 版本ID */
    version_id: number;
    /** 版本名称 */
    version_name: string;
    /** 检测试剂id */
    reagent_id: number;
    /** 空罐线别id */
    line_id: number;
    /** 供应商id */
    supplier_id: number;
    /** 供应商名称 */
    supplier_name: string;
    /** 检测员ID */
    check_user_id: number;
    /** 检测员名称 */
    check_user_name: string;
    /** 检验员签字 提审必传 */
    check_sign?: string;
    /** 检验结果 0 不及格 1 及格 提审必传 */
    check_ret?: number;
    /** 复核员签名 审核必传 */
    recheck?: recheckItem[];
    /** 单据状态 0 暂存 1 待审核 2 已审核 3 审核不通过 */
    status: number;
    /** 备注 */
    remark?: string;
    /** 检验信息 */
    checkinfo: CheckInfo[];
    /** 焊缝完整性实验检测结果 0 不及格 1 及格 */
    weld_seam_ret: number;
    /** 电流检测结果 0 不及格 1 及格 */
    electric_ret: number;
    /** 墨码检测结果（普通型） 0 不及格 1 及格 */
    code_ret: number;
    /** 底盖蓝底检测结果（普通型） 0 不及格 1 及格 */
    end_ret: number;
    /** 启破力检测结果（强化型） 0 不及格 1 及格 */
    open_ret: number;
    /** 文件信息 */
    files: File[];
  }
}
