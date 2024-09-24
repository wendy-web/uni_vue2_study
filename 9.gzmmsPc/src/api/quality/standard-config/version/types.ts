export interface VersionDataType {
  total: number;
  per_page: string;
  current_page: number;
  last_page: number;
  data: VersionListType[];
}

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
