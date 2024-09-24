<!-- 退料入库单预览页 -->
<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">退料入库单预览</div>
      <div class="mb-[20px]">
        <span class="inline-block text-[14px] mr-[20px]">
          领料出库单号:{{ preTableData.wh_rec_no }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">入库日期:{{ preTableData.in_time }}</span>
      </div>
      <el-table :data="preTableData.goods" border stripe height="900" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="批次/日期" prop="ph_no" />
        <el-table-column label="入库仓库" prop="warehouse_name" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="入库数量" prop="rec_num" />
        <el-table-column label="库位" prop="ws_code" />
        <el-table-column label="单价" prop="price" />
        <el-table-column label="入库日期" prop="in_wh_date" />
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

<script setup lang="ts">
// 引入类型
// 引入创建和编辑的api
import { addRetSupInApi, editRetSupInApi, submitRetSupInApi } from "@/api/storage/ret-supplier";
import { IRetSupInAddInfo } from "@/api/storage/ret-supplier/types";
import { checkSaveHooks } from "@/hooks";

export interface Props {
  preTableData: IRetSupInAddInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IRetSupInAddInfo;
  },
});

const { saveId, checkSaveFn } = checkSaveHooks();

const emit = defineEmits(["aboutPre"]);

const loading = ref(false);
const loadingText = ref("");

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
      const result = await editRetSupInApi(data);
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
      const result = await addRetSupInApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let { id, goods, file_info, note, in_time } = props.preTableData;
  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      goods,
      in_time,
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      goods,
      in_time,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addRetSupInApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editRetSupInApi(data);
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
      const result = await submitRetSupInApi({ id });
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
      const result = await submitRetSupInApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};
</script>

<style scoped lang="scss"></style>
