<script setup lang="ts">
/* 本组件为: 指定流程组件 */
// 引入 element组件的类型
import { type FormInstance } from "element-plus";
// 引入部门列表API,人员列表API,领料流程详情API
import { departmentListApi, flowGetSup, getUserListApi } from "@/api/common/index";
// 引入部门类型
import { IDeptItem } from "@/api/common/types";
import { IUserItem } from "@/api/system/types";
// 引入专属hooks
import { useAssginFlow } from "../utils/flow";

export interface API {
  warehouse_id_list: number[];
  getFlowGetSup: () => void;
}

enum ETtile {
  "指定审批人" = 1,
  "指定领取人",
}

type receiverObjType = { id: number; name: string; dept_name: string };

const { approverColumns, receiverColumns } = useAssginFlow();

interface Props {
  /** 单据id */
  id: number;
  /** 商品类别中不重复的仓库id */
  // warehouseIds: number[];
  warehouseIds?: any[];
  /** 类型: 默认1 为新建, 2为预览,3为详情,4列表 */
  type?: number;
  /** 单据状态 */
  status?: number;
  arUname?: any[];
  apUname?: string;
  /** 是否强制完结；0：否；1：是；  */
  is_force_receive?: number;
}

const props = withDefaults(defineProps<Props>(), {
  /** 单据id */
  id: 0,
  warehouseIds: () => [],
  type: 1,
  status: 0,
  is_force_receive: 0,
});
const emits = defineEmits(["confirmRevicer", "confirmApprover", "allWarehouseId"]);

const isForce = ref(props.is_force_receive);

/** 抽屉弹窗开关 */
const drawerVisible = ref(false);
/** 记录弹窗类型 1: 为选择指定审批人 2为指定领取人-多选 */
const drawerType = ref(1);
/** 弹窗表单的ref */
const formRef = ref<FormInstance>();
const tableRef = ref();
/** 弹窗表单的参数 */
const formData = ref({
  keyword: "",
  dept_id: 0, //部门id
});
/** 部门列表数据 */
const departmentList = ref<IDeptItem[]>([]);
/** 所有人员列表数据 */
const userList = ref<IUserItem[]>([]);
/** 分页人员列表数据 */
const pageUserList = ref<IUserItem[]>([]);
/** 保存选择的指定领取人的id和名称 */
const selectReceiver = ref<receiverObjType[]>([]);
/** 保存选择的指定审批人的id和名称 */
const selectApprover = ref<receiverObjType[]>([]);

const page = ref(1);
const size = ref(10);
const total = ref(0);

/** 抽屉表格加载状态 */
const drawerLoading = ref(false);
/** 限制领取人最大数量 */
const maxNum = ref(10);

/** 记录审批人数据 */
const approverList = ref<any[]>([]);
/** 记录抄送人数据 */
const copyList = ref<any[]>([]);

/** 记录仓库确认人数据 */
const warehouseList = ref<any[]>([]);

/** 记录指定审批人数据 */
const final_approver = ref<any[]>([]);
/** 记录领取人数据 */
const appoint_receiver = ref<any[]>([]);
/** 记录默认领取人数据 */
const defaultReceiver = ref<any>();

/** 记录所有仓库确认人的所属仓库id */
const warehouse_id_list = ref<number[]>([]);

const state = reactive({
  final_approver_status: 0, //指定审批状态 0：未处理（灰色）、1：已审批或已确认（蓝色）2：进行中（橙色）
  receive_status: 0, // 领取人确认状态：同上；
  warehouse_status: 0, // 仓库确认状态：同上；
  copy_status: 0, // 抄送人状态：同上；
  loadingStatus: false,
});
const { final_approver_status, receive_status, warehouse_status, copy_status, loadingStatus } =
  toRefs(state);

defineExpose({
  warehouse_id_list: warehouse_id_list,
  getFlowGetSup: getFlowGetSup,
});

/** 抽屉的标题 */
const drawerTitle = computed(() => {
  return ETtile[drawerType.value];
});

// 过滤仓库确认人数据
// const filterWarehouseList = computed(() => {
//   return warehouseList.value.filter((item) => {
//     return props.warehouseIds.some((id) => {
//       return item.warehouse_id.includes(id);
//     });
//   });
// });

