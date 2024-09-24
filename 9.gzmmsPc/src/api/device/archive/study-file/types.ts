/** 文件列表接口返回的数据类型 */
export interface FileListType {
  total: number;
  per_page: string;
  current_page: number;
  last_page: number;
  data: FileItemType[];
}

/** 文件列表list的数据类型 */
export interface FileItemType {
  id: number;
  file_name: string;
  file_url: string;
  type: number;
  download_num: number;
  note?: any;
  ct_uid: number;
  up_uid: number;
  create_time: string;
  update_time: string;
  name: string;
  dept_name: string;
  up_name: string;
  up_dept_name: string;
}

/** 文件列表请求参数类型 */
export interface FileListQueryType {
  page: number;
  size?: number;
  file_name?: string;
  type?: number;
}
