<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues } from "plus-pro-components";
// 引入公共接口：CIP检测项目、供应商下拉列表
import { getCipBaseData, getSupplierMap } from "@/api/quality/common/index";
import {
  getBaseValSettingApi,
  saveBaseValSettingApi,
} from "@/api/quality/standard-config/material/index";
import { BaseValSetModule } from "@/api/quality/standard-config/material/types";
import Tree from "./components/tree.vue";
import { useList } from "./utils/hook";

/** 工序检验配置列表页 */
defineOptions({
  name: "StandardConfigProcessConfig",
});
const {
  columns,
  treeData,
  popupColums,
  popupVisible,
  popupForm,
  popupRules,
  initExpression,
  brandTabList,
} = useList();
/** 搜索表单的绑定值 */
const formData = ref({
  brand: "ND1",
  item: 24, // 类型  24、半成品检测 25、样品检测
  sku: "ND1-1", // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
  pro: "", // 定量项目传参 name 项目名称
});
const treeRef = ref<InstanceType<typeof Tree>>();
const currentTreeId = ref(24); // 默认选中半成品检测
const prueTableRef = ref();
const tableLoading = ref(false);

//动态获取sku的tab
const skuTabList: any = computed(() => {
  return brandTabList.filter((item) => item.key === formData.value.brand)[0].skuList;
});

// 默认选中的sku
const skuTabDefault = ref(skuTabList.value[0].key);

/** 表格内容 */
const tableData = ref<BaseValSetModule.BaseValSetData[]>([]);
// 弹窗表单
const plusDialogFormRef = ref();
const initDialogFormRef = computed(() => {
  return plusDialogFormRef.value?.formInstance as FormInstance;
});
function onTreeSelect(val: number[]) {
  formData.value.item = val[0];
  popupForm.value.item = val[0];
  console.log("onTreeSelect", val);
  // 特殊处理：28,29,30:定期cip，停机cip，开机确认单 先获取cip项目下拉列表
  if ([28, 29, 30].includes(val[0])) {
    initCipTabs();
    return;
  }
  // 31香精入厂：不显示产品类型，显示供应商tab
  if (val[0] === 31) {
    initSupplierTabs();
    return;
  }
  // 其它选项无需特殊处理
  getData();
}
// 初始化CIP检测项目（tab选项卡）
// 默认选中的定量项目
const cipTabList = ref<any>([]); // 定量项目下拉列表
const cipSelectName = ref("");
const cipTabIndex = ref<any>(0);
async function initCipTabs() {
  try {
    const result = await getCipBaseData();
    let { pro_init } = result.data;
    cipTabList.value = pro_init.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    cipSelectName.value = pro_init[0].name;
    cipTabIndex.value = pro_init[0].id;
    getData();
  } catch (error) {
    console.log("获取CIP检测项目失败", error);
  }
}
// 初始化供应商（tab选项卡）
const supplierTabList = ref<any>([]);
const supplierSelectName = ref("");
const supplierTabIndex = ref<any>(0);
async function initSupplierTabs() {
  try {
    const result = await getSupplierMap();
    let { data } = result;
    supplierTabList.value = data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    supplierSelectName.value = data[0].name;
    supplierTabIndex.value = data[0].id;
    getData();
  } catch (error) {
    console.log("获取供应商下拉项目失败", error);
  }
}
// 点击cip项目
function cipTabClick({ index, props }: any) {
  let { label, name } = props;
  cipTabIndex.value = name;
  cipSelectName.value = label;
  //更新配置数据
  getData();
}
// 点击供应商
function supplierTabClick({ index, props }: any) {
  let { label, name } = props;
  supplierTabIndex.value = name;
  supplierSelectName.value = label;
  //更新配置数据
  getData();
}
// 点击sku:产品类型
function skuClick({ index, props }: any) {
  formData.value.sku = skuTabList.value[index].key;
  popupForm.value.sku = skuTabList.value[index].key;
  getData();
}

// 点击品牌
function brandClick({ index, props }: any) {
  formData.value.brand = brandTabList[index].key;
  formData.value.sku = skuTabList.value[0].key;
  skuTabDefault.value = skuTabList.value[0].key;

  getData();
}
// 点击详情
const handleDetail = (row: BaseValSetModule.BaseValSetData) => {
  popupForm.value.id = row.id;
  popupVisible.value = true;
};

const handleEdit = (row: BaseValSetModule.BaseValSetData) => {
  initDialogFormRef.value?.resetFields();
  let {
    id,
    name,
    en,
    unit,
    status,
    type,
    lower_limit_val,
    upper_limit_val,
    error_limit_val,
    value,
    key,
    item,
    sku,
    brand,
    default_val,
  } = row;
  let { sku: form_sku, item: form_item, brand: form_brand } = formData.value;

  popupForm.value.id = id;
  popupForm.value.name = name;
  popupForm.value.en = en;
  popupForm.value.unit = unit;
  popupForm.value.status = status;
  popupForm.value.type = type;
  popupForm.value.lower_limit_val = lower_limit_val;
  popupForm.value.upper_limit_val = upper_limit_val;
  popupForm.value.error_limit_val = error_limit_val;
  popupForm.value.key = key;
  popupForm.value.item = item || form_item;
  popupForm.value.sku = sku || form_sku;
  popupForm.value.brand = brand || form_brand;
  popupForm.value.default_val = default_val;
  if (value !== null && value !== "") {
    popupForm.value.value = value;
  } else {
    popupForm.value.value = 1;
  }
  // console.log("handleEdit", popupForm.value);
  popupVisible.value = true;
};

