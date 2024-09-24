<script setup lang="ts">
import { IOrderAddTable } from "@/api/buy/order/types";
// 引入创建和编辑的api
import { addSwapApi, editSwapApi } from "@/api/buy/swap";
import { checkSaveHooks } from "@/hooks";
import { INewRefundGoods } from "../utils/types";
import type { ISwaoPreInfo } from "../utils/types";

interface IPreProps {
  preTableData: ISwaoPreInfo;
}

const props = withDefaults(defineProps<IPreProps>(), {
  preTableData: () => {
    return {} as ISwaoPreInfo;
  },
});
const emit = defineEmits(["aboutPre"]);

const { saveId, checkSaveFn } = checkSaveHooks();

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
    // id存在 表示是编辑
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await editSwapApi(data);
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
      const result = await addSwapApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let { id, refundGoods, buyGoods, procure_no, file_info, note, replacement_data } =
    props.preTableData;
  return {
    id: id || undefined,
    procure_no,
    replacement_data,
    note,
    file_info,
    return_goods: changeRefundGoods(refundGoods),
    replacement_goods: changeBuyGoods(buyGoods),
  };
  // if (id) {
  //   // id存在 表示是编辑
  //   return {
  //     id,
  //     note,
  //     file_info,
  //     // goods,
  //   };
  // } else {
  //   // id不存在是新建
  //   return {
  //     procure_no,
  //     replacement_data,
  //     note,
  //     file_info,
  //     return_goods: changeRefundGoods(refundGoods),
  //     replacement_goods: changeBuyGoods(buyGoods),
  //   };
  // }
}

function changeRefundGoods(refundGoods: INewRefundGoods[]) {
  let list = refundGoods.map((item) => {
    let { goods_id, dept_id, return_num, supplier_id, note, procure_goods_id } = item;
    return {
      goods_id,
      dept_id,
      return_num,
      supplier_id,
      note,
      procure_goods_id,
    };
  });
  return list;
}

function changeBuyGoods(buyGoods: IOrderAddTable[]) {
  let list = buyGoods.map((item) => {
    let {
      goods_id,
      dept_id,
      price,
      num,
      supplier_id,
      submit_time,
      delivery_time,
      contract_no,
      note,
    } = item;
    return {
      goods_id,
      dept_id,
      price,
      num,
      supplier_id,
      submit_time,
      delivery_time,
      contract_no,
      note,
    };
  });
  return list;
}
</script>
<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">采购换货单预览</div>
      <div class="mb-[10px]">
        <span class="inline-block text-[14px] mr-[20px]">
          采购单号:{{ preTableData.procure_no }}
        </span>
      </div>
      <div class="mb-[20px]">
        <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold">
          退回商品
        </el-tag>
        <el-divider />
        <el-table
          :data="preTableData.refundGoods"
          border
          stripe
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          class="min-h-[380px]"
        >
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" />
          <el-table-column label="名称" prop="title" />
          <el-table-column label="规格型号" prop="spec" />
          <el-table-column label="品牌" prop="brand" />
          <el-table-column label="分类" prop="class_name" />
          <el-table-column label="单位" prop="measure_name" />
          <el-table-column label="退货数量" prop="return_num" />
          <el-table-column label="供应商" prop="sup_name" />
          <el-table-column label="备注" prop="note" />
        </el-table>
      </div>

      <div>
        <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold">
          换货商品
        </el-tag>
        <el-divider />
        <el-table
          :data="preTableData.buyGoods"
          border
          stripe
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          class="min-h-[380px]"
        >
        <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" />
          <el-table-column label="名称" prop="title" />
          <el-table-column label="规格型号" prop="spec" />
          <el-table-column label="品牌" prop="brand" />
          <el-table-column label="分类" prop="class_name" />
          <el-table-column label="单位" prop="measure_name" />
          <el-table-column label="采购数量" prop="num" />
          <el-table-column label="采购单价" prop="price" />
          <el-table-column label="小计" prop="sub_total" />
          <el-table-column label="供应商" prop="sup_name" />
          <el-table-column label="交货期" prop="delivery_time" />
          <el-table-column label="合同号" prop="contract_no" />
          <el-table-column label="备注" prop="note" />
        </el-table>
      </div>
      <!-- <div class="mt-[20px]">合计: {{ totalPrice }}元</div> -->
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
        <!-- <el-button type="primary" plain @click="handleSubmit" class="w-[100px]" size="large">
        提交审核
      </el-button> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/index.scss";
</style>