/** 过滤仓库确认人数据 */
const filterWarehouseList = computed(() => {
  // console.log("props.warehouseIds", props.warehouseIds);
  let arr = warehouseList.value.filter((item) => {
    return props.warehouseIds.some((el) => {
      return item.warehouse_id.includes(el.id);
    });
  });

  return arr;
});
/** 未设置仓库确认人的数据 */
const noSetWarehouse = computed(() => {
  let list = warehouse_id_list.value;

  // console.log("list", list);
  let arr_res: any[] = [];
  props.warehouseIds.forEach((item) => {
    if (list.indexOf(item.id) == -1 && item.id) {
      arr_res.push({
        noSelect: true,
        warehouse_id: item.id,
        warehouse_name: item.warehouse_name,
      });
    }
  });

  return arr_res;
});

const checkOrderStatus = computed(() => {
  let statusList = [0, 4, 6];
  let status = Number(props.status);
  return statusList.includes(status) ? true : false;
});

// 勾选提示
const checkHint = computed(() => {
  if (selectReceiver.value.length > 0) {
    let username = selectReceiver.value.map((item) => item.name).join(",");
    return `当前已选择${selectReceiver.value.length}人,领取人：${username}`;
  } else {
    return `当前未选择领取人`;
  }
});

const checkApproveStatus = computed(() => {
  // let status = props.status != 0;
  let status = !checkOrderStatus.value;
  let len = approverList.value.length;
  return len === 0 && status ? true : false;
});

const assignApproveStatus = computed(() => {
  let assignLen = final_approver.value.length;

  let len = approverList.value.length;

  // let status = props.status != 0;
  let status = !checkOrderStatus.value;

  if (status) {
    if (assignLen === 0 && len === 0) return true;
    if (assignLen === 0 && len > 0) {
      let res = approverList.value.every((item) => {
        return item.approver_status == 1;
      });

      return res;
    }
    return false;
  }

  return false;
});

/** 动态返回 title类名 */
const dynamicTitleClass = computed(() => {
  return (status: number) => {
    return status == 1 ? ["flow-text-primary"] : [];
  };
});

/** 动态返回 line的类名 */
const dynamicLineClass = computed(() => {
  return (status: number) => {
    if (status == 1) {
      return ["flow-line-primary"];
    } else if (status == 2) {
      return ["flow-line-orange"];
    } else {
      return [];
    }
  };
});

/** 动态返回 结束的类名 */
const dynamicOverClass = computed(() => {
  return (status: number) => {
    if (status == 3) {
      return isForce.value == 1 ? ["flow-text-orange"] : ["flow-text-success"];
    } else {
      return [];
    }
  };
});
/* 动态返回的 结束的描述 */
const dynamicOverDesc = computed(() => {
  return isForce.value == 1 ? "完结结束" : "领料已完成";
});

// 点击指定审批人/点击指定领取人
const showApproverDrawer = async (type: number) => {
  drawerType.value = type;
  drawerVisible.value = true;
  getUserList();
};
// 抽屉弹窗单元格点击确认选择
const cellSelect = (row: IUserItem) => {
  selectApprover.value = [
    {
      id: row.id,
      name: row.name,
      dept_name: row.dept_name,
    },
  ];
  final_approver.value = selectApprover.value;
  drawerVisible.value = false;

  emits("confirmApprover", selectApprover.value);
};
// 点击清空指定审批人
const clearApprover = () => {
  selectApprover.value = [];
  final_approver.value = [];
  drawerVisible.value = false;
  emits("confirmApprover", []);
  ElMessage.success("已清空指定审批人");
};

// 抽屉弹窗页脚点击确认选择
const drawerConfirm = () => {
  if (selectReceiver.value.length > maxNum.value) {
    ElMessage.warning(`最多只能设置${maxNum.value}人`);
    return;
  }
  appoint_receiver.value = selectReceiver.value;
  drawerVisible.value = false;
  emits("confirmRevicer", selectReceiver.value);
};

// 弹窗点击查询
const handleSearch = async () => {
  // await getUserList();
  getUserList();
};
// 弹窗点击重置
const handleReset = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getUserList();
};

// 弹窗分页触发事件
const handleQuery = () => {
  setPage();
};

