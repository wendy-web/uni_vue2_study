// 基础配置类型
export namespace CansSeamModule {
  // 搜索传入的类型
  export interface Query {
    order_no?: string;
    batch_no?: string;
    status?: number;
    check_date_start?: string;
    check_date_end?: string;
    page: number;
    size: number;
  }
  /** 空罐卷封检验列表返回的数据 */
  export interface CansSeamItem {
    id: number;
    order_no: string; // 单据编号
    brand: string; // 产品品牌 ND1 红牛 ND2 战马
    sku: string; // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装"
    batch_no: string; // 生产批号
    check_date: string; // 检测日期
    check_user_name: string; // 检测员名称
    check_ret_text: string; // 检测结果
    recheck_name: any; // 复核人
    recheck_date: any; // 复核时间
    status: number; // 单据状态 0 暂存 1待审核 2已审核 3审核不通过 4 撤回
    remark: any; // 备注
    create_time: string;
    assoc_type: number[]; // 按钮权限对象 0查看,1创建人,2待审批,3已审批,4抄送,5提审抄送
    brand_name: string; // 品牌名称
    sku_name: string; // sku名称
    status_text: string; // 状态文本
  }
  export type CansSeamList = OrderListType<CansSeamItem>;
  // 空罐卷封详情 EmptypotInfo
  export interface EmptypotInfo {
    id: number | FormNumType;
    order_no: string; // 单据编号
    batch_no: string; // 生产批号
    brand: string; // 产品品牌 ND1 红牛 ND2 战马
    sku: string; // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装"
    check_date: string; // 检测日期
    check_user_id: number | FormNumType; // 检测员id
    check_user_name: string; // 检测员名称
    check_ret: number | FormNumType; // 检验结果 0 不及格 1及格
    check_sign: string; // 检验员签字
    status: number | FormNumType; // 单据状态 0 暂存 1待审核 2已审核 3审核不通过 4 撤回
    ct_uid?: undefined | FormNumType; // 创建人id
    dept_id?: number; // 制单人部门
    ct_name?: string; // 创建人
    create_time?: string; // 创建时间
    up_uid?: number; // 更新人id
    up_name?: string; // 更新人
    update_time?: string; // 更新时间
    recheck?: recheckItem[]; // 复核信息
    remark: any; // 备注
    check_remark?: string; // 审核备注
    checkinfo: Checkinfo[]; // 检测数据信息
    total: number | FormNumType; // 总检查项
    abnormal: number | FormNumType; // 异常数
    files: File[]; // 文件数据
    logs: Log[]; // 日志信息
  }
  export interface recheckItem {
    recheck_uid: number;
    recheck_name: string;
    recheck_date: string;
    recheck_sign: string;
    check_remark: string;
  }

  // 编辑创建提审传参
  export interface EmptypotParams {
    id?: number;
    batch_no?: string;
    brand?: string;
    sku?: string;
    check_date?: string;
    check_user_id?: string | number;
    check_user_name?: string;
    check_ret?: string;
    check_sign?: string;
    status?: number;
    checkinfo?: Checkinfo[];
    files?: File[];
    remark?: string;
    abnormal?: number;
    total?: number;
    logs?: Log[];
  }
  // 提交签名审核
  export interface EmptypotCommit {
    id: number;
    check_ret: number| undefined; // 检测结果 1合格 0 不合格
    check_sign: string; // 检测员签名
  }

  // 驳回传参
  export interface EmptypotReject {
    id: number;
    check_remark?: string; // 审批备注
  }
  // 签名审核通过传参
  export interface EmptypotFinish {
    id: number;
    recheck_sign: string; // 复核人签名
    check_remark?: string; // 审批备注
  }
  export interface Checkinfo {
    id?: number; // 空罐卷封检验信息ID
    oid?: number; // 关联单据ID
    check_time?: string; // 检测时间
    batch_no?: string; // 批次号
    pack_no?: FormNumType; // 包号
    check_json?: CheckJson[]; // 检测信息
    wrinkle_rate?: string | number; // 皱纹度
    bule_dots?: string | number; // 蓝点尺寸
    create_time?: string;
    update_time?: string;
    unique_id?: string;
    check_ret?: number;
  }

  export interface CheckJson {
    body_high?: string; // 罐体高度
    lange_width?: string; //翻边尺寸
    w_standard?: string; // 宽度
    inner?: string | number; // 罐内径
    body_hook_length?: string; // 身钩长度
    end_hook_length?: string; // 盖钩长度
    overlap?: string; // 盖钩长度
    overlap_rate?: string; // 迭接率
    t_standard?: string; // 厚度
    end_hook_clearance?: string; // 盖钩顶隙
    body_hook_clearance?: string; // 罐钩顶隙
    [key: string]: any;
  }

  export interface File {
    id?: number;
    oid?: number;
    file_name: string;
    file_url: string;
    note: string;
    download_num?: number;
    ct_uid?: number;
    up_uid?: number;
    create_time?: string;
    update_time?: string;
  }

  export interface Log {
    name: string;
    content: string;
    dept_name: string;
    create_time: string;
  }
}
