// 引入部门列表API,货品分类列表API,计量单位列表API,人员类表API,仓库列表API,地点列表API
import { h, render } from "vue";
import {
  departmentListApi,
  getProcureListApi,
  getUserListApi,
  getapproveLogApi,
  goodsCateListApi,
  placeListApi,
  sendSupEmailApi,
  storageListApi,
  unitListApi,
} from "@/api/common/index";
// 引入部门类型,货品分类类型,
import {
  IApproveLogType,
  ICateItem,
  IDeptItem,
  IProcureItem,
  PlaceListType,
} from "@/api/common/types";
import { IUserItem } from "@/api/system/types";
import ApproveLog from "@/components/ApproveLog/index.vue";

// 获取部门列表hooks
export const deptListHooks = () => {
  const departmentList = ref<IDeptItem[]>([]);

  async function getDeptList() {
    const result = await departmentListApi();
    departmentList.value = result.data.list;
  }
  onActivated(() => {
    // console.log("hooks获取部门列表");
    getDeptList();
  });
  return {
    departmentList,
  };
};

// 获取商品分类hooks
export const goodsCateListHooks = () => {
  const goodsCateList = ref<ICateItem[]>([]);

  async function getGoodsCateList() {
    const result = await goodsCateListApi();
    goodsCateList.value = result.data.list;
  }
  onActivated(() => {
    // console.log("hooks获取商品分类列表");
    getGoodsCateList();
  });
  return {
    goodsCateList,
  };
};

// 获取计量单位hooks
export const unitListHooks = () => {
  const unitList = ref<ICateItem[]>([]);

  async function getUnitList() {
    const result = await unitListApi();
    unitList.value = result.data.list;
  }
  onActivated(() => {
    // console.log("hooks获取单位列表");
    getUnitList();
  });
  return {
    unitList,
  };
};

// 获取人员列表hooks
export const userListHooks = () => {
  const userList = ref<IUserItem[]>([]);

  async function getUserList() {
    const result = await getUserListApi();
    userList.value = result.data.list;
  }
  onActivated(() => {
    // console.log("hooks获取人员列表");
    getUserList();
  });
  return {
    userList,
  };
};

// 获取仓库列表hooks
export const storageListHooks = (type = 0) => {
  /** storageList是完整的仓库列表 */
  const storageList = ref<ICateItem[]>([]);
  /** storageFilterList是进行过滤后的仓库列表  */
  const storageFilterList = ref<ICateItem[]>([]);
  async function getStorageList() {
    const result = await storageListApi({ type });
    if (type === 1) {
      storageFilterList.value = result.data.list;
    } else {
      storageList.value = result.data.list;
    }
  }
  onActivated(() => {
    // console.log("hooks获取仓库列表");
    getStorageList();
  });
  return {
    storageList,
    storageFilterList
  };
};

/**
 *
 * @param status 调用接口必须传入的参数2|3,2为未入库,3为已入库
 * @returns
 */
export const procureListHooks = (status: number) => {
  const procureList = ref<IProcureItem[]>([]);

  const getProcureList = async () => {
    const result = await getProcureListApi({ status });
    procureList.value = result.data;
  };
  onActivated(() => {
    // console.log("hooks采购单号列表");
    getProcureList();
  });
  return {
    procureList,
  };
};

/** 审批日志弹窗的hooks */
export const approveLogHooks = () => {
  // document_type 单据交易类型 1采购入库 2退货出库 3领料出库 4退料入库 5调拨 6盘点 7报废 8采购单 9采购退货单 10采购换货单 11拆装单
  // document_id   单据id

  enum EApproveType {
    "采购单入库单号" = 1,
    "其他出库单号" = 2,
    "领料出库单号" = 3,
    "退料入库单号" = 4,
    "调拨单号" = 5,
    "盘点单号" = 6,
    "报废单号" = 7,
    "采购单号" = 8,
    "采购退货单号" = 9,
    "采购换货单号" = 10,
    "拆装单单号" = 11,
  }

  type TdataType = {
    document_id: number;
    document_type: number;
    order_no: string;
  };

  const approveLogDialog = ref(false);
  const approveLoading = ref(false);
  const approveLogList = ref<IApproveLogType[]>([]);
  const approveLogMsg = ref("");

  // 点击查看审批日志
  async function lookApproveLog({ document_id, document_type, order_no = "" }: TdataType) {
    approveLogMsg.value = EApproveType[document_type] + "：" + order_no;
    approveLogList.value = [];
    approveLogDialog.value = true;
    approveLoading.value = true;
    creatComponent();
    try {
      const result = await getapproveLogApi({ document_id, document_type });
      let list = result.data;
      approveLogList.value = list;
      approveLoading.value = false;
      creatComponent();
    } finally {
      approveLoading.value = false;
    }
  }

  function creatComponent() {
    const vnode = h(ApproveLog, {
      visible: approveLogDialog.value,
      list: approveLogList.value,
      loading: approveLoading.value,
      headerMsg: approveLogMsg.value,
      ["onUpdate:visible"]: (visible: boolean) => {
        approveLogDialog.value = visible;
        if (!visible) render(null, document.body);
      },
    });
    render(vnode, document.body);
  }

  return {
    approveLogDialog,
    approveLoading,
    approveLogList,
    lookApproveLog,
  };
};

// 发送邮件hooks
export const sendEmailHooks = () => {
  function sendMail(procure_id: number) {
    let data = {
      procure_id,
    };
    sendSupEmailApi(data);
  }
  return {
    sendMail,
  };
};

/* 
  检测预览页面是否已经保存过的hooks
  预览页面提审按钮是先保存,后提审,可能出现保存成功,但提审失败的情况
  针对此情况,在保存后,记录一下保存api返回的id. 再次点击保存和提审按钮,则弹出以下提示
*/

export const checkSaveHooks = () => {
  const saveId = ref(0); //保存id
  /**
   * @explain 检测预览页面是否已经保存过的hooks
   * @returns boolean
   */
  function checkSaveFn(callback: () => void) {
    if (saveId.value) {
      ElMessageBox.confirm(`当前单据已保存,请您返回列表页后重试该操作。`, "温馨提示", {
        confirmButtonText: "我知道了",
        type: "info",
        showCancelButton: false,
      }).finally(() => {
        callback();
        saveId.value = 0;
      });
      return false;
    }
    return true;
  }

  return {
    checkSaveFn,
    saveId,
  };
};

export const getPlaceListHooks = () => {
  const placeList = ref<PlaceListType[]>([]);
  async function getPlaceList() {
    const result = await placeListApi();
    placeList.value = result.data;
  }
  onActivated(() => {
    // console.log("hooks获取地点列表");
    getPlaceList();
  });
  return {
    placeList,
  };
};
