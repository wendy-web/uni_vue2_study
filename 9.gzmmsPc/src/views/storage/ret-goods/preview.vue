<script setup lang="ts">
/* 其他出库预览页 */
// 引入api
import { addRetGoodsApi, editRetGoodsApi, submitRetGoodsApi } from "@/api/storage/ret-goods";
import { IRetGoodsAddInfo } from "@/api/storage/ret-goods/types";
import { checkSaveHooks } from "@/hooks";
import { useColumns } from "./utils/hook";

export interface Props {
  preTableData: IRetGoodsAddInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IRetGoodsAddInfo;
  },
});

const emit = defineEmits(["aboutPre"]);
const { importColumns, directColumns } = useColumns();

const { saveId, checkSaveFn } = checkSaveHooks();

const loading = ref(false);
const loadingText = ref("");
const tableColumns = computed(() => {
  return props.preTableData.type === 1 ? importColumns : directColumns;
});

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

  try {
    loadingText.value = "正在保存中...";
    loading.value = true;
    const result = id ? await editRetGoodsApi(data) : await addRetGoodsApi(data);
    ElMessage.success(result.msg);
    emit("aboutPre", 2);
  } finally {
    loading.value = false;
  }
};

function getQueryData() {
  let { id, ...rest } = props.preTableData;
  if (id) {
    // id存在 表示是编辑
    return {
      id,
      ...rest,
    };
  } else {
    return {
      ...rest,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addRetGoodsApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editRetGoodsApi(data);
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
      const result = await submitRetGoodsApi({ id });
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
      const result = await submitRetGoodsApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">其他出库单预览</div>
      <div class="mb-[20px]">
        <span class="inline-block text-[14px] mr-[20px]">
          出库类型:{{ preTableData.type === 1 ? '冲销出库' : '其他出库' }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]" v-if="preTableData.procure_no">
          采购单号:{{ preTableData.procure_no }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]" v-if="preTableData.return_time">
          退货日期:{{ preTableData.return_time }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]" v-if="preTableData.out_wh_name">出库仓库:{{ preTableData.out_wh_name }}</span>
        <span class="inline-block text-[14px] mr-[20px]">出库日期:{{ preTableData.out_time }}</span>
      </div>
      <pure-table
        :data="preTableData.goods"
        :columns="tableColumns"
        border
        stripe
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        height="900"
        scrollbar-always-on
      ></pure-table>

      <div class="mt-[20px]">
        <div>
          <span class="text-primary">备注: {{ preTableData.note || "无" }}</span>
        </div>
        <div>
          <span class="text-primary">附件: {{ preTableData.file_info.name || "无" }}</span>
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

<style scoped lang="scss"></style>
