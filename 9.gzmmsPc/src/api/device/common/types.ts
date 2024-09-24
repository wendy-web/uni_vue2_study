/** 通用列表类型-id:number;name:string */
export interface IdNameType {
  id: number;
  name: string;
}

/** 基础资料类型 */
export namespace EquipmentModule {
  /** 部门人员列表中的user_list的类型 */
  export interface UserListType extends IdNameType {
    dept_id: number;
  }

  //不导出 外部无法使用
  export interface EqBaseDataType {
    /** 资产类型列表 */
    eqipment_type: EqipmentType[];
    /** 产线列表 */
    product_line: IdNameType[];
    eqipment_status: IdNameType[];
    depreciation_type: IdNameType[];
    export_type: IdNameType[];
    /** 附件列表 */
    file_type: IdNameType[];
    /** 人员列表 */
    user_list: IdNameType[];
    /** 供应商列表 */
    sup_list: SupListType[];
    /** 部门列表 */
    dept_list: DeptListType[];
    /** 部门人员列表 */
    dept_user_list: DeptUserListType[];
    /** 使用位置 */
    place_list: PlaceListType[];
  }

  export interface EqipmentType {
    id: number;
    name: string;
    pid: number;
    rank: number;
    status: number;
    ct_id: number;
    up_id: number;
    note: string;
    create_time: string;
    update_time: string;
    ct_name: string;
    up_name: string;
    _level: number;
    _children: EqipmentType[];
  }

  /** 使用位置类型 */
  export interface PlaceListType {
    id: number;
    place_name: string;
    pid: number;
    top_id: number;
    rank: number;
    create_id: number;
    update_id: number;
    module_type: number;
    level: number;
    children: PlaceListType[];
  }
  /** 部门人员列表类型 */
  export interface DeptUserListType {
    id: number;
    name: string;
    pid: number;
    top_id: number;
    rank: number;
    ct_uid: number;
    up_uid: number;
    module_type: number;
    create_time: string;
    user_list: UserListType[];
  }

  /** 部门列表类型 */
  export interface DeptListType {
    id: number;
    name: string;
    pid: number;
    top_id: number;
    rank: number;
    ct_uid: number;
    up_uid: number;
    module_type: number;
    create_time: string;
    _level: number;
    _children: DeptListType[];
  }

  /** 供应商列表类型 */
  export interface SupListType {
    id: number;
    name: string;
    mobile: string;
    contact: string;
  }
  /** 人员列表类型 */
  export interface UserListType {
    id: number;
    role_id: string;
    name: string;
    user: string;
    pwd: string;
    openid: string;
    unionid: string;
    head_url: string;
    work_no?: any;
    warehouse_id: any[];
    wh_arr: number[];
    dept_id: number;
    status: number;
    ct_uid: number;
    up_uid: number;
    module_types: string;
    is_white_user: number;
    create_time: string;
    role_name: string;
    view_warehouses: string;
    belong_warehouses: string;
    dept_name: string;
    warehouse_name: any[];
  }

  /** 设备档案列表item返回数据 */
  export interface EquipmentItemType {
    id: number;
    pid: number;
    equipment_no: string;
    asset_no: string;
    barcode: string;
    bar_title: string;
    brand: string;
    spec: string;
    equipment_code: string;
    equipment_type: string;
    power: string;
    sn: string;
    export_type: number;
    product_line: number;
    product_line_text: string;
    note: string;
    status: number;
    use_dept_id: string;
    duty_dept_id: string;
    use_duty_user: string;
    open_date: string;
    use_year: number;
    expire_date: string;
    save_addr: string;
    scrap_date?: any;
    scrap_reason: string;
    supplier_id: number;
    production_id: number;
    purchase_uid: number;
    price: string;
    spoiled_rate: string;
    spolied: string;
    depreciation_type: number;
    ct_uid: number;
    up_uid: number;
    create_time: string;
    update_time: string;
    eq_type_text: string;
    save_addr_text: string;
    status_text: string;
    export_type_text: string;
    depreciation_type_text: string;
    use_dept_text: string;
    duty_dept_text: string;
    use_duty_user_text: string;
    purchase_uid_text: string;
    supplier_id_text: string;
    production_id_text: string;
    _level: number;
    _children: any[];
    select_status?: boolean;
  }
  /** 设备档案列表接口返回数据 */
  export interface EquipmentListType {
    list: EquipmentItemType[];
    total: number;
    page: string;
    size: string;
  }
  /** 请求设备档案列表接口返回数据 */
  export interface EquipmentListQuery {
    /** 资产类型id字符串，多个用,隔开 */
    equipment_type: string;
    page: number;
    size: number;
    /** 存放位置，用逗号隔开 */
    save_addr?: string;
    /** 使用部门，用逗号隔开 */
    use_dept_id?: string;
    /** 使用负责人，用逗号隔开 */
    use_duty_user?: string;
  }
}

