<script setup lang="ts">
import type { FieldValues } from "plus-pro-components";
import { useRouter } from "vue-router";
import {
  getBaseValSettingApi,
  saveBaseValSettingApi,
} from "@/api/quality/standard-config/material/index";
import { BaseValSetModule } from "@/api/quality/standard-config/material/types";
import Tree from "./components/tree.vue";
import { useList } from "./utils/hook";

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

defineOptions({
  name: "StandardConfigMaterial",
});
const router = useRouter();

/** 搜索表单的绑定值 */
const formData = ref({
  brand: "ND1",
  item: 1, // 类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告 8、战马空罐检验报告 9、原材料使用通知单
  sku: "ND1-1", // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
});

const treeRef = ref<InstanceType<typeof Tree>>();
const treeCheckedKeys = ref<number[]>([1, 3]);
const prueTableRef = ref();
const tableLoading = ref(false);

// sku选中的tab索引
const skuTabIndex = ref(0);
// 默认选中的sku
const skuTabDefault = ref<number | string>("ND1-1");
/** 表格内容 */
const tableData = ref<BaseValSetModule.BaseValSetData[]>([]);
//动态获取sku的tab
const skuTabList: any = computed(() => {
  // 区分热缩膜和其他的类型 sku展示不同
  let skuList = brandTabList.filter((item) => item.key === formData.value.brand)[0].skuList || [];
  // 热缩膜:过滤含有ND的key
  if (formData.value.item === 4) {
    skuList = skuList.filter((item) => String(item.key).indexOf("ND") < 0);
  } else {
    // 其他的item 只保留ND
    skuList = skuList.filter((item) => String(item.key).indexOf("ND") > -1);
  }
  if (skuList.length > 0) {
    skuTabDefault.value = skuList[0].key;
  }
  return skuList;
});
// 弹窗表单
const plusDialogFormRef = ref();
const checkValue = ref<number[]>([1]);
function onTreeSelect(val: number[]) {
  formData.value.item = val[0];
  popupForm.value.item = val[0];
  getData();
}

function skuClick({ index, props }: any) {
  skuTabIndex.value = index;
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
  if (value !== null && value !== "") {
    popupForm.value.value = value;
    // checkValue.value = [value];
  } else {
    // checkValue.value = [1];
    popupForm.value.value = 1;
  }
  popupVisible.value = true;
};
async function getData() {
  try {
    let { ...rest } = formData.value;
    let data = {
      ...rest,
      workshop: Number(formData.value.item) === 4 ? quantifyTabIndex.value : '',
    };
    tableLoading.value = true;
    const result = await getBaseValSettingApi(data);
    result.data.forEach((item) => {
      item.expression = initExpression(item);
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
  let { ...rest } = popupForm.value;
  let data = {
    ...rest,
    workshop: Number(formData.value.item) === 4 ? quantifyTabIndex.value : 0,
  };
  // data.value = null;
  // if (checkValue.value.length > 0) {
  //   data.value = checkValue.value[0];
  // }
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

// 点击定量项目
function quantifyClick({ index, props }: any) {
  let { label, name } = props;
  quantifyTabIndex.value = name;
  quantifySelectName.value = label;
  //更新配置数据
  getData();
}

onActivated(() => {
  getData();
  // prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container flex">
    <Tree
      class="min-w-[200px] mr-[10px]"
      :treeData="treeData"
      :treeCheckedKeys="treeCheckedKeys"
      @tree-select="onTreeSelect"
      ref="treeRef"
    ></Tree>
    <div class="w-[calc(100%-220px)]">
      <div class="app-card">
        <el-tabs type="border-card" @tab-click="brandClick">
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
              <el-tabs
                v-if="Number(formData.item) === 4"
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
          row-key="id"
          :loading="tableLoading"
        >
          <template #operation="{ row }">
            <!-- <el-button type="primary" link @click="handleDetail(row)">详情</el-button> -->
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
        <!-- <el-checkbox-group v-model="checkValue" :max="1">
          <el-checkbox :label="1" >合格</el-checkbox>
          <el-checkbox :label="0" >不合格</el-checkbox>
        </el-checkbox-group> -->
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
