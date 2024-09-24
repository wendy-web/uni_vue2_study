<script setup lang="ts">
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import type { TabPaneName } from "element-plus";
// 导入获取分类列表api
import {
  departmentListApi,
  goodsCateListApi,
  placeListApi,
  storageListApi, 
  unitListApi,
} from "@/api/common/index";
import { ICateItem, IDeptItem } from "@/api/common/types";
// 导入相关api
import {
  addDeptApi,
  addGoodsCateApi,
  addPlaceApi,
  addStorageApi,
  addUnitApi,
  delDeptApi,
  delGoodsCateApi,
  delPlaceApi,
  delStorageApi,
  delUnitApi,
  editDeptApi,
  editGoodsCateApi,
  editPlaceApi,
  editStorageApi,
  editUnitApi,
} from "@/api/system/base";
import { useUserStoreHook } from "@/store/modules/user";
import formDialog from "./components/formDialog.vue";

defineOptions({
  name: "SetBasics",
});

const { module_type } = useUserStoreHook();

enum ETile {
  "新增部门" = 1,
  "编辑部门",
  "新增子部门",
  "新增地点",
  "编辑地点",
  "新增子地点",
}
const state = reactive({
  goodsCateList: [] as ICateItem[], //商品分类列表
  unitList: [] as ICateItem[], //计量单位列表
  storageList: [] as ICateItem[], //仓库列表
  goodsCateName: "", //货品input的modelValue
  unitName: "", //计量单位input的modelValue
  storageName: "", //仓库input的modelValue
  goods_old: "", //goodsCateName的copy,编辑用到
  unit_old: "", //unitName的copy,编辑用到
  storage_old: "", //storageName的copy,编辑用到
  departmentList: [] as IDeptItem[],
  placeList: [] as any[],
  rowKeysList: [] as any[], //控制展开的数组
  placeKeysList: [] as any[], //控制展开的数组
  dialogVisible: false,
  titleType: 1, // 1新建部门 2编辑部门 3新建子部门
  // departmentFrom: {
  //   name: "", //部门input的modelValue
  //   pid: 0, //部门父级id
  //   id: 0, //部门id
  //   topName: "", // 上级部门
  // },
  // dialogBtnLoading: false, //弹窗按钮的加载状态
  tableLoading: false, //部门表格的加载状态
  placeTableLoading: false, //地点表格的加载状态
  dialogType: 2,
});
const {
  goodsCateList,
  unitList,
  storageList,
  departmentList,
  goodsCateName,
  unitName,
  storageName,
  goods_old,
  unit_old,
  storage_old,
  rowKeysList,
  placeKeysList,
  dialogVisible,
  titleType,
  // departmentFrom,
  // dialogBtnLoading,
  tableLoading,
  dialogType,
  placeList,
  placeTableLoading,
} = toRefs(state);

const activeName = ref("first");
const goods_input = ref<HTMLInputElement | null>(null);
const unit_input = ref<HTMLInputElement | null>(null);
const storage_input = ref<HTMLInputElement | null>(null);
// const dialogInputRef = ref<HTMLInputElement | null>();
// const dialogForm = ref<FormInstance>();
const formDialogRef = ref<InstanceType<typeof formDialog> | null>(null);

// 使用地点全部展开
function placeAllExpand(type: number) {
  if (type == 2) {
    placeKeysList.value = [];
  } else {
    console.log(placeKeysList.value);
    if (placeKeysList.value.length == 0) {
      placeList.value.forEach((item, index) => {
        console.log(item.id);
        placeKeysList.value.push(String(item.id));
        if (item.children) {
          item.children.forEach((element: any) => {
            placeKeysList.value.push(String(element.id));
          });
        }
      });
    }
  }
}

const handleClick = (name: TabPaneName) => {
  console.log("name", name);
  activeName.value = name as string;
  getData();
};

