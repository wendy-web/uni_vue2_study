export type StandardListType = {
  maintenance_project_id: number;
  name: string;
  maintenance_requirements: string;
  maintenance_area: string;
  equipment_title: string;
  note: string;
};
/** 保养周期数据列表类型 */
export type CycleListType = StandardListType & {
  /** 周期名称 */
  cycle_name: string;
  /** 计划开始时间 */
  plan_start_time: string;
  /** 保养负责人名称 */
  director_name?: string;
  /** 其他负责人ids */
  director_uid: string;
  /** 其他负责人名称 */
  other_name: string;
  /** 其他负责人ids */
  other_uid: string;
};
