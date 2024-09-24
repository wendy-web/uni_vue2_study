<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues } from "plus-pro-components";
// 引入公共接口：定量项目下拉列表
import { getQuantifyMapApi } from "@/api/quality/common/index";
import {
  getBaseValSettingApi,
  saveBaseValSettingApi,
} from "@/api/quality/standard-config/material/index";
import { BaseValSetModule } from "@/api/quality/standard-config/material/types";
import Tree from "./components/tree.vue";
import { useList } from "./utils/hook";

/* 成品检验配置页面 */
defineOptions({
  name: "StandardConfigFinished",
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
  quantifyMap,
  quantifySelectName,
  quantifyTabIndex,
} = useList();
/** 搜索表单的绑定值 */
const formData = ref({
  brand: "ND1",
  item: 10, // 类型  10、液体糖检验报告 11、成品糖酸检测报告 12、理化及微生物检验报告 13、pH和成分分析检验单 14、成品卷封检验报告 15、成品标签标识报告 16、成品二维码确认单 17、红牛成品检验结果 18、战马成品检验结果 19、成品发货通知单 21、定量项目检测
  sku: "ND1-1", // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
  pro: "", // 定量项目传参 name 项目名称
});
const treeRef = ref<InstanceType<typeof Tree>>();
const currentTreeId = ref(10);
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
  // 特殊处理：21:先获取定量项目下拉列表
  if (val[0] === 21) {
    initQuantifyTabs();
    return;
  }
  // 其它选项无需特殊处理
  getData();
}
// 点击sku:产品类型
function skuClick({ index, props }: any) {
  formData.value.sku = skuTabList.value[index].key;
  popupForm.value.sku = skuTabList.value[index].key;
  getData();
}
// 点击定量项目
function quantifyClick({ index, props }: any) {
  let { label, name } = props;
  quantifyTabIndex.value = name;
  quantifySelectName.value = label;
  //更新配置数据
  getData();
}
// 点击品牌
function brandClick({ index, props }: any) {
  formData.value.brand = brandTabList[index].key;
  formData.value.sku = skuTabList.value[0].key;
  skuTabDefault.value = skuTabList.value[0].key;
  // 如果是定量项目,更新定量项目下拉列表
  if (formData.value.item === 21) {
    initQuantifyTabs();
    return;
  }
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
// 初始化定量项目下拉列表（tab选项卡）
async function initQuantifyTabs() {
  let { brand } = formData.value;
  let params = {
    is_open: 1,
    brand,
  };
  try {
    const result = await getQuantifyMapApi(params);
    // 按id排序
    if (result.data.length) {
      result.data.sort((a: any, b: any) => a.id - b.id);
      quantifySelectName.value = result.data[0].name;
      quantifyTabIndex.value = result.data[0].id;
    }
    quantifyMap.value = result.data;
    getData();
  } catch (error) {
    console.log("获取定量项目下拉选项失败", error);
  }
}
// 获取配置列表数据
async function getData() {
  try {
    let { item, ...rest } = formData.value;
    let params: any = {
      item,
      ...rest,
    };
    // item:10 液体糖检验配置只传item
    if (item == 10) {
      params = {
        item:10
      }
    }
    // item:21 定量项目的传参需要特殊处理
    if (item == 21) {
      params.pro = quantifySelectName.value;
    }
    tableLoading.value = true;
    const result = await getBaseValSettingApi(params);
    result.data.forEach((item) => {
      item.expression = initExpression(item);
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
  // 如果是定量项目，需要传参pro
  if (item == 21) {
    data.pro = quantifySelectName.value;
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
        <!-- item:10 液体糖不显示tab -->
        <el-tabs v-if="Number(formData.item) !== 10" type="border-card" @tab-click="brandClick">
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
              <!-- 定量项目tab,item=21显示 -->
              <el-tabs
                v-if="Number(formData.item) === 21"
                @tab-click="quantifyClick"
                v-model="quantifyTabIndex"
              >
                <template v-for="(item, index) of quantifyMap" :key="item.id">
                  <el-tab-pane :label="item.name" :name="item.id">
                    <template #label>
                      <span>
                        {{ item.name }}
                      </span>
                    </template>
                  </el-tab-pane>
                </template>
              </el-tabs>
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