const getData = () => {
  switch (activeName.value) {
    case "first":
      // 货品分类
      getGoodsCate();
      break;
    case "second":
      // 仓库管理
      getStorage();
      break;
    case "third":
      // 计量单位
      getUnit();
      break;
    case "fourth":
      // 部门管理
      getDepartment();
      break;
    case "fifth":
      // 使用地点
      getPlaceList();
      break;

    default:
      getGoodsCate();
      break;
  }
};
// 获取商品分类列表
const getGoodsCate = async () => {
  const result = await goodsCateListApi();
  goodsCateList.value = result.data.list;
};
// 获取仓库列表
const getStorage = async () => {
  const result = await storageListApi();
  storageList.value = result.data.list;
};
// 获取计量单位列表
const getUnit = async () => {
  const result = await unitListApi();
  unitList.value = result.data.list;
};
// 获取部门列表
const getDepartment = async () => {
  try {
    tableLoading.value = true;
    const result = await departmentListApi();
    departmentList.value = result.data.list;
  } finally {
    tableLoading.value = false;
  }
};
const getPlaceList = async () => {
  try {
    placeTableLoading.value = true;
    const result = await placeListApi();
    placeList.value = result.data;
  } finally {
    placeTableLoading.value = false;
  }
};

// 点击新建货品分类
const addGoodsCate = async () => {
  if (!goodsCateName.value) {
    goods_input.value?.focus();
    return;
  }
  try {
    let result = await addGoodsCateApi({ name: goodsCateName.value });
    goodsCateList.value.unshift({
      id: result.data.id,
      name: goodsCateName.value,
    });
    goodsCateName.value = "";
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};

// 点击新建仓库
const addStorage = async () => {
  if (!storageName.value) {
    storage_input.value?.focus();
    return;
  }
  try {
    let result = await addStorageApi({ name: storageName.value });
    storageList.value.unshift({
      id: result.data.id,
      name: storageName.value,
    });
    storageName.value = "";
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};

// 点击新建计量单位
const addUnit = async () => {
  if (!unitName.value) {
    unit_input.value?.focus();
    return;
  }
  try {
    let result = await addUnitApi({ name: unitName.value });
    unitList.value.unshift({
      id: result.data.id,
      name: unitName.value,
    });
    unitName.value = "";
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};

// 列表点击编辑 触发的事件
const handleEdit = (item: ICateItem, key: number) => {
  const map = new Map();
  map.set(1, function () {
    //货品分类列表 点击编辑的事件
    goods_old.value = item.name;
    item.inputStatus = 1;
  });
  map.set(2, function () {
    //货品列表 点击编辑的事件
    storage_old.value = item.name;
    item.inputStatus = 1;
  });
  map.set(3, function () {
    //计量单位列表 点击编辑的事件
    unit_old.value = item.name;
    item.inputStatus = 1;
  });
  let fn = map.get(key);
  fn();
};

// 货品分类编辑失去焦点/回车
const handeleBlurEditGoods = async (event: FocusEvent, item: ICateItem) => {
  console.log("我触发了");
  let inputValue = (event.target as HTMLInputElement).value;
  if (!inputValue) {
    // 如果没有输入的值,则回复旧值,同时取消input的显示
    item.name = goods_old.value;
    item.inputStatus = 0;
    return;
  } else if (inputValue == goods_old.value) {
    // 如果值没有变化,则直接取消input的显示
    item.inputStatus = 0;
    return;
  }
  item.inputStatus = 0;
  let data = {
    id: item.id,
    name: item.name,
  };
  try {
    let result = await editGoodsCateApi(data);
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};
// 仓库编辑失去焦点/回车
const handeleBlurEditStorage = async (event: FocusEvent, item: ICateItem) => {
  let inputValue = (event.target as HTMLInputElement).value;
  if (!inputValue) {
    // 如果没有输入的值,则回复旧值,同时取消input的显示
    item.name = storage_old.value;
    item.inputStatus = 0;
    return;
  } else if (inputValue == storage_old.value) {
    // 如果值没有变化,则直接取消input的显示
    item.inputStatus = 0;
    return;
  }
  item.inputStatus = 0;
  let data = {
    id: item.id,
    name: item.name,
  };
  try {
    let result = await editStorageApi(data);
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};

// 计量单位编辑失去焦点
const handeleBlurEditUnit = async (event: FocusEvent, item: any) => {
  let inputValue = (event.target as HTMLInputElement).value;
  if (!inputValue) {
    // 如果没有输入的值,则回复旧值,同时取消input的显示
    item.name = unit_old.value;
    item.inputStatus = 0;
    return;
  } else if (inputValue == unit_old.value) {
    // 如果值没有变化,则直接取消input的显示
    item.inputStatus = 0;
    return;
  }
  item.inputStatus = 0;
  let data = {
    id: item.id,
    name: item.name,
  };
  try {
    let result = await editUnitApi(data);
    ElMessage.success(result.msg);
  } catch (error) {
    console.log(error);
  }
};

// 各列表 点击删除 确认触发的事件
const handleDel = async (id: number, index: number, key: number) => {
  let map = new Map();
  map.set(1, async function () {
    //货品分类列表 点击删除的事件
    let result = await delGoodsCateApi({ id });
    goodsCateList.value.splice(index, 1);
    ElMessage.success(result.msg);
  });
  map.set(2, async function () {
    //仓库列表 点击删除的事件
    let result = await delStorageApi({ id });
    storageList.value.splice(index, 1);
    ElMessage.success(result.msg);
  });
  map.set(3, async function () {
    //计量单位列表 点击删除的事件
    let result = await delUnitApi({ id });
    unitList.value.splice(index, 1);
    ElMessage.success(result.msg);
  });
  let fn = map.get(key);
  fn();
};

// 点击新建部门
const handleDialog = (type = 1) => {
  titleType.value = type === 1 ? 1 : 4;
  dialogType.value = type;
  dialogVisible.value = true;
};
// 单元格点击 新增子部门
const cellAdd = (row: any, type = 1) => {
  // titleType.value = 3;
  titleType.value = type === 1 ? 3 : 6;
  dialogType.value = type;
  dialogVisible.value = true;
  // nextTick(() => {
  //   departmentFrom.value.topName = row.name;
  //   departmentFrom.value.pid = row.id;
  // });
  nextTick(() => {
    formDialogRef.value!.departmentFrom.topName = type === 1 ? row.name : row.place_name;
    formDialogRef.value!.departmentFrom.pid = row.id;
  });
};
// 单元格点击编辑
const cellEdit = (row: any, type = 1) => {
  console.log("row", row);
  // titleType.value = 2;
  titleType.value = type === 1 ? 2 : 5;
  dialogType.value = type;
  dialogVisible.value = true;
  // nextTick(() => {
  //   departmentFrom.value.name = row.name;
  //   departmentFrom.value.id = row.id;
  //   departmentFrom.value.pid = row.pid;
  // });
  nextTick(() => {
    formDialogRef.value!.departmentFrom.name = type === 1 ? row.name : row.place_name;
    formDialogRef.value!.departmentFrom.id = row.id;
    formDialogRef.value!.departmentFrom.pid = row.pid;
  });
};
// 单元格点击删除
const cellDel = (row: any, type = 1) => {
  console.log("删除的row", row);
  console.log("type", type);
  if (type === 1) {
    let name = row.name;
    let content =
      row._children.length > 0
        ? `您确认要删除【${name}】及其所有子部门吗?`
        : `您确认要删除【${name}】吗?`;
    ElMessageBox.confirm(content, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const result = await delDeptApi({ id: row.id });
        ElMessage.success(result.msg);
        getDepartment();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    let name = row.place_name;
    let children = row.children ?? [];
    let content =
      children.length > 0
        ? `您确认要删除【${name}】及其所有子地点吗?`
        : `您确认要删除【${name}】吗?`;
    ElMessageBox.confirm(content, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const result = await delPlaceApi({ id: row.id });
        ElMessage.success(result.msg);
        getPlaceList();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
// 弹窗点击确认按钮
const dialogConfirm = () => {
  if (formDialogRef.value!.departmentFrom.name.length < 1) {
    return;
  }
  let map = new Map();
  // 1新建部门 2编辑部门 3新建子部门
  map.set(1, async function () {
    console.log("新建部门");
    formDialogRef.value!.dialogBtnLoading = true;
    let { name, pid } = formDialogRef.value!.departmentFrom;
    try {
      const result = await addDeptApi({ name, pid });
      console.log(result);
      dialogVisible.value = false;
      ElMessage.success(result.msg);
      getDepartment();
    } finally {
      formDialogRef.value!.dialogBtnLoading = false;
    }
  });
  map.set(2, async function () {
    console.log("编辑部门");
    formDialogRef.value!.dialogBtnLoading = true;
    let { name, id } = formDialogRef.value!.departmentFrom;
    try {
      const result = await editDeptApi({ name, id });
      dialogVisible.value = false;
      ElMessage.success(result.msg);
      getDepartment();
    } finally {
      formDialogRef.value!.dialogBtnLoading = false;
    }
  });

  map.set(4, async function () {
    console.log("新建地点");
    formDialogRef.value!.dialogBtnLoading = true;
    let { name: place_name, pid } = formDialogRef.value!.departmentFrom;
    try {
      const result = await addPlaceApi({ place_name, pid });
      dialogVisible.value = false;
      ElMessage.success(result.msg);
      getPlaceList();
    } finally {
      formDialogRef.value!.dialogBtnLoading = false;
    }
  });
  map.set(5, async function () {
    console.log("编辑地点");
    formDialogRef.value!.dialogBtnLoading = true;
    let { name: place_name, id } = formDialogRef.value!.departmentFrom;
    try {
      const result = await editPlaceApi({ place_name, id });
      dialogVisible.value = false;
      ElMessage.success(result.msg);
      getPlaceList();
    } finally {
      formDialogRef.value!.dialogBtnLoading = false;
    }
  });

  if (dialogType.value === 1) {
    let key = titleType.value == 2 ? 2 : 1;
    let fn = map.get(key);
    fn();
  } else if (dialogType.value === 2) {
    let key = titleType.value == 5 ? 5 : 4;
    let fn = map.get(key);
    fn();
  }
};
// dialog弹窗打开后的回调事件, 给input自动获取焦点
// function dialogOpenCallback() {
//   nextTick(() => {
//     dialogInputRef.value?.focus();
//   });
// }
// dialog弹窗关闭后的回调事件
// function closeDialog() {
//   dialogForm.value!.resetFields();
//   dialogForm.value!.clearValidate();
//   departmentFrom.value.pid = 0;
//   departmentFrom.value.id = 0;
// }

// 点击全部展开\折叠
const changeAllExpand = (type: number) => {
  // type2是折叠,1的展开
  if (type == 2) {
    rowKeysList.value = [];
  } else {
    console.log(rowKeysList.value);
    if (rowKeysList.value.length == 0) {
      departmentList.value.forEach((item, index) => {
        console.log(item.id);

        rowKeysList.value.push(String(item.id));
        if (item._children) {
          item._children.forEach((element) => {
            rowKeysList.value.push(String(element.id));
          });
        }
      });
    }
  }
};

// const dialogTitle = computed(() => {
//   return ETile[titleType.value];
// });

onActivated(() => {
  console.log("我进入了基础设置页面");
  getData();
});
onDeactivated(() => {
  console.log("我离开了基础设置页面");
});
</script>

<template>
  <div class="app-container">
    <div class="app-card">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="货品分类" name="first">
          <el-card class="overflow-auto" shadow="never" style="width: 80%; padding-bottom: 100px">
            <div class="mb-4">
              <span>货品分类</span>
              <el-input
                v-model.trim="goodsCateName"
                placeholder="请输入货品分类名称"
                style="width: 200px; margin: 0 10px"
                @keyup.enter.native="addGoodsCate"
                ref="goods_input"
              ></el-input>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="新建货品分类"
                placement="top-start"
              >
                <el-button type="success" :icon="Plus" @click="addGoodsCate"></el-button>
              </el-tooltip>
            </div>
            <div class="flex items-center flex-wrap">
              <div class="goods-item" v-for="(item, index) in goodsCateList" :key="item.id">
                <div class="goos-info" v-if="!item.inputStatus">
                  <span class="block mr-[10px]">{{ item.name }}</span>
                  <el-button
                    link
                    type="primary"
                    @click="handleEdit(item, 1)"
                    v-hasModule="item.module_type"
                  >
                    编辑
                  </el-button>
                  <el-popconfirm
                    :title="`确认删除【${item.name}】分类吗?`"
                    width="240"
                    @confirm="handleDel(item.id, index, 1)"
                  >
                    <template #reference>
                      <el-button link type="info" v-hasModuleAdmin="item.module_type">
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <el-row :gutter="10" v-else style="margin-left: 1px">
                  <div class="flex">
                    <el-input
                      v-model="item.name"
                      v-focus
                      clearable
                      @blur="handeleBlurEditGoods($event, item)"
                      @keyup.enter.native="$event.target.blur()"
                    >
                      <template #append>
                        <el-button @click="handeleBlurEditGoods($event, item)">保存</el-button>
                      </template>
                    </el-input>
                  </div>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="仓库管理" name="second" v-if="module_type === 0">
          <el-card shadow="never" style="width: 80%; padding-bottom: 100px">
            <div class="mb-4">
              <span>仓库</span>
              <el-input 
                v-model.trim="storageName"
                placeholder="请输入仓库名称"
                style="width: 200px; margin: 0 10px"
                @keyup.enter.native="addStorage"
                ref="storage_input"
              ></el-input>
              <el-tooltip class="box-item" effect="dark" content="新建仓库" placement="top-start">
                <el-button
                  type="success"
                  class="ml-[10px]"
                  :icon="Plus"
                  @click="addStorage"
                ></el-button>
              </el-tooltip>
            </div>
            <div class="flex items-center flex-wrap">
              <div class="goods-item" v-for="(item, index) in storageList" :key="item.id">
                <div class="goos-info" v-if="!item.inputStatus">
                  <span class="block mr-[10px]">{{ item.name }}</span>
                  <el-button
                    link
                    type="primary"
                    @click="handleEdit(item, 2)"
                    v-hasModule="item.module_type"
                  >
                    编辑
                  </el-button>
                  <!-- <el-popconfirm
                    :title="`确认删除【${item.name}】吗?`"
                    width="240"
                    @confirm="handleDel(item.id, index, 2)"
                  >
                    <template #reference>
                      <el-button link type="info" v-hasModuleAdmin="item.module_type">
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm> -->
                </div>
                <el-row :gutter="10" v-else style="margin-left: 1px">
                  <div class="flex">
                    <el-input
                      v-model="item.name"
                      v-focus
                      clearable
                      @blur="handeleBlurEditStorage($event, item)"
                      @keyup.enter.native="$event.target.blur()"
                    >
                      <template #append>
                        <el-button @click="handeleBlurEditStorage($event, item)">保存</el-button>
                      </template>
                    </el-input>
                  </div>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="计量单位" name="third">
          <el-card class="" shadow="never" style="width: 80%; padding-bottom: 100px">
            <div class="mb-4">
              <span>计量单位</span>
              <el-input
                v-model.trim="unitName"
                placeholder="请输入计量单位"
                style="width: 200px; margin: 0 10px"
                @keyup.enter.native="addUnit"
                ref="unit_input"
              ></el-input>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="新建计量单位"
                placement="top-start"
              >
                <el-button type="success" :icon="Plus" @click="addUnit"></el-button>
              </el-tooltip>
            </div>
            <div class="flex items-center flex-wrap">
              <div class="goods-item" v-for="(item, index) in unitList" :key="item.id">
                <div class="goos-info" v-if="!item.inputStatus">
                  <span class="block mr-[10px]">{{ item.name }}</span>
                  <el-button
                    link
                    type="primary"
                    @click="handleEdit(item, 3)"
                    v-hasModule="item.module_type"
                  >
                    编辑
                  </el-button>
                  <!-- <el-popconfirm
                    :title="`确认删除【${item.name}】单位吗?`"
                    width="240"
                    @confirm="handleDel(item.id, index, 3)"
                  >
                    <template #reference>
                      <el-button link type="info" v-hasModuleAdmin="item.module_type">
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm> -->
                </div>
                <el-row :gutter="10" v-else style="margin-left: 1px">
                  <div class="flex">
                    <el-input
                      v-model="item.name"
                      v-focus
                      clearable
                      @blur="handeleBlurEditUnit($event, item)"
                      @keyup.enter.native="$event.target.blur()"
                    ></el-input>
                    <!-- <el-button link>保存</el-button> -->
                  </div>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="部门管理" name="fourth">
          <div class="flex flex-col overflow-hidden h-[80%]">
            <div class="mb-6">
              <span>部门管理</span>
              <el-button
                :icon="Plus"
                type="success"
                @click="handleDialog()"
                class="ml-[10px]"
                v-if="module_type === 0"
              >
                新增部门
              </el-button>
              <el-button @click="changeAllExpand(1)" class="ml-[10px]">全部展开</el-button>
              <el-button @click="changeAllExpand(2)">全部折叠</el-button>
            </div>
            <el-table
              :data="departmentList"
              border
              row-key="id"
              :default-expand-all="false"
              :tree-props="{ children: '_children' }"
              :expand-row-keys="rowKeysList"
              v-loading="tableLoading"
            >
              <el-table-column label="名称" prop="name" />
              <el-table-column label="操作" v-if="module_type === 0">
                <template #default="scope">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    @click="cellAdd(scope.row)"
                    v-if="scope.row._level < 2"
                  >
                    新增子部门
                  </el-button>
                  <!-- v-hasModule="scope.row.module_type" -->
                  <el-button type="warning" :icon="Edit" @click="cellEdit(scope.row)">
                    编辑
                  </el-button>
                  <!-- v-hasModuleAdmin="scope.row.module_type" -->
                  <!-- <el-button type="danger" :icon="Delete" @click="cellDel(scope.row)">
                    删除
                  </el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="使用地点" name="fifth">
          <div class="flex flex-col overflow-hidden h-[80%]">
            <div class="mb-6">
              <span>使用地点管理</span>
              <el-button :icon="Plus" type="success" class="ml-[10px]" @click="handleDialog(2)">
                新增地点
              </el-button>
              <el-button @click="placeAllExpand(1)">全部展开</el-button>
              <el-button @click="placeAllExpand(2)">全部折叠</el-button>
            </div>

            <el-table
              :data="placeList"
              border
              row-key="id"
              :default-expand-all="false"
              :tree-props="{ children: 'children' }"
              :expand-row-keys="placeKeysList"
              v-loading="placeTableLoading"
            >
              <el-table-column label="名称" prop="place_name" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    @click="cellAdd(scope.row, 2)"
                    v-if="scope.row.level < 2"
                  >
                    新增子地点
                  </el-button>
                  <el-button
                    type="warning"
                    :icon="Edit"
                    @click="cellEdit(scope.row, 2)"
                    v-hasModule="scope.row.module_type"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    :icon="Delete"
                    @click="cellDel(scope.row, 2)"
                    v-hasModuleAdmin="scope.row.module_type"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <form-dialog
      v-model:visible="dialogVisible"
      :titleType="titleType"
      :type="dialogType"
      @confirm="dialogConfirm"
      ref="formDialogRef"
    ></form-dialog>
  </div>
</template>

<style scoped lang="scss">
.el-tabs--card {
  height: calc(100vh - 110px);
  /* overflow-y: auto; */
}
.el-tab-pane {
  height: calc(100vh - 110px);
  overflow-y: auto;
}
.app-card {
  height: calc(100vh - 160px);
  // overflow: auto;
}
.goods-item {
  font-size: 14px;
  height: 30px;
  margin: 20px 20px 0 0;
  .goos-info {
    display: flex;
    align-items: center;
    padding: 0 10px;
    border: 1px solid #409eff;
    border-radius: 4px;
    font-size: 14px;
    height: 30px;
  }
}
</style>
