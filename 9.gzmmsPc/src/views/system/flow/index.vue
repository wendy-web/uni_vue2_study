<script setup lang="ts">
import type { ElTable, FormInstance, TabPaneName } from "element-plus";
import { ElLoading } from "element-plus";
import { getUserDeptListApi } from "@/api/common/index";
import {
  emptyPurchaseOrderFlowApi,
  emptyQualityOrderFlowApi,
  getFlowInfoApi,
  inspectionRecordsApi,
  inspectionRecordsSecureFlowApi,
  invRetListApi,
  inventoryListApi,
  labelRecogOrderFlowApi,
  maintainWorkOrderApi,
  paperRestockOrderFlowApi,
  proReplacementApi,
  purchaseOrderApi,
  purchaseOtrInApi,
  purchaseRecApi,
  purchaseRetApi,
  qltyBoxqrOrderFlowApi,
  qltyCapOrderFlowApi,
  qltyCipmicrobeOrderFlowApi,
  qltyCleanRoomSuspendedParticleOrderFlowApi,
  qltyEmptyCanPhotoOrderFlowApi,
  qltyEmptyPotOrderFlowApi,
  qltyEndproductOrderFlowApi,
  qltyEssenceEnteringOrderFlowApi,
  qltyFillRoomAirSettlingOrderFlowApi,
  qltyFillSealMachineCleanOrderFlowApi,
  qltyHandApplicationOrderFlowApi,
  qltyHotshrinkOrderFlowApi,
  qltyIncubatorOrderFlowApi,
  qltyIngredientCleanRoomDetectionOrderFlowApi,
  qltyInnercoatingOrderFlowApi,
  qltyLaboratoryAirBacteriaDetectionOrderFlowApi,
  qltyLaboratoryAirSettlingOrderFlowApi,
  qltyLiquidSugarOrderFlowApi,
  qltyOperationOrderFlowApi,
  qltyPhCompositionAnalysisOrderFlowApi,
  qltyPhysicalMmrbOrderFlowApi,
  qltyProSetRedBullProductOrderFlowApi,
  qltyProductLabelIdentifyOrderFlowApi,
  qltyProductQrCodeConfirmOrderFlowApi,
  qltyProductRollInspectionOrderFlowApi,
  qltyProductShippingNoticeOrderFlowApi,
  qltyProductSugarOrderFlowApi,
  qltyProductquantifyOrderFlowApi,
  qltyQuantifyOrderFlowApi,
  qltySampleOrderFlowApi,
  qltySamplestockOrderFlowApi,
  qltyScaleOrderFlowApi,
  qltyWarhorseProductOrderFlowApi,
  qltyWatermicrobeOrderFlowApi,
  qltyWipOrderFlowApi,
  qltyWtIngredientAirSettlingOrderFlowApi,
  recMaterialApi,
  repairWorkOrderApi,
  retMaterialApi,
  returnRecApi,
  scrapOrderApi,
  splitAssembleApi,
  transferOrderApi,
  useNoticeOrderFlowApi,
} from "@/api/system/flow";
import type { IApprover, IApproverObjArr, IFlowObj, IUserItem } from "@/api/system/types";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
// 引入获取部门列表以及人员列表的hooks
import { deptListHooks } from "@/hooks";
// 获取userStore中的数据
import { useUserStoreHook } from "@/store/modules/user";
import FlowTitle from "./components/FlowTitle.vue";
import FlowTree from "./components/FlowTree.vue";
import zoom from "./components/zoom.vue";

const userStore = useUserStoreHook();

defineOptions({
  name: "SetFlow",
});

interface IApproverType {
  user_id: number;
  dept_ids: number[];
}

enum ETtile {
  "设置审批人" = 1,
  "设置抄送人",
  "设置仓库确认人",
  "设置多个审批人",
}

