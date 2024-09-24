<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">采购单预览</div>
      <el-table
        :data="preTableData.goods"
        border
        stripe
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        height="800"
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
      <div class="mt-[20px]">合计: {{ totalPrice }}元</div>
      <div class="mt-[20px]">
        <div>
          <span>采购事由: {{ preTableData.purpose || "无" }}</span>
        </div>
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

<script setup lang="ts">
// 引入创建和编辑的api
import { addOrderApi, editOrderApi, submitOrderApi } from "@/api/buy/order/index";
import { IOrderPreInfo } from "@/api/buy/order/types";
import { checkSaveHooks, sendEmailHooks } from "@/hooks";

interface Props {
  preTableData: IOrderPreInfo;
}

const { sendMail } = sendEmailHooks();
const { saveId, checkSaveFn } = checkSaveHooks();

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IOrderPreInfo;
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
  loading.value = true;
  if (id) {
    // id存在 表示是编辑
    try {
      const result = await editOrderApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  } else {
    // id不存在是新建
    try {
      const result = await addOrderApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let { id, goods, file_info, note, purpose, demand_date } = props.preTableData;
  let tableData = goods.map((item) => {
    let { sub_total, ...rest } = item;
    return rest;
  });
  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      goods: tableData,
      purpose,
      demand_date
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      goods: tableData,
      purpose,
      demand_date
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addOrderApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editOrderApi(data);
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
      const result = await submitOrderApi({ id });
      ElMessage.success(result.msg);
      if (result.data.status === 2) {
        sendMail(id);
      }
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
      const result = await submitOrderApi({ id });
      ElMessage.success(result.msg);
      if (result.data.status === 2) {
        sendMail(id);
      }
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};

//计算对象数组中某个属性合计
function countTotal(arr: any[], keyName: string) {
  let $total = 0;
  $total = arr.reduce(function (total, currentValue) {
    return currentValue[keyName] ? total + parseFloat(currentValue[keyName]) : total;
  }, 0);

  return $total.toFixed(2);
}

const totalPrice = computed(() => {
  return countTotal(props.preTableData.goods, "sub_total");
});
</script>

<style scoped lang="scss"></style>
