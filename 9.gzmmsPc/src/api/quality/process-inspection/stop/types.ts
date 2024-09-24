export interface SearchParams {
  page: number;
  size: number;
  order_no: string;
  line_id: string;
  check_ret: string;
  check_date_start: string;
  check_date_end: string;
}

export interface List {
  id: number;
  order_no: string;
  workshop_id: number;
  workshop_name: string;
  line_id: number;
  line_name: string;
  check_date: string;
  pro_id: number;
  pro_name: string;
  check_ret: null;
  ct_uid: number;
  dept_id: number;
  ct_name: string;
  create_time: string;
  up_uid: number;
  up_name: string;
  update_time: string;
  remark: null;
  assoc_type: number[];
}

export interface OrderParams {
  workshop_id: string;
  workshop_name: string;
  line_id: string;
  line_name: string;
  check_date: string;
  pro_id: string;
  pro_name: string;
}

export interface ChecKRetParams {
  id: any;
  oid: any;
  check_ret: any;
  data: Data;
  [key: string]: any;
}

interface Data {
  before_cip: Beforecip;
  cip: Cip;
}

interface Cip {
  check_ret: string;
  check_sign: string;
  info: Info;
}

interface Info {
  pm05: Pm05;
  pm5: Pm05;
}

interface Pm05 {
  avg: string;
  vals: string;
  base_val: Baseval;
  index: number;
}

interface Beforecip {
  values: string;
  check_ret: string;
  check_sign: string;
  index: number;
}

export interface SaveFileParams {
  oid: number;
  file_name: string;
  file_url: string;
  note: string;
}

export interface Details {
  id: string;
  order_no: string;
  workshop_id: string;
  workshop_name: string;
  line_id: string;
  line_name: string;
  check_date: string;
  pro_id: string;
  pro_name: string;
  check_ret: string;
  ct_uid: string;
  dept_id: string;
  ct_name: string;
  create_time: string;
  up_uid: string;
  up_name: string;
  update_time: string;
  remark: string;
  check_info: Checkinfo;
  files: any[];
}

interface Checkinfo {
  before_cip: BeforecipInfo;
  cip: CipInfo;
  before_start_water: Beforestartwater;
  before_start_outwater: BeforecipInfo;
  after_open: BeforecipInfo;
  id: string;
  oid: string;
  create_time: string;
  update_time: string;
  [key: string]: any;
}

interface Beforestartwater {
  name: string;
  child_name: string;
  info: Info3[];
}

interface Info3 {
  key: string;
  name: string;
  values: string;
  check_user_id: string;
  check_user_name: string;
  check_ret: number;
  check_sign: string;
  base_val: Baseval;
  val_type: any;
  index: any;
  btn_type: any;
}

interface Baseval {
  key: string;
  name: string;
  unit: string;
  sort: string;
  child: string;
  initval: string;
  strval: string;
  type: string;
  lower_limit_val: string;
  upper_limit_val: string;
  error_limit_val: string;
  value: string;
  default_val: string;
}

interface CipInfo {
  name: string;
  child_name: string;
  info: Info2;
  check_user_id: string;
  check_user_name: string;
  check_ret: any;
  check_sign: string;
}

interface Info2 {
  pm05: Pm05Info;
  pm5: Pm05Info;
}

interface Pm05Info {
  avg: any;
  vals: any;
  base_val: Baseval;
  index: number;
  btn_type: any;
  val_type: any;
}

interface BeforecipInfo {
  name: string;
  child_name: string;
  info: Info4[];
}

interface Info4 {
  key: string;
  name: string;
  values: string;
  check_user_id: string;
  check_user_name: string;
  check_ret: any;
  check_sign: string;
  base_val: Baseval;
  btn_type: any;
  index: any;
  val_type: any;
}

export interface StopcipBaseData {
  work_shop_init: Workshopinit[];
  line_init: Workshopinit[];
  brand_data: Branddatum[];
  check_init: Workshopinit[];
  pro_init: Workshopinit[];
}

export interface Branddatum {
  id: string;
  name: string;
  long_name: string;
  child: Child[];
  film: Film[];
}

export interface Film {
  id: string;
  name: string;
}

export interface Child {
  id: string;
  name: string;
  spec: string;
  spec_num: string;
  package: string;
}

export interface Workshopinit {
  id: number;
  name: string;
}

export enum CHECKRET {
  /**未检测 */
  UNCHECK = 0,
  /**已检测 */
  CHECKED = 1,
  /**部分检测 */
  PARTCHECK = 2,
}
