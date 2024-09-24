// 请求供应商列表的参数类型
export interface IQuery {
  keyword: string;
  page: number;
  size: number;
}

// 供应商列表API返回的list数组参数
export interface ISupItem {
  id: number;
  name: string;
  contact: string;
  mobile: string;
  e_mail: string;
  address: string;
  acct_nm: string;
  pan: string;
  license_pic: string;
  ct_uid?: number;
  up_uid?: number;
  create_time: string;
}

// 供应商列表API返回的数据类型
export interface ISupList {
  list: ISupItem[];
  total: number;
  page: string | number;
  size: string | number;
}

// 请求新建供应商的参数类型
export interface IAddQueyr {
  id?: number;
  name: string;
  contact: string;
  mobile: string;
  e_mail: string;
  address: string;
  acct_nm: string;
  pan: string;
  license_pic: string;
}

export interface IEditQuery extends IAddQueyr {
  id: number;
}

// 新建供应商API的返回的数据类型
export interface IAddInfo {
  name: string;
  contact: string;
  mobile: string;
  e_mail: string;
  address: string;
  acct_nm: string;
  pan: string;
  license_pic?: string;
  ct_uid: string | number;
  id: string | number;
}