/** 货品下拉列表数据类型模块 */
export namespace DeviceGoodsDrop {
  export interface GoodsItemData {
    id: number;
    barcode: string;
    brand: string;
    title: string;
    spec: string;
    class_name: string;
    measure_name: string;
    ss_num: string;
    goods_class: string;
    order_point: string;
    price: string;
    purchase_price: string;
    split_quantity: number;
    supplier_id: number;
    sup_name: string;
    stock: number;
    select_status: boolean;
  }

  export interface GoodsListData {
    total: number;
    per_page: string;
    current_page: number;
    last_page: number;
    data: GoodsItemData[];
  }
}

/** 设备维修单基础资料类型模块 */
export namespace ReBaseSelecModule {
  /** 外委单位的数据类型 */
  export interface OutsourcingListType extends IdNameType {
    mobile: string;
    contact: string;
  }

  /** 维修原因的数据类型 */
  export interface ReasonListType extends IdNameType {
    note: string;
  }

  /** 故障类型的数据类型 */
  export interface FaultListType extends IdNameType {
    short_name: string;
  }

  /** 设备维修单基础资料接口返回数据类型 */
  export interface ReBaseDataType {
    /** 维修类型 */
    repair_type: IdNameType[];
    /** 外委单位 */
    outsourcing_list: OutsourcingListType[];
    /** 维修原因 */
    repair_reason: ReasonListType[];
    /** 故障类型 */
    faultType: FaultListType[];
    /** 用户列表 */
    user_list: IdNameType[];
    /** 产线列表 */
    product_line: IdNameType[];
  }
  /** 关联领用单接口返回的数据类型 */
  export interface OrderUpListType {
    wh_rec_no: string;
    out_time: string;
    /** 制单人 */
    receiver_name?: string;
    /** 指定领取人 */
    ar_names?: string;
    rec_type: number;
    status: number;
    barcode: string;
    spec: string;
    brand: string;
    class_name: string;
    measure_name: string;
    ph_no: string;
    in_wh_date: string;
    price: string;
    goods_id: number;
    received_num: number;
    warehouse_name: string;
    warehouse_id: number;
    use_place_id: number;
    title: string;
    sup_name: string;
    rec_detail_id: number;
    use_num: number;
    /**  未使用数量(不需要适用) */
    no_use_num: number;
    /** 待用数 */
    rem_num: number;
    /** 领料申请人 */
    rp_names?: string;
    select_status?: boolean;
    stock_id: number;
    is_have_unique: boolean;
  }
  /** 关联领用单换上备件的传递给接口的数据类型 */
  export type OrderUpListAddType = {
    /** id编辑的保存的时候需要 */
    id?: number;
    re_no: string;
    rec_detail_id: number;
    goods_id: number;
    out_date: string;
    chage_date: string;
    out_ware_id: number;
    out_ware: string;
    barcode: string;
    title: string;
    spec: string;
    brand: string;
    class_name: string;
    measure_name: string;
    received_num: number;
    price: string;
    in_wh_date: string;
    sup_name: string;
    use_addr: number;
    rem_num?: number;
    use_num: number;
    eq_id: number;
    stock_id: number;
    is_have_unique?: boolean;
    unique_label_detail?: uniqueLabelDetailType[];
  };

  type uniqueLabelDetailType = {
    unique_code: string;
  };

  export interface OrderUpDataType {
    total: number;
    per_page: string;
    current_page: number;
    last_page: number;
    data: OrderUpListType[];
  }

  export interface DownDataType {
    total: number;
    per_page: string;
    current_page: number;
    last_page: number;
    data: DownListType[];
  }

