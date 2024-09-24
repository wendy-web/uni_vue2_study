import { getUserListApi, placeListApi } from "@/api/common/index";
import { PlaceListType } from "@/api/common/types";
import { getEqipmentTypeSelectApi } from "@/api/device/common";
import type { EquipmentModule } from "@/api/device/common/types";
import { getRelListApi } from "@/api/energy/common/index";
import { getClasstimeMapInitApi } from "@/api/quality/common";

export function useSelectData() {
  /** 远程仪表名列表 */
  const relList = ref<SelectOpitonType[]>([]);

  /** 获取远程仪表名
   * @param type 0：电表；1：水表；2：蒸汽表，默认0
   */
  async function getRelData(type: number = 0) {
    const result = await getRelListApi({ type });
    const list = result.data;
    relList.value = list;
    return changeLabelValue(list);
  }

  /** 使用地点列表 */
  const placeList = ref<PlaceListType[]>([]);
  /** 获取使用地点 */
  async function getPlaceList() {
    const result = await placeListApi();
    placeList.value = result.data;
  }

  /** 资产类型树形结构数据 */
  const treeData = ref<EquipmentModule.EqipmentType[]>([]);
  /** 获取资产类型列表 */
  async function getTypeList() {
    const result = await getEqipmentTypeSelectApi();
    treeData.value = result.data;
  }

  /** 人员数据列表id-name格式 */
  const userList = ref<OptionsValueType[]>([]);
  /** 获取人员数据列表 */
  async function getUserList() {
    const result = await getUserListApi();
    const list = result.data.list;
    userList.value = changeLabelValue(list);
    return changeLabelValue(list);
  }

  /** 自动抄表规则列表-label-value格式，0：按班次；1：按每天；2：按每月；3：不自动 */
  const autoRuleOptions = [
    {
      label: "按班次",
      value: 1,
    },
    {
      label: "按每天",
      value: 2,
    },
    {
      label: "按每月",
      value: 3,
    },
    {
      label: "不自动",
      value: 0,
    },
  ];

  /** 用途选择列表-label-value格式，0：生产；1：生活；2：其他 */
  const purposeOptions = [
    {
      label: "生产",
      value: 0,
    },
    {
      label: "清洁",
      value: 1,
    },
    {
      label: "其他",
      value: 2,
    },
  ];
  /** 获取用途文本 */
  function getPurposeName(type: number) {
    return purposeOptions.find((item) => item.value === type)?.label || "";
  }
  /** 记录生产班组数据列表 */
  const classTypeList = ref<SelectOpitonType[]>([]);

  /** 获取生产班组数据方法 */
  async function getClassTypeMap() {
    const result = await getClasstimeMapInitApi();
    classTypeList.value = result.data;
  }

  /** 班别选择列表-label-value格式 */
  const classNoOptions = [
    {
      label: "白班",
      value: 1,
    },
    {
      label: "中班",
      value: 2,
    },
    {
      label: "夜班",
      value: 3,
    },
  ];
  /** 获取班别名称 */
  function getClassNoName(type: number) {
    return classNoOptions.find((item) => item.value === type)?.label || "";
  }

  /** 转换数据为label value的数据格式 */
  function changeLabelValue(list: SelectOpitonType[]) {
    return list.map((item) => {
      return {
        label: item.name ?? item.val,
        value: item.id,
        ...item,
      };
    });
  }

  return {
    /** 获取远程仪表数据 */
    getRelData,
    relList,
    /** 获取使用地点 */
    getPlaceList,
    /** 使用地点列表 */
    placeList,
    /** 自动抄表规则列表-label-value格式 */
    autoRuleOptions,
    /** 资产类型树形结构数据 */
    treeData,
    /** 获取资产类型列表 */
    getTypeList,
    /** 人员数据列表id-name格式 */
    userList,
    /** 获取人员数据列表 */
    getUserList,
    /** 用途选择列表-label-value格式，0：生产；1：生活；2：其他 */
    purposeOptions,
    /** 班别选择列表-label-value格式 */
    classNoOptions,
    /** 获取班别名称 */
    getClassNoName,
    /** 获取用途文本 */
    getPurposeName,
    /** 获取生产班组数据方法 */
    getClassTypeMap,
    /** 记录生产班组数据的列表 */
    classTypeList,
  };
}
