<script setup lang="ts">
/* 点巡检管理-点巡检项目-新建页面 */
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import {
  getInspectionProjectAddApi,
  getInspectionProjectDetailApi,
  getInspectionProjectEditApi,
} from "@/api/device/inspection/project/index";
import type { InspectionProjectDetailArr } from "@/api/device/inspection/project/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { useBaseData } from "@/hooks/device/baseData";
import { useEditHooks } from "@/hooks/edit";
import { useTagsViewStore } from "@/store/modules/tagsView";
import AddValue from "./components/addValue.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "deviceInspectionProjectAdd",
});
const { isReqDetail } = useEditHooks();

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const { getTypeList, treeData } = useBaseData();
const { formData, addRules, group, columns, popupColumns, popupVisible, popupForm, popupRules } =
  useAdd();

enum ETitle {
  "新建点巡检内容" = 1,
  "编辑点巡检内容",
}
type TableType = {
  addId: string;
  item_content: string;
  method: string;
  std_explain: string;
  record_method: number;
  normal_val: string;
  abnormal_val: string;
  upper_limit_val: string;
  lower_limit_val: string;
};

const normalValueRef = ref<InstanceType<typeof AddValue>>();
const abnormalValueRef = ref<InstanceType<typeof AddValue>>();

const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});
const plusDialogFormRef = ref();
const dialogFormRef = computed(() => {
  return plusDialogFormRef.value.formInstance as FormInstance;
});
const listId = ref(0);
/** 记录表格内容点击编辑时的单元格id */
const addId = ref("");
const pageType = ref(1);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

const tableList = ref<TableType[]>([]);

/** 监听选择资产类型的change事件 */
function treeSelectChange(name: string) {
  formData.value.equipment_type_title = name;
}

/** 点击新增检查内容 */
function handleAdd() {
  addId.value = "";
  popupVisible.value = true;
  resetDialog();
  nextTick(() => {
    nextTick(() => {
      dialogFormRef.value.clearValidate("item_content");
    });
  });
}

/** 监听正常值输入的变化 */
function onNormalChange(tagList: string[]) {
  // console.log("🚀 ~ onNormalChange ~ tagList:", tagList);
  popupForm.value.normal_val = tagList;
}

/** 监听异常值输入的变化 */
function onAbnoramlChange(tagList: string[]) {
  // console.log("🚀 ~ onAbnoramlChange ~ tagList:", tagList);
  popupForm.value.abnormal_val = tagList;
}

/** 监听添加检查内容弹窗点击确定的事件 */
function onConfirm(values: FieldValues) {
  popupVisible.value = false;
  // console.log("🚀 ~ onConfirm ~ values:", values);
  let { normal_val, abnormal_val, ...rest } = popupForm.value;
  let normalValue: string = normal_val.join("/");
  let abnormalValue: string = abnormal_val.join("/");
  if (addId.value) {
    let findRes = tableList.value.find((item) => item.addId === addId.value);
    if (findRes) {
      findRes.item_content = popupForm.value.item_content;
      findRes.method = popupForm.value.method;
      findRes.std_explain = popupForm.value.std_explain;
      findRes.record_method = popupForm.value.record_method;
      findRes.normal_val = popupForm.value.normal_val.join("/");
      findRes.abnormal_val = popupForm.value.abnormal_val.join("/");
      findRes.upper_limit_val = popupForm.value.upper_limit_val;
      findRes.lower_limit_val = popupForm.value.lower_limit_val;
    }
  } else {
    tableList.value.push({
      addId: buildUUID(),
      normal_val: normalValue,
      abnormal_val: abnormalValue,
      ...rest,
    });
  }

  console.log("🚀 ~ onConfirm ~ tableList.value:", tableList.value);
}

function resetDialog() {
  normalValueRef.value?.resetTag();
  abnormalValueRef.value?.resetTag();
  popupForm.value.item_content = "";
  popupForm.value.method = "";
  popupForm.value.std_explain = "";
  popupForm.value.record_method = 0;
  popupForm.value.normal_val = [];
  popupForm.value.abnormal_val = [];
  popupForm.value.upper_limit_val = "";
  popupForm.value.lower_limit_val = "";
}

/** 单元格点击修改 */
function cellEdit(row: TableType) {
  addId.value = row.addId;
  popupForm.value.item_content = row.item_content;
  popupForm.value.method = row.method;
  popupForm.value.std_explain = row.std_explain;
  popupForm.value.record_method = row.record_method;
  popupForm.value.normal_val = row.normal_val.split("/");
  popupForm.value.abnormal_val = row.abnormal_val.split("/");
  popupForm.value.upper_limit_val = row.upper_limit_val;
  popupForm.value.lower_limit_val = row.lower_limit_val;
  popupVisible.value = true;
  console.log("popupForm.value", popupForm.value);
}

/** 单元格点击删除 */
function cellDel(row: TableType) {
  tableList.value = tableList.value.filter((item) => item.addId !== row.addId);
}

// 点击返回
function pageBack() {
  router.go(-1);
}

