<script setup lang="ts">
import {
  getRetStockCreatApi,
  getRetStockEditApi,
  getRetStockSubmitApi,
} from "@/api/storage/ret-stocks/index";
import { checkSaveHooks } from "@/hooks";
import { useAdd } from "./utils/add";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";

const { selectProps, statusOptions } = useAdd();

interface Props {
  preTableData: any;
}

const { saveId, checkSaveFn } = checkSaveHooks();
const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {};
  },
});

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
async function handleSave() {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;

  let { id, ret_name, placeList, ...rest } = props.preTableData;

  try {
    loadingText.value = "正在保存中...";
    loading.value = true;
    const result = id
      ? await getRetStockEditApi({ id, ...rest })
      : await getRetStockCreatApi({ ...rest });
    ElMessage.success(result.msg);
    emit("aboutPre", 2);
  } finally {
    loading.value = false;
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let { ret_name, placeList, ...rest } = props.preTableData;
  const result = await getRetStockCreatApi({ ...rest });
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let { id, ret_name, placeList, ...rest } = props.preTableData;
  const result = await getRetStockEditApi({ ...rest });
  return result.data.id;
};

async function handleSubmit() {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;
  // 这里提交审核需要先保存
  let { id } = props.preTableData;
  try {
    loadingText.value = "正在提审中...";
    loading.value = true;
    let order_id = id ? await sendEditData() : await sendAddData();
    saveId.value = order_id;
    const result = await getRetStockSubmitApi({ order_id });
    ElMessage.success(result.msg);
    emit("aboutPre", 2);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">退库物资清单预览</div>
      <div class="mb-[20px]">
        <span class="inline-block text-[14px] mr-[20px]">
          入库日期：{{ preTableData.ret_time }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          退货人：{{ preTableData.ret_name || "无" }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          出库仓库：{{ preTableData.ret_wh_name }}
        </span>
      </div>
      <el-table :data="preTableData.goods" border stripe height="740" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="分类" prop="class_name" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="退库数量" prop="ret_num" />
        <el-table-column label="换下日期" min-width="90" prop="replace_time" />
        <el-table-column label="使用地点" prop="use_place_id" min-width="160">
          <template #default="{ row }">
            <el-cascader
              v-if="row.use_place_id"
              v-model="row.use_place_id"
              :options="preTableData.placeList"
              :props="selectProps"
              clearable
              filterable
              style="width: 100%"
              :disabled="true"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="可用状态" prop="available_status" min-width="90">
          <template #default="{ row }">
            <el-select
              v-model="row.available_status"
              :disabled="true"
              v-if="row.available_status >= 0"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span v-else>-</span>
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
      <div class="footer-btn mt-[20px]">
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
      <div class="pb-[10px]">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlowGlobal
          ref="approveFlowRef"
          :id="preTableData.id"
          :orderType="4"
          :wh-id="preTableData.ret_wh_id"
          :max-height="140"
        ></ApproveFlowGlobal>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