// 弹窗抽屉关闭的回调
const drawerClose = () => {
  formRef.value?.resetFields();
  if (tableRef.value) {
    let tableProxy = tableRef.value.getTableRef();
    tableProxy.clearSelection();
  }
  // selectReceiver.value = [];
  page.value = 1;
  size.value = 10;
};

// 点击选择按钮触发
const toggleSelection = (row: IUserItem) => {
  let tableProxy = tableRef.value.getTableRef();
  tableProxy!.toggleRowSelection(row, undefined);
  getSelectReceiver(row);
};
// 手动勾选数据行发生的事件
const tableCellSelect = (selection: any, row: IUserItem) => {
  getSelectReceiver(row);
};
function getSelectReceiver(row: IUserItem) {
  let findRes = selectReceiver.value.find((item) => {
    return item.id == row.id;
  });
  if (findRes) {
    selectReceiver.value = selectReceiver.value.filter((item) => {
      return item.id != row.id;
    });
  } else {
    selectReceiver.value.push({
      id: row.id,
      name: row.name,
      dept_name: row.dept_name,
    });
  }
  // console.log(selectReceiver.value);
}
// 勾选全部
const tableAllSelect = (selection: any) => {
  selectReceiver.value = selection.map((element: any) => {
    return {
      id: element.id,
      name: element.name,
      dept_name: element.dept_name,
    };
  });
  // console.log("selectReceiverId.value", selectReceiver.value);
};

// 获取部门列表
async function getDeptList() {
  const result = await departmentListApi();
  departmentList.value = result.data.list;
}
// 获取人员列表
async function getUserList() {
  drawerLoading.value = true;
  const result = await getUserListApi(formData.value);
  userList.value = result.data.list;
  setPage();
}
function setPage() {
  //userList为全部数据，pageUserList是目前表格绑定的数据
  pageUserList.value = userList.value.slice((page.value - 1) * size.value, page.value * size.value);

  if (drawerType.value == 2) {
    // 设置默认领取人为不可选状态
    pageUserList.value.forEach((item) => {
      if (item.id == defaultReceiver.value?.id) {
        // 如果是默认领取人，则设置为不可选状态
        item.disable = true;
      }
    });
  }
  total.value = userList.value.length;
  drawerLoading.value = false;
  if (drawerType.value == 2) setInitSelect();
}
let isConcat = false;
// 抽屉表格设置选中勾选的
function setInitSelect() {
  // 根据 接口返回的领取人数组 设置已勾选的领取人数据
  if (!isConcat) {
    let receiver_list = appoint_receiver.value.map((item) => {
      return {
        id: item.id,
        name: item.name,
        dept_name: item.dept_name,
      };
    });
    // console.log("🚀  ~ arr:", receiver_list);
    selectReceiver.value = selectReceiver.value.concat(receiver_list);
    // console.log("🚀 selectReceiver.value:", selectReceiver.value);
    isConcat = true;
  }

  // 获取已选中的id
  let arr = selectReceiver.value.map((item) => {
    return item.id;
  });

  let list = pageUserList.value.filter((item, index) => {
    return arr.includes(item.id);
  });

  if (list.length > 0) {
    list.forEach((row) => {
      let tableProxy = tableRef.value.getTableRef();
      tableProxy!.toggleRowSelection(row, true);
    });
  } else {
    let tableProxy = tableRef.value.getTableRef();
    tableProxy.clearSelection();
  }
}
/* 获取流程图详情 */
async function getFlowGetSup() {
  let id = props.id ? props.id : undefined;
  loadingStatus.value = true;
  const result = await flowGetSup({ id });

  approverList.value = result.data.approver;
  copyList.value = result.data.copy;
  warehouseList.value = result.data.warehouse;
  final_approver.value = result.data.final_approver;
  appoint_receiver.value = result.data.appoint_receiver;
  // 获取默认领取人信息,领取人数组第一个
  defaultReceiver.value = appoint_receiver.value[0];
  emits("confirmApprover", final_approver.value);
  emits("confirmRevicer", appoint_receiver.value);

  final_approver_status.value = result.data.final_approver_status;
  receive_status.value = result.data.receive_status;
  warehouse_status.value = result.data.warehouse_status;
  copy_status.value = result.data.copy_status;

  let list: number[] = [];
  warehouseList.value.forEach((item) => {
    item.warehouse_id.forEach((id: number) => {
      list.push(id);
    });
  });
  warehouse_id_list.value = [...new Set(list)];
  loadingStatus.value = false;
  // emits("allWarehouseId",warehouse_id_list.value)
}