// 获取配置列表数据
async function getData() {
  try {
    let { item, ...rest } = formData.value;
    let params: any = {
      item,
      ...rest,
    };
    // item:28,29,30:定期cip，停机cip，开机确认单
    if ([28, 29, 30].includes(item)) {
      params.pro = cipSelectName.value;
    }
    // item：31香精入厂
    if ([31].includes(item)) {
      params.supplier_id = supplierTabIndex.value;
    }
    tableLoading.value = true;
    const result = await getBaseValSettingApi(params);
    result.data.forEach((item) => {
      item.expression = initExpression(item);
      console.log("表达式:", item.expression);
      if (!item.id) {
        item.buildUUID = buildUUID();
        // console.log("自定义uuid:", item.buildUUID);
      }
    });
    tableLoading.value = false;
    tableData.value = [];
    tableData.value = result.data;
  } catch (error) {
    tableLoading.value = false;
  }
}
/** 监听添加检查项弹窗点击确定的事件 */
async function onConfirm(values: FieldValues) {
  let { type } = popupForm.value;
  // 如果不是区间，置空上限值
  // if (type !== 0) {
  //   popupForm.value.upper_limit_val = "0";
  // }
  let { item, ...rest } = popupForm.value;
  let data: any = {
    item,
    ...rest,
  };
  // item:28,29,30:定期cip，停机cip，开机确认单
  if ([28, 29, 30].includes(item)) {
    data.pro = cipSelectName.value;
  }
  // item：31香精入厂
  if ([31].includes(item)) {
    data.supplier_id = supplierTabIndex.value;
  }
  const result = await saveBaseValSettingApi({ data: [data] });
  if (result.code == 1) {
    popupVisible.value = false;
    ElMessage({
      message: result.msg,
      type: "success",
    });
    getData();
  }
  // console.log("🚀 ~ onConfirm ~ tableList.value:", popupForm.value);
}
onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container flex">
    <Tree
      class="min-w-[200px] mr-[10px]"
      :treeData="treeData"
      :currentTreeId="currentTreeId"
      @tree-select="onTreeSelect"
      ref="treeRef"
    ></Tree>
    <div class="w-[calc(100%-220px)]">
      <div class="app-card">
        <!-- item:31香精入厂 不显示产品类型 -->
        <el-tabs v-if="Number(formData.item) !== 31" type="border-card" @tab-click="brandClick">
          <template v-for="(item, index) of brandTabList" :key="item.key">
            <el-tab-pane :label="item.title">
              <el-tabs @tab-click="skuClick" v-model="skuTabDefault">
                <template v-for="(item, index) of skuTabList" :key="item.key">
                  <el-tab-pane :label="item.title" :name="item.key">
                    <template #label>
                      <span>
                        {{ item.title }}
                      </span>
                    </template>
                  </el-tab-pane>
                </template>
              </el-tabs>
              <!-- cip项目tab,item=28,29,30显示 -->
              <el-tabs
                v-if="[28, 29, 30].includes(Number(formData.item))"
                @tab-click="cipTabClick"
                v-model="cipTabIndex"
              >
                <template v-for="(item, index) of cipTabList" :key="item.id">
                  <el-tab-pane :label="item.label" :name="item.value">
                    <template #label>
                      <span>
                        {{ item.label }}
                      </span>
                    </template>
                  </el-tab-pane>
                </template>
              </el-tabs>
            </el-tab-pane>
          </template>
        </el-tabs>
        <!-- item:31香精入厂 显示供应商 -->
        <el-tabs
          v-if="[31].includes(Number(formData.item))"
          @tab-click="supplierTabClick"
          v-model="supplierTabIndex"
        >
          <template v-for="(item, index) of supplierTabList" :key="item.id">
            <el-tab-pane :label="item.label" :name="item.value">
              <template #label>
                <span>
                  {{ item.label }}
                </span>
              </template>
            </el-tab-pane>
          </template>
        </el-tabs>
        <pure-table
          ref="prueTableRef"
          :data="tableData"
          :columns="columns"
          adaptive
          :adaptiveConfig="{ offsetBottom: 120 }"
          header-cell-class-name="table-gray-header"
          @page-size-change="getData()"
          @page-current-change="getData()"
          row-key="id || buildUUID"
          :loading="tableLoading"
        >
          <template #operation="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          </template>
        </pure-table>
      </div>
    </div>
    <PlusDialogForm
      ref="plusDialogFormRef"
      v-model:visible="popupVisible"
      v-model="popupForm"
      :form="{ columns: popupColums, rules: popupRules, labelWidth: '100px' }"
      :dialog="{
        title: '编辑检查项',
        draggable: true,
        cancelText: '取消',
        confirmText: '确定',
        top: '20vh',
      }"
      @confirm="onConfirm"
    >
      <template #plus-field-type>
        <el-radio-group v-model="popupForm.type" size="large">
          <el-radio-button :label="0">区间</el-radio-button>
          <el-radio-button :label="1">大于</el-radio-button>
          <el-radio-button :label="2">大于等于</el-radio-button>
          <el-radio-button :label="3">小于</el-radio-button>
          <el-radio-button :label="4">小于等于</el-radio-button>
          <el-radio-button :label="5">等于</el-radio-button>
          <el-radio-button :label="6">是否合格</el-radio-button>
          <el-radio-button :label="7">文本</el-radio-button>
          <el-radio-button :label="8">上下浮动（±）</el-radio-button>
        </el-radio-group>
      </template>
      <template #plus-field-value>
        <el-radio-group v-model="popupForm.value" size="large">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="0">不合格</el-radio>
        </el-radio-group>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
