import { departmentListApi, getSupListApi, getUserListApi } from "@/api/common/index";
import {
  getBrandMapApi,
  getCheckReagentApi,
  getClasstimeMapInitApi,
  getEmptyCanSizeMapApi,
  getInstMapApi,
  getProductLineListApi,
  getSkuMapApi,
  getVersionMapApi,
} from "@/api/quality/common/index";
import { SelectStringOpions } from "@/api/quality/common/types";
import { checkAssocType } from "@/utils/auth";

export function useselectData() {
  /** 获取的产品大类数据列表*/
  const brandList = ref<OptionType[]>([]);

  /** 获取产品大类数据列表-ND1红牛 ND2战马 */
  async function getBrandMap() {
    const result = await getBrandMapApi();
    const list = result.data;
    let arr = changeStringValue(list);
    brandList.value = arr;
    return arr;
  }

  /** 根据产品大类获取的产品类型数据列表*/
  const skuList = ref<OptionType[]>([]);
  /** 获取产品类型数据列表-ND1-1普通型 ND1-2强化型 ND2-1战马灌装 ND2-2战马瓶装 */
  async function getSkuMap(brand?: string) {
    const result = await getSkuMapApi({ brand });
    const list = result.data;
    let arr = changeStringValue(list);
    skuList.value = arr;
    return arr;
  }

  /** 记录获取的线别数据列表 */
  const lineList = ref<SelectOpitonType[]>([]);

  /** 获取线别数据列表 */
  async function getLineList() {
    const result = await getProductLineListApi();
    const list = result.data.list;
    lineList.value = list;
    let arr = changeLabelValue(list);
    return arr;
  }

  /** 获取供应商数据列表 */
  async function getSupList() {
    const result = await getSupListApi();
    const list = result.data.list;
    return changeLabelValue(list);
  }

  /** 记录部门数据 */
  const departmentList = ref<SelectOpitonType[]>([]);
  /** 获取部门数据列表 */
  async function getDeptList() {
    const result = await departmentListApi();
    departmentList.value = result.data.list;
    const list = result.data.list;
    return changeLabelValue(list);
  }

  /** 获取人员数据列表 */
  async function getUserList() {
    const result = await getUserListApi();
    const list = result.data.list;
    return changeLabelValue(list);
  }

  /** 获取的人员列表数据 */
  const userOptions = ref<SelectOpitonType[]>([]);
  /** 调用获取人员列表数据接口-赋值给userOptions */
  async function getUserOptions() {
    const result = await getUserListApi();
    userOptions.value = result.data.list;
  }

  /** 调用获取线别列表数据接口-赋值给lineOptions */
  // async function getLineOptions() {
  //   const result = await getProductLineListApi();
  //   lineOptions.value = result.data.list;
  // }

  /** 班组下拉数据列表 */
  const classTimeOptions = ref<SelectOpitonType[]>([]);
  /** 获取班组下拉数据 */
  async function getClasstimeOptions() {
    const result = await getClasstimeMapInitApi();
    classTimeOptions.value = result.data;
  }

  /** 获取版本信息数据列表-label-value形式 */
  async function getVersionMap() {
    const result = await getVersionMapApi();
    const list = result.data;
    return list.map((item) => {
      return {
        label: item.version_no + "-" + item.name,
        value: item.id,
      };
    });
  }
  /** 获取版本信息数据列表-name-id形式 */
  async function getVersionList() {
    const result = await getVersionMapApi();
    const list = result.data;
    return list.map((item) => {
      return {
        name: item.version_no + "-" + item.name,
        id: item.id,
      };
    });
  }

  /** 获取检测试剂下拉数据列表 */
  async function getCheckReagent() {
    const result = await getCheckReagentApi();
    const list = result.data;
    return changeLabelValue(list);
  }

  /** 获取空罐尺寸下拉数据列表 */
  async function getEmptyCanSizeMap() {
    const result = await getEmptyCanSizeMapApi();
    const list = result.data;
    return changeLabelValue(list);
  }

  /** 获取生产班组下拉数据列表 */
  async function getClasstimeMap() {
    const result = await getClasstimeMapInitApi();
    const list = result.data;
    return changeLabelValue(list);
  }

  /** 转换数据为label value的数据格式-都是字符串 */
  function changeStringValue(list: SelectStringOpions[]) {
    return list.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }

  /** 转换数据为label value的数据格式 */
  function changeLabelValue(list: SelectOpitonType[]) {
    return list.map((item) => {
      return {
        label: item.name ?? item.val,
        value: item.id,
      };
    });
  }

  /** 单据状态列表 */
  const statusOptions = [
    {
      label: "暂存",
      value: 0,
    },
    {
      label: "待审核",
      value: 1,
    },
    {
      label: "已审核",
      value: 2,
    },
    {
      label: "已驳回",
      value: 3,
    },
    {
      label: "已撤回",
      value: 4,
    },
    {
      label: "已反审",
      value: 5,
    },
  ];

  /** 根据传入的status,从statusOptions返回对应的label状态文本 */
  function getStatusText(status: number, assoc_type?: number[]) {
    if (assoc_type?.length && checkAssocType(assoc_type, 3) && status === 1) {
      return "已审核";
    }
    return statusOptions.find((item) => item.value === status)?.label || "";
  }

  /** 根据sataus的状态返回对应的el-tag颜色 */
  function getTagType(status: number) {
    switch (status) {
      case 0:
        return "info";
      case 1:
        return "";
      case 2:
        return "success";
      case 3:
        return "danger";
      case 4:
        return "info";
      case 5:
        return "warning";
      default:
        return "";
    }
  }

  /** 通用选择是否合格列表id-name形式 */
  const passList = [
    {
      id: 1,
      name: "合格",
    },
    {
      id: 0,
      name: "不合格",
    },
  ];

  /** 基本信息是否合格列表label-value形式,有部分合格选项,1合格,0不合格,2部分合格,3检验中 */
  const basePassList = [
    {
      value: 1,
      label: "合格",
    },
    {
      value: 0,
      label: "不合格",
    },
    {
      value: 2,
      label: "部分合格",
    },
    {
      value: 3,
      label: "检验中",
    },
  ];

  /** 感觉basePassList是否合格列表和传入的value,返回对应的label */
  function getBasePassLabel(value: number) {
    return basePassList.find((el) => el.value === value)?.label || "";
  }

  /** 原材料类型选择列表 */
  const materialsClassOptions = [
    {
      label: "空罐",
      value: 0,
    },
    {
      label: "顶盖",
      value: 1,
    },
  ];

  /** 根据传入的materials_class,从materialsClassOptions返回对应的label文本 */
  function getMaterialsClassText(materials_class: number) {
    return materialsClassOptions.find((item) => item.value === materials_class)?.label || "";
  }

  /** 车间选择列表 */
  const workshopOptions = [
    {
      label: "一车间",
      value: 1,
    },
    {
      label: "二车间",
      value: 2,
    },
    {
      label: "三车间",
      value: 3,
    },
  ];
  function getWorkshopLabel(val: number) {
    return workshopOptions.find((item) => item.value === val)?.label || "";
  }
  /** ok和ng下拉选择数据 */
  const ngAndOkList = [
    {
      id: 1,
      name: "OK",
    },
    {
      id: 0,
      name: "NG",
    },
  ];

  /** 基本信息是否检测列表label-value形式 */
  const baseCheckStatusList = [
    {
      value: 1,
      label: "已检测",
    },
    {
      value: 0,
      label: "未检测",
    },
    {
      value: 2,
      label: "部分检测",
    },
  ];
  /** 选择对勾和x的列表,label-value形式 */
  const tasteOptions = [
    {
      label: "✔",
      value: 1,
    },
    {
      label: "✖",
      value: 0,
    },
  ];

  /** 根据baseCheckStatusList是否检测列表和传入的value,返回对应的label */
  function baseCheckStatusLabel(value: number) {
    return baseCheckStatusList.find((el) => el.value === value)?.label || "";
  }

  return {
    /** 获取产品大类数据列表-ND1红牛 ND2战马 */
    getBrandMap,
    /** 获取产品类型数据列表-ND1-1普通型 ND1-2强化型 ND2-1战马灌装 ND2-2战马瓶装  */
    getSkuMap,
    /** 获取供应商数据列表 */
    getSupList,
    /** 获取人员数据列表 */
    getUserList,
    /** 获取版本信息数据列表-label-value形式 */
    getVersionMap,
    /** 获取版本信息数据列表-name-id形式 */
    getVersionList,
    /** 根据传入的map和对照Map返回对应的符号 */
    getStatusText,
    /** 根据sataus的状态返回对应的eltag颜色 */
    getTagType,
    /** 单据状态列表 */
    statusOptions,
    /** 通用选择是否合格列表id-name形式 */
    passList,
    /** 获取检测试剂下拉数据列表 */
    getCheckReagent,
    /** 获取空罐尺寸下拉数据列表 */
    getEmptyCanSizeMap,
    /** 原材料类型选择列表 */
    materialsClassOptions,
    /** 根据传入的materials_class,从materialsClassOptions返回对应的label文本 */
    getMaterialsClassText,
    /** 车间选择列表 */
    workshopOptions,
    /** 基本信息是否合格列表label-value形式,有部分合格选项,1合格,0不合格,2部分合格,3检验中 */
    basePassList,
    /** 调用获取人员列表数据接口-赋值给userOptions */
    getUserOptions,
    /** 获取的人员列表数据 */
    userOptions,
    /** 根据产品大类获取的产品类型数据列表*/
    skuList,
    /** 获取的产品大类数据列表 */
    brandList,
    /** 获取线别列表数据-赋值给lineList */
    getLineList,
    /** 根据存在部分合格的列表返回 是否合格-不合格-部分合格 */
    getBasePassLabel,
    /** 根据车间列表返回车间名称 */
    getWorkshopLabel,
    /** ok和ng下拉选择数据 */
    ngAndOkList,
    /** 获取生产班组 */
    getClasstimeMap,
    /** 获取的线别列表数据-label-value格式 */
    lineList,
    /**getLineOptions  */
    // getLineOptions,
    /** 班组下拉数据列表 */
    classTimeOptions,
    getClasstimeOptions,
    /** 基本信息是否检测列表label-value形式 */
    baseCheckStatusList,
    /** 根据baseCheckStatusList是否检测列表和传入的value,返回对应的label */
    baseCheckStatusLabel,
    /** 记录部门数据 */
    departmentList,
    /** 获取部门数据列表 */
    getDeptList,
    /** 选择对勾和x的列表,label-value形式 */
    tasteOptions,
  };
}