watch(
  () => props.warehouseIds,
  (val) => {
    // console.log("warehouseIds", val);
  },
);

onMounted(() => {
  getDeptList();
  getFlowGetSup();
});
</script>

<template>
  <div class="flow-wrapper">
    <p class="flow-header">流程</p>
    <div class="flow-content" v-loading="loadingStatus">
      <div class="flow-item">
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-primary" v-if="!checkOrderStatus"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title" :class="dynamicTitleClass(status)">发起人9999</li>
          <li class="item-desc">制单人</li>
        </ul>
        <!-- <span class="line"></span> -->
        <span class="line" :class="!checkOrderStatus ? 'flow-line-primary' : ''"></span>
      </div>
      <!-- 遍历的审批人样式 -->
      <template v-if="approverList.length > 0">
        <div class="flow-item" v-for="(item, index) in approverList" :key="item.id">
          <span class="line" :class="dynamicLineClass(item.approver_status)"></span>
          <ul class="item-content">
            <i-ep-CircleCheck
              class="flow-icon-primary"
              v-if="item.approver_status"
            ></i-ep-CircleCheck>
            <li class="item-circle" v-else></li>
            <li class="item-title" :class="dynamicTitleClass(item.approver_status)">审批人</li>
            <li class="item-desc">{{ item.name + `【${item.dept_name}】` }}</li>
          </ul>
        </div>
      </template>
      <!-- 未设置审批人时的显示 -->
      <div class="flow-item" v-else>
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-primary" v-if="checkApproveStatus"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title">审批人</li>
          <li class="item-desc">未设置,自动跳过</li>
        </ul>
        <span class="line" :class="checkApproveStatus ? 'flow-line-primary' : ''"></span>
      </div>

      <!-- 指定审批人样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <!-- 新建编辑页面时,显示指定图标 -->
          <svg-icon
            v-if="type == 1"
            icon-class="add_personnel"
            size="30"
            class="cursor-pointer"
            @click="showApproverDrawer(1)"
          ></svg-icon>
          <!-- 预览页面时,不可选圆形 -->
          <li class="item-circle" v-else-if="type == 2"></li>
          <!-- 详情页面,列表页面时,判断状态 -->
          <template v-else>
            <i-ep-CircleCheck
              class="flow-icon-primary"
              v-if="final_approver_status || assignApproveStatus"
            ></i-ep-CircleCheck>
            <li class="item-circle" v-else></li>
          </template>

          <li class="item-title" :class="dynamicTitleClass(final_approver_status)">指定审批人</li>
          <!-- 如果type为2 是预览模式 则显示如下 -->
          <template v-if="type == 2">
            <li class="item-desc">{{ apUname || "未设置" }}</li>
          </template>
          <template v-else>
            <li class="item-desc" v-for="(item, index) in final_approver" :key="item.id">
              {{ item.name + `【${item.dept_name}】` }}
            </li>
            <li class="item-desc" v-if="final_approver.length === 0">未设置,自动跳过</li>
          </template>
        </ul>
        <span
          class="line"
          :class="
            (dynamicLineClass(final_approver_status),
            assignApproveStatus ? 'flow-line-primary' : '')
          "
        ></span>
      </div>
      <!-- 仓库确认人的样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <!-- <li class="item-circle"></li> -->
          <i-ep-CircleCheck
            class="flow-icon-primary"
            v-if="warehouse_status == 1"
          ></i-ep-CircleCheck>
          <li class="item-circle !bg-orange-400" v-else-if="warehouse_status == 2"></li>
          <li class="item-circle" v-else></li>

          <li class="item-title" :class="dynamicTitleClass(warehouse_status)">仓库确认人</li>
          <li class="item-desc" v-if="type == 4">
            <div class="desc-content" v-for="(item, index) in warehouseList" :key="item.id">
              <span class="desc-content-title">{{ item.warehouse_name }}：</span>
              <span>{{ item.name + `【${item.dept_name}】` }}</span>
            </div>
          </li>
          <li class="item-desc" v-else>
            <div class="desc-content" v-for="(item, index) in filterWarehouseList" :key="item.id">
              <span class="desc-content-title">{{ item.warehouse_name }}：</span>
              <span>{{ item.name + `【${item.dept_name}】` }}</span>
            </div>
            <template v-if="type == 1">
              <div class="desc-content" v-for="(item, index) in noSetWarehouse" :key="item.id">
                <span class="desc-content-title">{{ item.warehouse_name }}：</span>
                <span class="text-orange-500">未设置仓管员,请联系管理员添加</span>
              </div>
            </template>
          </li>
          <li
            class="item-desc"
            v-if="filterWarehouseList.length == 0 && noSetWarehouse.length == 0 && type == 1"
          >
            未选择商品
          </li>
        </ul>
        <span class="line" :class="dynamicLineClass(warehouse_status)"></span>
      </div>
      <!-- 指定领取人 -->
      <div class="flow-item">
        <ul class="item-content">
          <!-- 新建编辑页面时,显示指定图标 -->
          <svg-icon
            v-if="type == 1"
            icon-class="add_personnel"
            size="30"
            class="cursor-pointer"
            @click="showApproverDrawer(2)"
          ></svg-icon>
          <!-- 预览页面时,不可选圆形 -->
          <li class="item-circle" v-else-if="type == 2"></li>
          <!-- 详情页面,列表页面时,判断状态 -->
          <template v-else>
            <i-ep-CircleCheck
              class="flow-icon-primary"
              v-if="receive_status == 1"
            ></i-ep-CircleCheck>
            <li class="item-circle !bg-orange-400" v-else-if="receive_status == 2"></li>
            <li class="item-circle" v-else></li>
          </template>

          <li class="item-title" :class="dynamicTitleClass(receive_status)">指定领取人</li>
          <!-- 如果type为2 是预览模式 且id不存在 则显示如下 -->
          <template v-if="type == 2">
            <li class="item-desc" v-for="(item, index) in arUname" :key="index">
              {{ item.name + `【${item.dept_name}】` }} {{ index === 0 ? "(默认)" : "" }}
            </li>
          </template>
          <template v-else>
            <li class="item-desc" v-for="(item, index) in appoint_receiver" :key="item.id">
              {{ item.name + `【${item.dept_name}】` }} {{ index === 0 ? "(默认)" : "" }}
            </li>
            <span class="text-orange-500" v-if="appoint_receiver.length === 0">
              未设置指定领取人,请添加
            </span>
          </template>
        </ul>
        <span class="line" :class="dynamicLineClass(receive_status)"></span>
      </div>
      <!-- 抄送人的样式 -->
      <div class="flow-item">
        <ul class="item-content">
          <!-- <li class="item-circle"></li> -->
          <i-ep-CircleCheck class="flow-icon-primary" v-if="copy_status"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title" :class="dynamicTitleClass(copy_status)">抄送人</li>
          <template v-if="copyList.length > 0">
            <li class="item-desc" v-for="(item, index) in copyList" :key="item.id">
              {{ item.name + `【${item.dept_name}】` }}
            </li>
          </template>
          <li class="item-desc" v-else>未设置,自动跳过</li>
        </ul>
        <span class="line" :class="dynamicLineClass(copy_status)"></span>
      </div>
      <!-- 最后结束的样式 -->
      <div class="flow-item">
        <!-- <span class="line"></span> -->
        <ul class="item-content">
          <i-ep-CircleCheck class="flow-icon-success" v-if="status == 3"></i-ep-CircleCheck>
          <li class="item-circle" v-else></li>
          <li class="item-title" :class="dynamicOverClass(status)">结束</li>
          <li class="item-desc font-bold" :class="dynamicOverClass(status)" v-if="status == 3">
            {{ dynamicOverDesc }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- 抽屉弹窗 -->
  <el-drawer v-model="drawerVisible" size="60%" @close="drawerClose">
    <template #header>
      <span class="font-bold text-[18px]">{{ drawerTitle }}</span>
    </template>
    <template #default>
      <div class="search">
        <el-form :model="formData" ref="formRef" :inline="true">
          <el-form-item label="所属部门" prop="dept_id">
            <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
          </el-form-item>
          <el-form-item label="姓名" prop="keyword">
            <el-input v-model="formData.keyword" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" v-deBounce>
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
      </div>

      <div class="text-[14px] text-gray-400 mb-[20px]" v-if="drawerType == 1">
        <span>单选模式: 点击 确认选择 按钮 即为设置该项人员为指定审核人</span>
      </div>
      <div class="text-[14px] text-gray-400 mb-[20px]" v-else>
        <span>多选模式: 勾选人员后点击下方确认选择按钮，即为设置指定领取人</span>
        <p class="text-gray-600">{{ checkHint }}</p>
      </div>
      <template v-if="drawerType === 1">
        <PureTable
          border
          stripe
          :columns="approverColumns"
          :data="pageUserList"
          v-loading="drawerLoading"
          header-cell-class-name="table-row-header"
          adaptive
          :adaptiveConfig="{ offsetBottom: 200 }"
        >
          <template #operation="{ row, $index }">
            <el-button type="success" @click="cellSelect(row)" :disabled="row.disable">
              确认选择
            </el-button>
          </template>
        </PureTable>
      </template>
      <template v-else>
        <PureTable
          border
          stripe
          :columns="receiverColumns"
          :data="pageUserList"
          v-loading="drawerLoading"
          header-cell-class-name="table-row-header"
          adaptive
          :adaptiveConfig="{ offsetBottom: 200 }"
          @select="tableCellSelect"
          @select-all="tableAllSelect"
          row-key="id"
          ref="tableRef"
        >
          <template #operation="{ row, $index }">
            <!-- <el-button type="success" @click="toggleSelection(row)" :disabled="row.disable">
              选择
            </el-button> -->
            <el-button type="success" @click="toggleSelection(row)">选择</el-button>
          </template>
        </PureTable>
      </template>
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
          @click="drawerConfirm"
          size="large"
          type="primary"
          class="w-[100px]"
          v-if="drawerType === 2"
        >
          确认选择
        </el-button>
        <el-button @click="clearApprover" size="large" type="primary" v-if="drawerType === 1">
          清空指定审批人
        </el-button>
        <el-button
          @click="drawerVisible = false"
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
</template>

<style scoped lang="scss">
$maxWidth: 200px;
/* icon蓝色 */
.flow-icon-primary {
  // background-color: var(--el-color-primary);
  color: var(--el-color-primary);
  font-size: 24px;
}
/* icon绿色 */
.flow-icon-success {
  // background-color: var(--el-color-primary);
  color: var(--el-color-success);
  font-size: 24px;
}

/* 线条蓝色 */
.flow-line-primary {
  background-color: var(--el-color-primary) !important;
}
/* 线条橙色 */
.flow-line-orange {
  background-color: var(--el-color-warning) !important;
}
/* 文字蓝色 */
.flow-text-primary {
  color: var(--el-color-primary) !important;
}
/* 文字绿色 */
.flow-text-success {
  color: var(--el-color-success) !important;
}
/* 文字橙色 */
.flow-text-orange {
  color: var(--el-color-warning) !important;
}

.flow-wrapper {
  padding-left: 20px;
  position: relative;
  // height: 200px;
  // overflow: auto;
  /* 流程标题样式 */
  .flow-header {
    font-weight: bold;
    margin-bottom: 20px;
    position: absolute;
    left: 20px;
    /* 流程标题左侧横线 */
    &::before {
      position: absolute;
      display: block;
      content: "";
      width: 2px;
      height: 24px;
      background-color: var(--el-color-primary);
      left: -10px;
      top: 0;
    }
  }
  /* 流程内容样式 */
  .flow-content {
    display: flex;
    .flow-item {
      position: relative;
      flex-shrink: 0;
      flex: 1;
      max-width: $maxWidth;
      .item-content {
        max-width: $maxWidth;
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: var(--el-color-info-light-7);
        }
        .item-title {
          margin-top: 4px;
          font-weight: bold;
          color: #606266;
        }
        .item-desc {
          margin-top: 4px;
          color: #909399;
          font-size: 12px;
          text-align: center;
          .desc-content {
            text-align: center;
            margin-bottom: 4px;
            .desc-content-title {
              color: #606266;
              font-weight: bold;
            }
          }
        }
      }
      .line {
        position: absolute;
        // left: -40px;
        right: -40px;
        top: 13px;
        display: inline-block;
        // width: 100px;
        min-width: 80px;
        max-width: $maxWidth;
        height: 2px;
        background-color: var(--el-color-info-light-5);
      }
    }
  }
}
</style>
