<script setup lang="ts">
import { addSplitApi, editSplitApi, submitSplitApi } from "@/api/storage/split/index";
import { checkSaveHooks } from "@/hooks";
import type { goodsType, preInfoType } from "../utils/types";

const { saveId, checkSaveFn } = checkSaveHooks();
const props = defineProps({
  preTableData: {
    type: Object as PropType<preInfoType>,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(["aboutPre"]);

const loading = ref(false);
const loadingText = ref("正在保存中");

// 点击返回列表
const handleList = () => {
  emit("aboutPre", 4);
};

// 点击上一步
const handleBack = () => {
  emit("aboutPre", 1);
};
// 点击保存
const handleSave = async () => {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;

  let { id } = props.preTableData;
  let data = getQueryData();

  if (id) {
    //id存在 表示是编辑
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await editSplitApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  } else {
    // id不存在是新建
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await addSplitApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addSplitApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editSplitApi(data);
  return result.data.id;
};

// 点击提交审核
const handleSubmit = async () => {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;
  // 这里提交审核需要先保存
  let { id } = props.preTableData;
  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在提审中...";
      loading.value = true;
      let id = await sendEditData();
      saveId.value = id;
      const result = await submitSplitApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  } else {
    // id不存在是新建
    try {
      loadingText.value = "正在提审中...";
      loading.value = true;
      let id = await sendAddData();
      saveId.value = id;
      const result = await submitSplitApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let {
    id,
    goods,
    file_info,
    note,
    warehouse_id,
    split_date: split_assemble_time,
  } = props.preTableData;

  let before_num = countNum(goods, "num");
  let after_num = countNum(goods, "assemble_goods", "num");

  let list = goods.map((item) => {
    let arr = changeGoods(item);
    return arr;
  });

  let data = {
    id,
    before_goods: list,
    file_info,
    note,
    warehouse_id,
    split_assemble_time,
    before_num,
    after_num,
  };
  return id
    ? data
    : {
        before_goods: list,
        file_info,
        note,
        warehouse_id,
        split_assemble_time,
        before_num,
        after_num,
      };
}

// 将goods数组数据转换为后端要的格式
function changeGoods(item: goodsType) {
  console.log("item", item);
  let warehouse_id = props.preTableData.warehouse_id;
  let { goods_id, batch_number, num: split_assemble_num, note, assemble_goods, stock_id } = item;
  return {
    goods_id,
    batch_number,
    warehouse_id,
    split_assemble_num,
    note,
    stock_id,
    after_goods: {
      goods_id: assemble_goods.goods_id,
      batch_number: "",
      split_assemble_num: assemble_goods.num,
    },
  };
}

//计算数量
function countNum(arr: any[], keyName: string, lastName?: string) {
  let $total = 0;
  if (lastName) {
    $total = arr.reduce(function (total, currentValue) {
      return currentValue[keyName][lastName]
        ? total + parseFloat(currentValue[keyName][lastName])
        : total;
    }, 0);
  } else {
    $total = arr.reduce(function (total, currentValue) {
      return currentValue[keyName] ? total + parseFloat(currentValue[keyName]) : total;
    }, 0);
  }
  return $total;
}
</script>
<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">拆装单预览</div>
      <div class="mb-[20px] text-[14px] flex items-center">
        <div class="mr-[20px]">
          <span>拆装仓库：</span>
          <span class="font-bold">{{ preTableData.split_wh_name }}</span>
        </div>
        <span class="inline-block text-[14px] mr-[20px]">
          拆装日期：{{ preTableData.split_date }}
        </span>
      </div>
      <el-table
        :data="preTableData?.goods"
        border
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        height="900"
      >
        <el-table-column class-name="bottom-column" width="100">
          <template #default="scope">
            <div class="h-[40px]">
              <span>大包装规格</span>
            </div>
            <div class="top-border">
              <span>拆零规格</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="条码" prop="barcode" class-name="bottom-column" width="120">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.barcode || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.barcode }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          prop="title"
          class-name="bottom-column"
          width="140"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.title || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="规格型号"
          prop="spec"
          class-name="bottom-column"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.spec || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.spec || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.brand || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.brand || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="批次/日期" prop="batch_number" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.batch_number || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.batch_number || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="measure_name" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.measure_name || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.measure_name || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="num" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.num || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.num || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关系" prop="relation" width="140" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]"><span>1</span></div>
            <div class="top-border">
              <span>{{ "1: " + scope.row.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库位" prop="ws_code" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.ws_code || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.ws_code || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" prop="in_wh_date" class-name="bottom-column" width="120">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.in_wh_date || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.in_wh_date || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price" class-name="bottom-column">
          <template #default="scope">
            <div class="h-[40px]">
              <span>{{ scope.row.price || "-" }}</span>
            </div>
            <div class="top-border">
              <span>{{ scope.row.assemble_goods.price || "-" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note" />
      </el-table>
      <div class="mt-[20px]">
        <div>
          <span>备注: {{ preTableData.note || "无" }}</span>
        </div>
        <div>
          <span>附件: {{ preTableData.file_info.name || "无" }}</span>
        </div>
      </div>
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button @click="handleList" class="w-[100px]" size="large">返回列表页</el-button>
        <el-button @click="handleBack" type="primary" plain class="w-[100px]" size="large">
          上一步
        </el-button>
        <el-button type="primary" @click="handleSave" class="w-[100px]" size="large">
          保存
        </el-button>
        <el-button type="primary" plain @click="handleSubmit" class="w-[100px]" size="large">
          提交审核
        </el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/split.scss";
</style>