const { departmentList } = deptListHooks();
// const { userList } = userListHooks();
const state = reactive({
  flowType: 1, //流程组件是否显示设置仓库员:  1不显示 2显示
  flowList: {} as IFlowObj, //
  auditDrawer: false, //设置审核人抽屉状态
  formData: {
    keyword: "",
    dept_id: undefined as FormNumType, //部门id
    type: "purchase_order",
  },
  approverForList: [] as any[], //通用接口返回设置的审核人列表
  copyForList: [] as IApprover[], //通用接口返回设置的抄送人列表
  warehouse: [] as IApprover[], //通用接口返回设置的仓库人列表
  dialogKeyValue: "", //弹窗的搜索关键字
  selectApprover: [] as number[], //质量系统-选择的审核人id列表
  selectCopy: [] as number[], //选择的抄送人id列表
  selectDrawerCopy: [] as number[], //弹窗勾选的抄送人id列表/仓库确认人id列表
  addBtnIndex: NaN,
  selectWarehouse: [] as number[], //选择的仓库人id列表
  flowLoading: false,
  drawerType: 1, //1是审核人弹窗, 2是抄送人弹窗,3是仓库确认人弹窗 4是设置多个审核人弹窗
  maxNum: 20, //最大多选人数
  page: 1,
  size: 10,
  total: 0,
  pageUserList: [] as IUserItem[], //用户列表分页数据
  userList: [] as IUserItem[], //用户列表总数据
  ApproverList: [] as IApproverType[], //传递的审核人数组,user_id,部门数组
  zoomValue: 100, //缩放大小
  drawerLoading: false, //抽屉表格加载状态
  disableList: [] as number[], // 控制抽屉表格哪些禁止选择,动态变化的
  diasbleListClone: [] as number[], //控制抽屉表格哪些禁止选择的原始数据,根据接口返回的
  selectDrawerItem: [] as IUserItem[], //当前选择中的人员数组
  selectApproverCopy: [] as IApproverObjArr[], //质量系统-需要传递给接口的审批人数组
});
const {
  flowList,
  auditDrawer,
  formData,
  approverForList,
  copyForList,
  flowType,
  selectCopy,
  selectApprover,
  selectDrawerCopy,
  addBtnIndex,
  selectWarehouse,
  warehouse,
  flowLoading,
  drawerType,
  maxNum,
  page,
  size,
  total,
  pageUserList,
  userList,
  ApproverList,
  zoomValue,
  drawerLoading,
  disableList,
  diasbleListClone,
  selectDrawerItem,
  selectApproverCopy,
} = toRefs(state);
const activeName = ref("purchase_order");
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const formRef = ref<FormInstance>();

const currentApprove_index = ref(NaN);
const disableDept = ref(false);

// 部门级联选择器的配置
const selectProps = {
  // 显示方式
  expandTrigger: "hover" as const,
  emitPath: false,
  value: "id",
  label: "name",
  children: "_children",
  checkStrictly: true,
  multiple: true,
};

function removeTag(val: any, row: IUserItem) {
  console.log("val", val);
  console.log("row", row);
  // console.log("typeof", typeof val);
  if (val == row.dept_id) {
    ElMessage.warning("默认部门不可删除");
    row = Object.assign(row, { depts: [val, ...row.depts!] });
    // nextTick(() => {
    //   row.depts!.unshift(val);
    //   console.log(row.depts);
    // });
  }
}

// 缩放组件触发事件
function handleZoom(val: number) {
  // console.log("val", val);
  zoomValue.value = val;
}

function setPage() {
  //userList为全部数据，pageUserList是目前表格绑定的数据
  pageUserList.value = userList.value.slice((page.value - 1) * size.value, page.value * size.value);
  // console.log("pageUserList.value", pageUserList.value);
  total.value = userList.value.length;
}

// 分页触发事件
const handleQuery = () => {
  setPage();
};

// 弹窗点击查询
const handleSearch = async () => {
  await getUserList();

  if (drawerType.value != 1) {
    setSelected();
  }
};
// 弹窗点击重置
const handleReset = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  await getUserList();

  if (drawerType.value != 1) {
    setSelected();
  }
};

const getUserList = () => {
  return new Promise((resolve, reject) => {
    drawerLoading.value = true;
    let data = formData.value;
    // getUserListApi(data)
    getUserDeptListApi(data)
      .then((result) => {
        userList.value = result.data.list;
        userList.value.forEach((item) => {
          if (disableList.value.includes(item.id)) {
            item.disable = true;
          }
        });
        setPage();
        resolve(result.data.list);
        drawerLoading.value = false;
      })
      .catch((error) => {
        drawerLoading.value = false;
        reject(error);
      });
  });
};

