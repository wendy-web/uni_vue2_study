import { getEqipmentTypeSelectApi } from "@/api/device/common";
import {
  getBaseSelectApi,
  getEquipmentSelectApi,
  getReBaseSelectApi,
} from "@/api/device/common/index";
import { EquipmentModule, IdNameType, ReBaseSelecModule } from "@/api/device/common/types";

export function useBaseData() {
  /** 资产类型树形结构数据 */
  const treeData = ref<EquipmentModule.EqipmentType[]>([]);
  /** 人员选择列表数据 */
  const userList = ref<IdNameType[]>([]);
  /** 部门选择列表数据 */
  const departmentList = ref<EquipmentModule.DeptListType[]>([]);
  /** 使用地点列表数据 */
  const placeList = ref<EquipmentModule.PlaceListType[]>([]);
  /** 产线列表数据 */
  const lineList = ref<IdNameType[]>([]);
  /** 可用状态列表数据 */
  const eqipment_status = ref<IdNameType[]>([]);
  /** 供应商列表数据 */
  const supplierList = ref<IdNameType[]>([]);
  /** 附件分类列表数据 */
  const fileTypeList = ref<IdNameType[]>([]);

  /* ~~~~~~~~~~~ */
  /** 维修类型数据列表 */
  const repairTypeList = ref<IdNameType[]>([]);
  /** 外委单位数据列表 */
  const outsourcingList = ref<ReBaseSelecModule.OutsourcingListType[]>([]);
  /** 维修原因数据列表 */
  const repairReasonList = ref<ReBaseSelecModule.ReasonListType[]>([]);
  /** 故障类型数据列表 */
  const faultList = ref<ReBaseSelecModule.FaultListType[]>([]);

  /** 调用获取整体基础数据接口 */
  async function getBase() {
    const result = await getBaseSelectApi();
    treeData.value = result.data.eqipment_type;
    userList.value = result.data.user_list;
    departmentList.value = result.data.dept_list;
    placeList.value = result.data.place_list;
    lineList.value = result.data.product_line;
    eqipment_status.value = result.data.eqipment_status;
    supplierList.value = result.data.sup_list;
    fileTypeList.value = result.data.file_type;
  }

  /** 调用获取维修单的基础数据接口 */
  async function getReBase() {
    const result = await getReBaseSelectApi();
    repairTypeList.value = result.data.repair_type;
    outsourcingList.value = result.data.outsourcing_list;
    repairReasonList.value = result.data.repair_reason;
    faultList.value = result.data.faultType;
    userList.value = result.data.user_list;
    lineList.value = result.data.product_line;
  }

  /** 获取资产类型列表 */
  async function getTypeList() {
    const result = await getEqipmentTypeSelectApi();
    treeData.value = result.data;
  }

  /** 获取产线名称 */
  const getLineName = (id: number) => {
    return lineList.value.find((item) => item.id === id)?.name;
  };

  return {
    /** 资产类型树形结构数据 */
    treeData,
    /** 人员选择列表数据 */
    userList,
    /** 部门选择列表数据 */
    departmentList,
    /** 使用地点列表数据 */
    placeList,
    /** 产线列表数据 */
    lineList,
    /** 可用状态列表数据 */
    eqipment_status,
    /** 供应商列表数据 */
    supplierList,
    /** 调用获取整体基础数据接口 */
    getBase,
    /** 附件分类列表数据 */
    fileTypeList,
    /** 获取产线名称 */
    getLineName,

    /** 调用获取维修单的基础数据接口 */
    getReBase,
    /** 维修类型数据列表 */
    repairTypeList,
    /** 外委单位数据列表 */
    outsourcingList,
    /** 维修原因数据列表 */
    repairReasonList,
    /** 故障类型数据列表 */
    faultList,

    /** 获取资产类型列表 */
    getTypeList,
  };
}

export function useCommon() {
  /** 通用-保养循环周期列表 */
  const cycleOptions = [
    {
      label: "1个月",
      value: 1,
    },
    {
      label: "3个月",
      value: 3,
    },
    {
      label: "4个月",
      value: 4,
    },
    {
      label: "6个月",
      value: 6,
    },
    {
      label: "8个月",
      value: 8,
    },
    {
      label: "10个月",
      value: 10,
    },
    {
      label: "12个月",
      value: 12,
    },
    {
      label: "24个月",
      value: 24,
    },
  ];
  /** 根据保养循环周期类型获取名称 */
  function getCycleName(cycle_type: number) {
    const findRes = cycleOptions.find((item) => item.value === cycle_type);
    return findRes ? findRes.label : "";
  }

  /** 点巡检根据记录方式类型返回名称 */
  function getRecordName(type: number) {
    switch (type) {
      case 0:
        return "单选";
      case 1:
        return "多选";
      case 2:
        return "数值";
      case 3:
        return "长文本";
      default:
        return "";
    }
  }

  function getLimitVal(type: number, val: string) {
    if (type === 2) {
      return (
        <>
          <span>{val}</span>
        </>
      );
    } else {
      return (
        <>
          <span>--</span>
        </>
      );
    }
  }

  /** 点巡检循环周期列表*/
  const inspecCycleOptions = [
    {
      label: "每天",
      value: 0,
    },
    {
      label: "每月",
      value: 1,
    },
    {
      label: "每季",
      value: 2,
    },
    {
      label: "每年",
      value: 3,
    },
  ];
  /** 执行时间规则列表 */
  const executiveRuleOptions = [
    {
      label: "按上次执行时间",
      value: 0,
    },
    {
      label: "按固定周期",
      value: 1,
    },
  ];

  /** 根据点巡检循环周期类型获取名称 */
  function getInspecCycleName(cycle_type: number) {
    const findRes = inspecCycleOptions.find((item) => item.value === cycle_type);
    return findRes ? findRes.label : "";
  }

  /** 根据点巡检执行时间规则类型获取名称 */
  function getExecutiveRuleName(rule_type?: number) {
    const findRes = executiveRuleOptions.find((item) => item.value === rule_type);
    return findRes ? findRes.label : "";
  }

  function getRulePlanTime(data: { rule_type?: number; start_time: string; end_time: string }) {
    let { rule_type, start_time, end_time } = data;
    return rule_type === 1 ? `${start_time}至${end_time}` : `${start_time}`;
  }

  return {
    cycleOptions,
    getCycleName,
    inspecCycleOptions,
    getInspecCycleName,
    getRecordName,
    executiveRuleOptions,
    getExecutiveRuleName,
    getRulePlanTime,
    getLimitVal
  };
}