// 点击确定
async function handleConfirm() {
  const validateRes = await formRef.value.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        formRef.value.scrollToField(keys);
        break;
      }
    }
  });

  if (!validateRes) return;
  if (tableList.value.length === 0) {
    ElMessage.warning("请添加检查内容");
    return;
  }

  let data = {
    id: listId.value ? listId.value : undefined,
    ...formData.value,
    item_arr: tableList.value.map((item) => {
      let { normal_val, abnormal_val, addId, ...rest } = item;
      return {
        normal_val: normal_val.split("/").join(","),
        abnormal_val: abnormal_val.split("/").join(","),
        ...rest,
      };
    }),
  };

  const result = listId.value
    ? await getInspectionProjectEditApi(data)
    : await getInspectionProjectAddApi(data);
  ElMessageBox.confirm(`${result.msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  })
    .then(() => {
      const currentTag = router.currentRoute.value;
      router.replace({
        path: "/device/inspection/project",
      });

      tagsViewStore.delView(currentTag);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getDetailData() {
  const result = await getInspectionProjectDetailApi({ id: listId.value });
  let data = result.data;
  formData.value.equipment_type_id = data.equipment_type_id;
  formData.value.equipment_type_title = data.equipment_type_title;
  formData.value.inspect_items_name = data.inspect_items_name;
  formData.value.inspect_purpose = data.inspect_purpose;
  formData.value.note = data.note;

  tableList.value = changeDetailData(data.item_arr);
  console.log("🚀 ~ getDetailData ~  tableList.value:", tableList.value);
}

function changeDetailData(data: InspectionProjectDetailArr[]) {
  let arr = data.map((item, index) => {
    return {
      addId: buildUUID(),
      id: item.id,
      item_content: item.item_content,
      method: item.method,
      std_explain: item.std_explain,
      record_method: item.record_method,
      normal_val: item.normal_val ? item.normal_val.split(",").join("/") : "",
      abnormal_val: item.abnormal_val ? item.abnormal_val.split(",").join("/") : "",
      upper_limit_val: item.upper_limit_val,
      lower_limit_val: item.lower_limit_val,
    };
  });
  return arr;
}

const initTagsView = () => {
  // id存在表示是编辑
  pageType.value = listId.value ? 2 : 1;
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  getTypeList();
  listId.value = Number(route.query.id) || 0;
  initTagsView();
  if (listId.value && isReqDetail.value) {
    getDetailData();
  }
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
      </div>
      <PlusForm
        ref="PlusformRef"
        :rules="addRules"
        v-model="formData"
        :group="group"
        :colProps="{ span: 8 }"
        :rowProps="{ gutter: 20 }"
        :hasFooter="false"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect
            :list="treeData"
            v-model="formData.equipment_type_id"
            @nodeChange="treeSelectChange"
          ></TreeSelect>
        </template>
      </PlusForm>
      <el-card shadow="never" header="新增检查内容">
        <el-button type="primary" @click="handleAdd" class="mb-4">添加检查内容</el-button>
        <pure-table :data="tableList" :columns="columns" header-cell-class-name="table-gray-header">
          <template #select="{ row }">
            <div>
              <ul>
                <li v-if="row.normal_val">
                  <span>正常值：</span>
                  <span>{{ row.normal_val }}</span>
                </li>
                <li v-if="row.abnormal_val">
                  <span>异常值：</span>
                  <span>{{ row.abnormal_val }}</span>
                </li>
              </ul>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button type="primary" link @click="cellEdit(row)">修改</el-button>
            <el-button type="info" link @click="cellDel(row)">删除</el-button>
          </template>
        </pure-table>
      </el-card>
      <PlusDialogForm
        ref="plusDialogFormRef"
        v-model:visible="popupVisible"
        v-model="popupForm"
        :form="{
          columns: popupColumns,
          rules: popupRules,
          labelWidth: '100px',
          labelPosition: 'right',
        }"
        :dialog="{
          title: '添加检查内容',
          draggable: true,
          cancelText: '取消',
          confirmText: '确定',
          top: '20vh',
        }"
        @confirm="onConfirm"
      >
        <template #plus-field-record_method>
          <el-radio-group v-model="popupForm.record_method" size="large">
            <el-radio-button :label="0">单选</el-radio-button>
            <el-radio-button :label="1">多选</el-radio-button>
            <el-radio-button :label="2">数值</el-radio-button>
            <el-radio-button :label="3">长文本</el-radio-button>
          </el-radio-group>
        </template>
        <template #plus-field-normal_val>
          <AddValue
            :list="popupForm.normal_val"
            @change="onNormalChange"
            ref="normalValueRef"
          ></AddValue>
        </template>
        <template #plus-field-abnormal_val>
          <AddValue
            :list="popupForm.abnormal_val"
            @change="onAbnoramlChange"
            btn-title="添加异常值"
            ref="abnormalValueRef"
          ></AddValue>
        </template>
      </PlusDialogForm>
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm" class="w-[100px]" size="large">
        确定
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

:deep(.plus-form .el-card) {
  box-shadow: none;
}
.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 99;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>
