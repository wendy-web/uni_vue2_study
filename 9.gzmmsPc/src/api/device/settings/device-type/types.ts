/* 资产类型页面的类型 */

/** 新建(添加)设备时接口参数类型 */
export type CreateEquipmentQuery = {
  name: string;
  pid?: number;
  rank?: number;
  status?: number;
  note?: string;
};

/** 编辑(更新)设备时接口参数类型 */
export type UpdateEquipmentQuery = CreateEquipmentQuery & {
  id: number;
};

/** 列表接口返回的数据类型 */
export type IEquipmentList = {
  list: IEquipmentItem[];
};
/** 列表接口返回的List数据类型 */
export type IEquipmentItem = {
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
  _children: IEquipmentItem[];
};
