// 新增部门返回的字段类型
export interface IDeptAdd {
  ct_uid?: string;
  id: string;
  name: string;
  pid: string;
}

// 货品/仓库/计量单位 请求接口参数类型声明
export interface ICate {
  name?: string;
  id?: number;
}

// 部门接口 请求接口参数类型声明
export interface IDept {
  name: string;
  pid?: number;
  id?: number;
}

// 账户列表 请求参数类型
export interface IUser {
  warehouse_id?: number;
  dept_id?: number;
  role_id?: number;
  keyword?: string;
}
// 账户列表 返回数据类型
export interface IUserItem {
  id: number;
  role_id: string;
  name: string;
  user: string;
  pwd: string;
  openid?: null | number;
  unionid?: null | number;
  head_url?: null | string;
  work_no?: null | string;
  warehouse_id?: null | number;
  dept_id: number;
  status: number;
  ct_uid?: null | number;
  up_uid?: null | number;
  create_time: string;
  role_name: string;
  dept_name: string;
  warehouse_name?: null | string;
  depts?: number[];
  disable?: boolean;
}
export interface IUserList {
  list: IUserItem[];
}

// 菜单设置页面返回数据类型
export interface IMenuList {
  id?: number;
  auth_title: string;
  pid: number;
  module: string | null;
  controller: string | null;
  action: string | null;
  hide: number;
  rank: number;
  icon: string;
  create_time: string;
  page_path: string;
  _level?: number;
  _children?: IMenuList[];
}

// 角色设置页面返回数据类型和表格类型
export interface IroleList {
  create_time: string;
  id: number;
  ids: null | string;
  ids_num: null | string;
  remark: string;
  role_title: string;
  status: number;
  sum: number;
  data_per:number;
}

// 人员设置页面返回的表格数据类型
export interface IuserList {
  create_time: string;
  head_url: string;
  id: number;
  name: string;
  openid: null | string | number;
  pwd: string;
  role_id: string | number;
  role_name: string;
  status: string | number;
  user: string;
}
// 人员设置页面请求传递参数type
export interface IuserForm {
  id?: number | string;
  user?: string;
  name?: string;
  head_url?: string;
  pwd?: string;
  role_id?: number[] | string[];
  status?: number | string;
}

// 流程设置页面API接口返回的列表类型
export interface IApprover {
  dept_id: number;
  dept_ids: number[];
  dept_name: string;
  head_url?: string;
  id: 1;
  name: string;
  role_id: string;
  role_name: string;
  warehouse_id: number;
  warehouse_name: string;
}

export interface IApproverObj {
  user_id: number;
  dept_ids: number[];
}

export interface IVal {
  approver: IApproverObj[];
  copy: number[];
  warehouse?: number[];
}

export type IApproverObjArr = IApproverObj[];

export interface IValQuality {
  approver: IApproverObjArr[];
  copy: number[];
}

export interface IFlowItem {
  approver: any[];
  copy: IApprover[];
  warehouse: IApprover[];
  key: string;
  note: string;
  val: IVal;
  module_type: number;
  is_have_wh: number;
}

export interface IFlowObj {
  [key: string]: IFlowItem;
}

export interface IFlowList {
  list: IFlowObj;
}

export type AddIpType = {
  ip: string;
  pc_status: number;
  wx_status: number;
};

export type EditIpType = AddIpType & {
  id: number;
};

export type SetIpStatusType = {
  id: number;
  type: number;
  status: number;
};

export type IpItemType = {
  id: number;
  ip: string;
  pc_status: number;
  wx_status: number;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  desc: string;
};

export interface IpListType {
  list: IpItemType[];
  total: number;
  page: number;
  size: number;
}