/** 是否第一次加载数据 */
const isFirstLoad = ref(false);

const getData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载",
    background: "rgba(0, 0, 0, 0.1)",
  });
  flowLoading.value = true;

  try {
    const result = await getFlowInfoApi();
    console.log("getdata");
    let list = result.data.list;
    flowList.value = list;
    if (!isFirstLoad.value) {
      let listArr = Object.keys(list);
      activeName.value = listArr[0];
      isFirstLoad.value = true;
    }

    console.log("activeName.value", activeName.value);

    if (list[activeName.value]) {
      let data = list[activeName.value];
      console.log("data", data);

      approverForList.value = data.approver ?? [];
      copyForList.value = data.copy ?? [];
      ApproverList.value = data.approver.map((item) => {
        return {
          user_id: item.id,
          dept_ids: item.dept_ids,
        };
      });
      if (userStore.module_type === 3) {
        selectApproverCopy.value = approverForList.value.map((item) => {
          return item.map((subitem: IApprover) => {
            return {
              user_id: subitem.id,
              dept_ids: toRaw(subitem.dept_ids),
            };
          });
        });
        console.log("selectApproverCopy.value ", selectApproverCopy.value);
      }

      if (data.approver) {
        diasbleListClone.value = data.approver.map((item) => {
          return item.id;
        });
        disableList.value = [...diasbleListClone.value];
      }

      if (data.copy) {
        selectCopy.value = data.copy.map((item) => {
          return item.id;
        });
      }

      warehouse.value = data.warehouse ?? [];
      if (data.warehouse) {
        selectWarehouse.value = data.warehouse.map((item) => {
          return item.id;
        });
      }
    }
    loadingInstance.close();
    flowLoading.value = false;
    console.log(result.data.list[activeName.value]);
  } catch (error) {
    loadingInstance.close();
    flowLoading.value = false;
  }
};

// 点击切换tabs
const handleClick = (name: TabPaneName) => {
  console.log("name", name);
  activeName.value = name as string;
  formData.value.type = name as string;
  // 重置一下数据
  approverForList.value = [];
  copyForList.value = [];
  warehouse.value = [];
  selectApprover.value = [];
  selectCopy.value = [];
  selectDrawerCopy.value = [];
  selectWarehouse.value = [];
  auditDrawer.value = false;
  ApproverList.value = [];
  disableList.value = [];
  diasbleListClone.value = [];
  currentApprove_index.value = NaN;
  disableDept.value = false;
  formData.value.dept_id = undefined;
  getData();
};
// 子组件触发的点击按钮事件
const handleAdd = async (index: number, id: number) => {
  console.log("点击加号添加审核人", index);
  console.log("点击加号的id", id);
  console.log("disableList.value", disableList.value);
  drawerType.value = 1;
  auditDrawer.value = true;
  addBtnIndex.value = index;
  if (id) {
    disableList.value = diasbleListClone.value.filter((item) => {
      return item != id;
    });
    console.log("disableList.value", disableList.value);
  }
  await getUserList();
};

// 审核人弹窗点击选择
const cellSelect = (row: IUserItem) => {
  console.log("点击选择审核人", row);
  let indexStatus = isNaN(addBtnIndex.value);
  console.log(indexStatus);
  if (indexStatus) {
    ApproverList.value.unshift({
      user_id: row.id,
      dept_ids: [...(row.depts as number[])],
    });
    console.log("ApproverList.value", ApproverList.value);
    // return
  } else {
    ApproverList.value[addBtnIndex.value] = {
      user_id: row.id,
      dept_ids: [...(row.depts as number[])],
    };
    console.log("ApproverList.value", ApproverList.value);
    // return
  }
  console.log("ApproverList.value", ApproverList.value);
  sendUserSet();
};