  /** 关联换下备件接口返回的数据类型 */
  export interface DownListType {
    repair_no?: string;
    id: number;
    type?: number;
    repair_id: number;
    rec_detail_id: number;
    re_no: string;
    order_no: string;
    eq_id: number;
    order_status: number;
    goods_id?: number;
    out_date: string;
    chage_date: string;
    down_date: string;
    down_num: number;
    out_ware_id?: number;
    out_ware: string;
    barcode: string;
    title: string;
    spec: string;
    brand: string;
    class_name: string;
    measure_name: string;
    received_num: number;
    price?: string;
    in_wh_date: string;
    sup_name: string;
    use_addr: string;
    use_num: number;
    ct_uid?: number;
    up_uid?: number;
    ct_name?: any;
    create_time?: string;
    update_time?: string;
    online_num: number;
    order_type: number;
    order_type_text: string;
    select_status?: boolean;
    stock_id: number;
    is_have_unique?: boolean;
    unique_label_detail?: uniqueLabelDetailType[];
  }
}

/** 新建点巡检计划-获取点巡检项目列表接口返回数据类型模块 */
export interface InspecDataType {
  list: InspecItemType[];
  total: number;
  page: string;
  size: string;
}
export interface InspecItemType {
  id: number;
  inspect_id: string;
  method: string;
  std_explain: string;
  item_content: string;
  note: string;
  record_method: number;
  record_content?: any;
  normal_val: string;
  abnormal_val: string;
  default_val?: any;
  upper_limit_val?: any;
  lower_limit_val?: any;
  up_uid: number;
  ct_uid: number;
  ct_name: string;
  update_time: string;
  create_time: string;
  inspect_items_name: string;
  equipment_type_id: number;
  equipment_type_title: string;
  inspect_purpose: string;
  result_item: string;
  select_status?: boolean;
}

/** 获取点巡检-执行计划数据的类型 */
export namespace InspecExecuData {
  export interface DataType {
    id: number;
    plan_no: string;
    cycle_type: number;
    plan_details_no: string;
    equipment_type_id: number;
    equipment_type_title: string;
    equipment_id: number;
    is_must_pho: number;
    is_must_sig: number;
    plan_start_time: string;
    executor_uid: string;
    last_start_time?: any;
    status: number;
    note?: any;
    up_uid?: any;
    ct_uid: number;
    ct_name: string;
    update_time: string;
    create_time: string;
    asset_no: string;
    barcode: string;
    bar_title: string;
    spec: string;
    use_places: string;
    save_addr: string;
    use_dept_names: string;
    result_options: string;
    use_dept_id: string;
    executor_names: string;
    equipment: EquipmentDataType;
    cycle: CycleType[];
    executive_rule_type: number;
    plan_end_time: string;
  }

  export interface EquipmentDataType {
    id: number;
    pid: number;
    equipment_no: string;
    asset_no: string;
    barcode: string;
    bar_title: string;
    brand: string;
    spec: string;
    equipment_code: string;
    equipment_type: string;
    equipment_type_id: string;
    power?: any;
    sn: string;
    export_type?: any;
    product_line?: any;
    note: string;
    status: number;
    use_dept_id: string;
    duty_dept_id: string;
    use_duty_user: string;
    open_date?: any;
    use_year?: any;
    expire_date?: any;
    save_addr: string;
    scrap_date?: any;
    scrap_reason: string;
    supplier_id?: any;
    production_id?: any;
    purchase_uid?: any;
    price: string;
    spoiled_rate?: any;
    spolied?: any;
    depreciation_type?: any;
    ct_uid: number;
    up_uid: number;
    create_time: string;
    update_time: string;
    use_places: string;
    use_dept_names: string;
  }

  export interface CycleType {
    id: number;
    plan_id: number;
    inspect_item_id: number;
    plan_start_time: string;
    cycle_type: number;
    note: string;
    executor_uid: string;
    up_uid?: any;
    ct_uid: number;
    ct_name: string;
    update_time: string;
    create_time: string;
    method: string;
    std_explain: string;
    item_content: string;
    record_method: number;
    normal_val: string;
    abnormal_val: string;
    default_val?: any;
    upper_limit_val: any;
    lower_limit_val: any;
    result_content: ResultContent[];
    val: any;
  }
  export interface ResultContent {
    type: number;
    val: string;
    is_normal: number;
    is_check: number;
  }
}
