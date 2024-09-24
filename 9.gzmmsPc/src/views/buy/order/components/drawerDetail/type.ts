export interface IDrawerInfo {
  procure_no: string;
  id: number;
  ct_name: string;
  create_time: string;
  status: number;
}

export interface Props {
  visible: boolean;
  info: IDrawerInfo;
}

export enum EStatus {
  "待提审" = 0,
  "待审核",
  "待入库",
  "已完成",
  "已撤回",
  "已驳回",
  "已作废",
  "已审核",
}