// 子组件点击删除审核人
const handleDel = (id: number) => {
  console.log("id", id);
  console.log("点击删除审核人");
  ElMessageBox.confirm(`确认删除该审核人吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      console.log("点击了 确定删除");

      let arr = ApproverList.value.filter((item) => {
        return item.user_id != id;
      });
      ApproverList.value = arr;
      sendUserSet();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 子组件点击设置抄送人触发事件
const handleCopyFor = async () => {
  drawerType.value = 2;
  auditDrawer.value = true;
  await getUserList();
  setSelected();
};

// 子组件 点击设置仓库确认人弹窗触发事件
const handleWarehouse = async () => {
  drawerType.value = 3;
  auditDrawer.value = true;
  await getUserList();
  setSelected();
};
// 质量管理系统时,  子组件 点击设置审核人触发事件
async function handleMultiSet(index: number) {
  console.log("🚀 ~ handleMultiSet ~ index:", index);
  drawerType.value = 4;
  currentApprove_index.value = index;
  formData.value.dept_id = undefined;
  disableDept.value = false;
  if (!isNaN(index) && index < approverForList.value.length) {
    selectApprover.value = approverForList.value[index].map((item: IApprover) => {
      return item.id;
    });

    let dept_id = approverForList.value[index][0]?.dept_id;
    console.log("🚀 ~ handleMultiSet ~  dept_id :", dept_id);
    formData.value.dept_id = dept_id;
    disableDept.value = true;
  }

  // console.log(" selectApprover.value", selectApprover.value);
  auditDrawer.value = true;
  await getUserList();
  setSelected();
}

//设置初始化勾选的人
const setSelected = () => {
  let arr: number[] = [];
  // 判断是设置抄送人 还是仓库确认人
  if (drawerType.value === 2) {
    arr = selectCopy.value;
  } else if (drawerType.value === 3) {
    arr = selectWarehouse.value;
  } else if (drawerType.value === 4) {
    arr = selectApprover.value;
  }
  // let arr = drawerType.value == 2 ? selectCopy.value : selectWarehouse.value;
  //
  selectDrawerCopy.value = [...arr];
  let list = userList.value.filter((item, index) => {
    return arr.some((newitem) => {
      return newitem == item.id;
    });
  });

  nextTick(() => {
    if (list.length > 0) {
      list.forEach((row) => {
        // @ts-expect-error
        multipleTableRef.value!.toggleRowSelection(row, undefined);
      });
    } else {
      multipleTableRef.value!.clearSelection();
    }

    // console.log("selectDrawerCopy.value", selectDrawerCopy.value);
    // console.log("selectCopy.value", selectCopy.value);
  });
};

// 弹窗确认选择
const drawerConfirm = () => {
  if (drawerType.value == 2) {
    // if (selectDrawerCopy.value.length > maxNum.value) {
    //   ElMessage.warning(`最多只能设置${maxNum.value}人`);
    //   return;
    // }
    selectCopy.value = selectDrawerCopy.value;
    sendUserSet();
  } else if (drawerType.value == 3) {
    selectWarehouse.value = selectDrawerCopy.value;
    sendUserSet();
  } else if (drawerType.value == 4) {
    selectApprover.value = selectDrawerCopy.value;
    let index = isNaN(currentApprove_index.value) ? 0 : currentApprove_index.value;
    let arr = selectDrawerItem.value.map((item) => {
      return {
        user_id: item.id,
        dept_ids: toRaw(item.depts) || [],
      };
    });
    if (isNaN(currentApprove_index.value)) {
      selectApproverCopy.value.unshift(arr);
    } else {
      selectApproverCopy.value[index] = arr;
    }
    console.log(
      "🚀 ~ selectApproverCopy.value[currentApprove_index.value]=selectDrawerItem.value.map ~  selectApproverCopy.value:",
      selectApproverCopy.value,
    );
    // return;
    sendUserSet();
  }
};

// const toggleSelection = (row: any) => {
//   //@ts-expect-error
//   multipleTableRef.value!.toggleRowSelection(row, undefined);
//   if (selectDrawerCopy.value.includes(row.id)) {
//     selectDrawerCopy.value = selectDrawerCopy.value.filter((item) => {
//       return item != row.id;
//     });
//   } else {
//     selectDrawerCopy.value.push(row.id);
//   }
// };

const toggleSelection = (row: any) => {
  //@ts-expect-error
  multipleTableRef.value!.toggleRowSelection(row, undefined);
};

function changeSelect(selection: IUserItem[]) {
  selectDrawerCopy.value = selection.map((item) => {
    return item.id;
  });
  selectDrawerItem.value = selection;
}

// 手动勾选数据行发生的事件
// const tableCellSelect = (selection:any, row: any) => {
//   if (selectDrawerCopy.value.includes(row.id)) {
//     selectDrawerCopy.value = selectDrawerCopy.value.filter((item) => {
//       return item != row.id;
//     });
//   } else {
//     selectDrawerCopy.value.push(row.id);
//   }
//   console.log(selectDrawerCopy.value);
// };

// const tableAllSelect = (selection: any) => {
//   selectDrawerCopy.value = selection.map((element: any) => {
//     return element.id;
//   });
//   console.log("selectDrawerCopy.value", selectDrawerCopy.value);
// };

const setSelectable = (row: any) => {
  //  return true
  if (row.warehouse_name.length === 0 && drawerType.value == 3) {
    return false;
  }
  return true;
};

// 抽屉关闭的回调
const drawerClose = () => {
  formRef.value?.resetFields();
  // selectDrawerCopy.value = [];
  multipleTableRef.value?.clearSelection();
  page.value = 1;
  size.value = 10;
  currentApprove_index.value = NaN;
  disableDept.value = false;
  formData.value.dept_id = undefined;
  disableList.value = [...diasbleListClone.value];
};

// 抽屉的标题
const drawerTitle = computed(() => {
  return ETtile[drawerType.value];
});

//
const sendUserSet = async () => {
  let data = {
    approver: ApproverList.value,
    copy: selectCopy.value,
  };

  console.log("data.approver", data.approver);
  // return;
  let map = new Map();
  map.set("purchase_order", function () {
    // 设置采购单
    return new Promise((resolve, reject) => {
      purchaseOrderApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("purchase_ret", function () {
    // 设置采购退货单
    return new Promise((resolve, reject) => {
      purchaseRetApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("pro_replacement", function () {
    // 设置采购换货单
    return new Promise((resolve, reject) => {
      proReplacementApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("purchase_rec", function () {
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    // 设置采购入库单
    return new Promise((resolve, reject) => {
      purchaseRecApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("purchase_otr_in", function () {
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    // 设置其他入库单
    return new Promise((resolve, reject) => {
      purchaseOtrInApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("return_rec", function () {
    // 设置退货出库单
    return new Promise((resolve, reject) => {
      returnRecApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("inventory_list", function () {
    // 设置盘点单
    return new Promise((resolve, reject) => {
      inventoryListApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("transfer_order", function () {
    // 设置调拨单
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    return new Promise((resolve, reject) => {
      transferOrderApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("scrap_order", function () {
    // 设置报废单
    return new Promise((resolve, reject) => {
      scrapOrderApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("rec_material", function () {
    // 设置领料出库单
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    return new Promise((resolve, reject) => {
      recMaterialApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("ret_material", function () {
    // 设置退料入库单
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    return new Promise((resolve, reject) => {
      retMaterialApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("split_assemble", function () {
    // 设置拆装单
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    return new Promise((resolve, reject) => {
      splitAssembleApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("inv_ret_list", function () {
    let data = {
      approver: ApproverList.value,
      copy: selectCopy.value,
      warehouse: selectWarehouse.value,
    };
    // 设置退库清单
    return new Promise((resolve, reject) => {
      invRetListApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("repair_work_order", function () {
    // 设置维修工单
    return new Promise((resolve, reject) => {
      repairWorkOrderApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("maintain_work_order", function () {
    // 设置保养工单
    return new Promise((resolve, reject) => {
      maintainWorkOrderApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("inspection_records", function () {
    // 设置巡点检记录
    return new Promise((resolve, reject) => {
      inspectionRecordsApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  /* 安全模块->点检记录 */
  map.set("inspection_records_secure", function () {
    //安全模块-设置巡点检记录
    return new Promise((resolve, reject) => {
      inspectionRecordsSecureFlowApi(data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  /** 设置品质系统的流程所使用的数据  */
  let quality_data = {
    approver: selectApproverCopy.value,
    copy: selectCopy.value,
  };

  map.set("materials_use_notice_order", function () {
    // 设置原材料使用通知单
    return new Promise((resolve, reject) => {
      useNoticeOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("empty_quality_order", function () {
    // 设置战马空罐检验报告
    return new Promise((resolve, reject) => {
      emptyQualityOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("empty_purchase_order", function () {
    // 设置空罐进货检验报告
    return new Promise((resolve, reject) => {
      emptyPurchaseOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("label_recog_order", function () {
    // 设置原料标签标识报告
    return new Promise((resolve, reject) => {
      labelRecogOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("paper_restock_order", function () {
    // 设置纸皮进货验报告
    return new Promise((resolve, reject) => {
      paperRestockOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_hotshrink_order", function () {
    // 设置热缩膜检验报告单
    return new Promise((resolve, reject) => {
      qltyHotshrinkOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_cap_order", function () {
    // 设置顶盖/底盖审批流
    return new Promise((resolve, reject) => {
      qltyCapOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_innercoating_order", function () {
    // 内涂膜审批流程
    return new Promise((resolve, reject) => {
      qltyInnercoatingOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_empty_pot_order", function () {
    // 空罐卷封检验报告
    return new Promise((resolve, reject) => {
      qltyEmptyPotOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("liquid_sugar_order", function () {
    // 液体糖检验报告审批流程
    return new Promise((resolve, reject) => {
      qltyLiquidSugarOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("product_sugar_order", function () {
    // 成品糖酸检测报告审批流程
    return new Promise((resolve, reject) => {
      qltyProductSugarOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("physical_mmrb_order", function () {
    // 设置-理化及微生物检验报告审批流程
    return new Promise((resolve, reject) => {
      qltyPhysicalMmrbOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("ph_composition_analysis_order", function () {
    // 设置-pH和成分分析检验单报告审批流程
    return new Promise((resolve, reject) => {
      qltyPhCompositionAnalysisOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("product_roll_inspection_order", function () {
    // 设置-成品卷封检验报告审批流程
    return new Promise((resolve, reject) => {
      qltyProductRollInspectionOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("product_label_identify_order", function () {
    // 设置-成品标签标识报告审批流程
    return new Promise((resolve, reject) => {
      qltyProductLabelIdentifyOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("product_qr_code_confirm_order", function () {
    // 设置-成品二维码确认单审批流程
    return new Promise((resolve, reject) => {
      qltyProductQrCodeConfirmOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("red_bull_product_order", function () {
    // 设置-红牛成品检验结果审批流程
    return new Promise((resolve, reject) => {
      qltyProSetRedBullProductOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("warhorse_product_order", function () {
    // 设置-战马成品检验结果审批流程
    return new Promise((resolve, reject) => {
      qltyWarhorseProductOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("product_shipping_notice_order", function () {
    // 设置-成品发货通知单审批流程
    return new Promise((resolve, reject) => {
      qltyProductShippingNoticeOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_productquantify_order", function () {
    // 设置-定量测定审批流程
    return new Promise((resolve, reject) => {
      qltyProductquantifyOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_quantify_order", function () {
    // 设置-产品定量检测审批流程
    return new Promise((resolve, reject) => {
      qltyQuantifyOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_endproduct_order", function () {
    // 设置-成品检测单据审批流程
    return new Promise((resolve, reject) => {
      qltyEndproductOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_wip_order", function () {
    // 设置-半成品审批流程
    return new Promise((resolve, reject) => {
      qltyWipOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_sample_order", function () {
    // 设置-样品检测报告审批流程
    return new Promise((resolve, reject) => {
      qltySampleOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_operation_order", function () {
    // 设置-工序控制审批流程
    return new Promise((resolve, reject) => {
      qltyOperationOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_boxqr_order", function () {
    // 设置-外箱二维码检验报告
    return new Promise((resolve, reject) => {
      qltyBoxqrOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("essence_entering_order", function () {
    // 设置-香精入厂检测记录
    return new Promise((resolve, reject) => {
      qltyEssenceEnteringOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_cipmicrobe_order", function () {
    // 设置-CIP微生物检验报告
    return new Promise((resolve, reject) => {
      qltyCipmicrobeOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_watermicrobe_order", function () {
    // 设置-水处理微生物检验报告
    return new Promise((resolve, reject) => {
      qltyWatermicrobeOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_scale_order", function () {
    // 设置-天平校准记录
    return new Promise((resolve, reject) => {
      qltyScaleOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_samplestock_order", function () {
    // 设置-标准样罐入库记录
    return new Promise((resolve, reject) => {
      qltySamplestockOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_incubator_order", function () {
    // 设置-恒温培养箱使用记录
    return new Promise((resolve, reject) => {
      qltyIncubatorOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_incubator_order", function () {
    // 设置-恒温培养箱使用记录
    return new Promise((resolve, reject) => {
      qltyIncubatorOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_empty_can_photo_order", function () {
    // 设置-空罐照相设备验证表审批流程
    return new Promise((resolve, reject) => {
      qltyEmptyCanPhotoOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_fill_seal_machine_clean_order", function () {
    // 设置-灌装封口机清洗记录审批流程
    return new Promise((resolve, reject) => {
      qltyFillSealMachineCleanOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_fill_room_air_settling_order", function () {
    // 设置-灌装间空气沉降检测审批流程
    return new Promise((resolve, reject) => {
      qltyFillRoomAirSettlingOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_wt_ingredient_air_settling_order", function () {
    // 设置-称配料空气沉降检测审批流程
    return new Promise((resolve, reject) => {
      qltyWtIngredientAirSettlingOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_laboratory_air_settling_order", function () {
    // 设置-化验室空气沉降检测审批流程
    return new Promise((resolve, reject) => {
      qltyLaboratoryAirSettlingOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  map.set("qlty_clean_room_suspended_particle_order", function () {
    // 设置-洁净间悬浮粒子检测审批流程
    return new Promise((resolve, reject) => {
      qltyCleanRoomSuspendedParticleOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_hand_application_order", function () {
    // 设置-手部涂抹实验检验审批流程
    return new Promise((resolve, reject) => {
      qltyHandApplicationOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_ingredient_clean_room_detection_order", function () {
    // 设置-配料洁净间浮游菌检测审批流程
    return new Promise((resolve, reject) => {
      qltyIngredientCleanRoomDetectionOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  map.set("qlty_laboratory_air_bacteria_detection_order", function () {
    // 设置-化验室空气浮游菌检测审批流程
    return new Promise((resolve, reject) => {
      qltyLaboratoryAirBacteriaDetectionOrderFlowApi(quality_data)
        .then((result) => {
          resolve(result.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  let fn = map.get(activeName.value);
  let msg = await fn();
  ElMessage.success(msg);
  auditDrawer.value = false;
  getData();
};

onActivated(async () => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <span class="block text-gray-500 text-[14px] mb-[20px]">
      注：由审核人提交的流程自动完成审批
    </span>
    <flow-title></flow-title>
    <el-tabs v-model="activeName" class="tabs-container" @tab-change="handleClick">
      <el-tab-pane :label="item.note" :name="key" v-for="(item, key) in flowList" :key="key">
        <flow-tree
          v-if="!flowLoading"
          @about-add="handleAdd"
          @about-del="handleDel"
          @about-copy-for="handleCopyFor"
          @about-warehouse="handleWarehouse"
          @about-multi-set="handleMultiSet($event)"
          :warehouse="warehouse"
          :flowType="item.is_have_wh ? 2 : 1"
          :approver-list="approverForList"
          :copy-list="copyForList"
          :nowVal="zoomValue"
        ></flow-tree>
      </el-tab-pane>
      <zoom @zoom="handleZoom"></zoom>
    </el-tabs>
    <!-- 抽屉弹窗 -->
    <el-drawer v-model="auditDrawer" direction="rtl" size="85%" @close="drawerClose">
      <template #header>
        <span class="font-bold text-[18px]">{{ drawerTitle }}</span>
      </template>
      <template #default>
        <div class="search">
          <el-form :model="formData" ref="formRef" :inline="true">
            <el-form-item label="所属部门" prop="dept_id">
              <dept-select
                :department-list="departmentList"
                v-model="formData.dept_id"
                :disable="disableDept"
              ></dept-select>
            </el-form-item>
            <el-form-item label="姓名" prop="keyword">
              <el-input v-model="formData.keyword" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <template #icon>
                  <i-ep-Search></i-ep-Search>
                </template>
                查询
              </el-button>
              <el-button @click="handleReset(formRef)">
                <template #icon>
                  <i-ep-Refresh></i-ep-Refresh>
                </template>
                重置
              </el-button>
            </el-form-item>
          </el-form>
          <div class="text-[14px] text-gray-400 mb-[20px]">
            <!-- <span v-if="drawerType == 1">单选模式: 点击选择即为设置该项人员为审核人</span> -->
            <div v-if="drawerType == 1">
              <span>
                单选模式: 点击 选择并保存按钮 即为设置该项人员为审核人,且同时设置可审核部门
              </span>
            </div>
            <span v-else-if="drawerType == 2">
              多选模式: 勾选人员后点击下方确认选择即为设置抄送人
            </span>
            <span v-else-if="drawerType == 3">
              多选模式: 勾选人员后点击下方确认选择即为设置仓库确认人
            </span>
            <span v-else-if="drawerType == 4">
              多选模式: 勾选人员后点击下方确认选择即为设置审核人
            </span>
          </div>
          <template v-if="drawerType == 1">
            <el-table :data="pageUserList" border stripe v-loading="drawerLoading">
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="user" label="手机号/账号" />
              <el-table-column prop="dept_name" label="所属部门" />
              <el-table-column prop="warehouse_name" label="仓库" />
              <el-table-column label="可审批部门(可多选)" min-width="300">
                <template #default="scope">
                  <el-cascader
                    v-model="scope.row.depts"
                    :options="departmentList"
                    :props="selectProps"
                    :show-all-levels="false"
                    filterable
                    @remove-tag="removeTag($event, scope.row)"
                    :disabled="scope.row.disable"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="success"
                    @click="cellSelect(scope.row)"
                    :disabled="scope.row.disable"
                  >
                    选择并保存
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--  @select="tableCellSelect"
              @select-all="tableAllSelect" -->
          <template v-else>
            <el-table
              :data="pageUserList"
              border
              stripe
              ref="multipleTableRef"
              @selection-change="changeSelect"
              v-loading="drawerLoading"
              row-key="id"
            >
              <!--  @selection-change="handleSelectionChange" -->
              <el-table-column
                type="selection"
                width="55"
                reserve-selection
                :selectable="setSelectable"
              />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="user" label="手机号/账号" />
              <el-table-column prop="dept_name" label="所属部门" />
              <el-table-column prop="warehouse_name" label="仓库">
                <template #default="scope">
                  <span v-if="drawerType != 3">{{ scope.row.warehouse_name.join(",") }}</span>
                  <span v-else>
                    <span v-if="scope.row.warehouse_name.length">
                      {{ scope.row.warehouse_name.join(",") }}
                    </span>
                    <span v-else class="text-gray-400">该账号未设置仓库,不可选择</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="success"
                    :disabled="drawerType == 3 && !scope.row.warehouse_name.length"
                    @click="toggleSelection(scope.row)"
                  >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <pagination
          class="mt-[20px]"
          v-if="total > 0"
          v-model:total="total"
          v-model:page="page"
          v-model:limit="size"
          :pageSizes="[10, 20]"
          @pagination="handleQuery"
        />
      </template>

      <template #footer>
        <div class="flex items-start">
          <el-button
            v-if="drawerType != 1"
            @click="drawerConfirm"
            size="large"
            type="primary"
            class="w-[100px]"
          >
            确认选择
          </el-button>
          <el-button
            @click="auditDrawer = false"
            type="primary"
            plain
            size="large"
            class="w-[100px]"
          >
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  position: relative;
}
.tabs-container {
  :deep(.el-tabs__content) {
    min-height: calc(100vh - 240px);
    max-height: calc(100vh - 220px);
    overflow: auto;
    overflow-x: hidden;
  }
}
.add-node-btn-box {
  width: 240px;
  height: 70px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 10px;
  box-sizing: border-box;
  // 竖线
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: auto;
    width: 2px;
    // background-color: #cacaca;
    background-color: var(--el-color-info-light-5);
  }
  // 向下箭头
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 0;
    height: 4px;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: #cacaca transparent transparent;
    background: var(--el-fill-color-blank);
  }
}
/* +号按钮盒子的样式结束 */

:deep(.el-table__body .el-checkbox__inner) {
  width: 20px;
  height: 20px;
}

/* 如果需要调整选中后勾选框里的对勾大小 */
:deep(.el-table__body .el-checkbox__input.is-checked .el-checkbox__inner::after) {
  left: 7px;
  top: 4px;
}
</style>
