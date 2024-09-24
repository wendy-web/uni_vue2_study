// 基础配置类型
export namespace QualityCommonModule {
  // 获取表头
  export interface TabelLabelQuery {
    item: number; // 单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告 8、战马空罐检验报告 9、原材料使用通知单
    sku: string; //产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
    oid?: number; // 单据id
    [key: string]: any;
  }
  export interface TabelLabelItem {
    // check_time: InitTabelLabelItem;
    // batch_no: InitTabelLabelItem;
    // pack_no: InitTabelLabelItem;
    // body_high: InitTabelLabelItem;
    // lange_width: InitTabelLabelItem;
    // w_standard: InitTabelLabelItem;
    // body_hook_length: InitTabelLabelItem;
    // end_hook_length: InitTabelLabelItem;
    // overlap: InitTabelLabelItem;
    // overlap_rate: InitTabelLabelItem;
    // t_standard: InitTabelLabelItem;
    // end_hook_clearance: InitTabelLabelItem;
    // body_hook_clearance: InitTabelLabelItem;
    // wrinkle_rate: InitTabelLabelItem;
    // bule_dots: InitTabelLabelItem;
    [key: string]: InitTabelLabelItem;
  }

  export interface InitTabelLabelItem {
    key: string;
    name: string;
    initval: string;
    type?: number;
    unit?: string;
    lower_limit_val: string;
    upper_limit_val: string;
    error_limit_val: string;
    default_val?:string;
    value: number;
    sort: number;
    child: InitTabelLabelItem[];
  }

  // 空罐下拉框基础数据
  export interface EmptyOrderBaseData {
    brand_data: BrandDaum[];
    check_init: CheckInit[];
    status: CheckInit[];
    check_user_list: CheckInit[];
  }

  export interface BrandDaum {
    id: string;
    name: string;
    child: SelectStringOpions[];
  }

  export interface CheckInit {
    id: number;
    name: string;
  }
  export interface seletcOptionItem {
    label: string;
    value: number;
  }

  export interface DownloadParams {
    id: number; //文件ID
    type: number; // 单据类型；类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告 8、战马空罐检验报告 9、原材料使用通知单
  }
  // 获取单据审批传参
  export interface ProListQuery {
    /** 单据类型单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告
     * 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告
     * 8、战马空罐检验报告 9、原材料使用通知单
     */
    type: number;
    /** 单据ID 单据ID，不传则为新增 */
    id?: number;
  }
}
/** 下拉数据都是string类型 */
export type SelectStringOpions = {
  id: string;
  name: string;
};
/** 获取版本下拉数据返回的数据类型 */
export interface VersionListType {
  id: number;
  is_open: number;
  version_no: string;
  name: string;
  order_no: string;
  ct_uid: number;
  ct_name: string;
  up_uid: number;
  up_name: string;
  create_time: string;
}

/** 内涂膜检测明细下拉数据接口--返回的列表数据类型-空罐进货检验报告 */
export interface InnerCoatingListType {
  /** 唯一值 */
  unique_id: string;
  /** 非唯一值 */
  id: number;
  oid: number;
  batch_no: string;
  pack_no: number;
  check_time: string;
  check_json: string;
  print_factor_id: number;
  is_use: number;
  print_factor: string;
  create_time: string;
  update_time: string;
  line_id: number;
  electric_ret: number;
  open_ret: number;
  version_id: number;
  sup_name: string;
  version: string;
  number: number;
  line: string;
  select_status?: boolean;
}

/** 原材料类别获取检测明细下拉数据接口返回列表数据类型-原材料使用通知单 */
export interface CheckDetailListType {
  unique_id: number | string;
  order_id: number;
  pack_no: number;
  batch_no: string;
  check_date: string;
  number: number;
  select_status?: boolean;
}

/** 微生物下拉列表数据类型 */
export interface MicrobialCheckListType {
  id: number;
  check_order_id: number;
  batch_no: string;
  batch_number: string;
  check_res: number;
  sku: string;
  line_id: number;
  line: string;
  phys_net_val: string;
  phys_internal_pressure_val: string;
  ph_val: string;
  soluble_solids_val: string;
  select_status?:boolean;
}
