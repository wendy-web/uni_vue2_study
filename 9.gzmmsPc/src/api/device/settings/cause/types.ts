/* 故障原因页面的类型 */

/** 新建(添加)设备时接口参数类型 */
export type CreateCauseQuery = {
  name: string;
  note?: string;
};

/** 编辑(更新)设备时接口参数类型 */
export type UpdateCauseQuery = CreateCauseQuery & {
  id: number;
};

export interface CauseItem {
  id: number;
  name: string;
  note: string;
}

export interface CauseList {
  list: CauseItem[];
}
