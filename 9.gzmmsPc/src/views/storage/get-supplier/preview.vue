<!-- 领料出库单预览页 -->
<script setup lang="ts">
// 引api
import { addGetSupApi, editGetSupApi, submitGetSupApi } from "@/api/storage/get-supplier";
import { IGetSupInfo } from "@/api/storage/get-supplier/types";
import { checkSaveHooks } from "@/hooks";
import assignFlow from "./components/assignFlow.vue";

export interface Props {
  preTableData: IGetSupInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IGetSupInfo;
  },
});
// 地点级联选择器的配置
const selectProps = {
  // 显示方式
  expandTrigger: "hover" as const,
  emitPath: false,
  value: "id",
  label: "place_name",
  children: "children",
  multiple: true,
};
console.log(props.preTableData);

const emit = defineEmits(["aboutPre"]);

const { saveId, checkSaveFn } = checkSaveHooks();

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
      const result = await editGetSupApi(data);
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
      const result = await addGetSupApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
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
    out_time,
    rp_uid,
    ar_uid,
    ap_uid,
    rec_type,
    warehouse_id,
    warehouse_name,
  } = props.preTableData;

  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      goods,
      out_time,
      rp_uid,
      ar_uid,
      ap_uid: ap_uid || -1,
      rec_type,
      warehouse_id,
      warehouse_name,
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      goods,
      out_time,
      rp_uid,
      ar_uid,
      ap_uid: ap_uid || -1,
      rec_type,
      warehouse_id,
      warehouse_name,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addGetSupApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editGetSupApi(data);
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
      const result = await submitGetSupApi({ id });
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
      const result = await submitGetSupApi({ id });
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
      <div class="header-title">领料出库单预览</div>
      <div class="mb-[20px]">
        <span class="inline-block text-[14px] mr-[20px]">
          出库仓库：{{ preTableData.warehouse_name }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          出库日期：{{ preTableData.out_time }}
        </span>
        <!-- <span class="inline-block text-[14px] mr-[20px]">
          领料人:{{ preTableData.receiver_name || "无" }}
        </span> -->
        <span class="inline-block text-[14px] mr-[20px]">
          领料申请人：{{ preTableData.rp_uname || "无" }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          指定领取人：{{ preTableData.ar_uname || "无" }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          指定审批人：{{ preTableData.ap_uname || "无" }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">
          领料类型：{{ preTableData.rec_type_name || "无" }}
        </span>
      </div>
      <el-table :data="preTableData.goods" border stripe height="660" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="分类" prop="class_name" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="申领数量" prop="rec_num" />
        <el-table-column label="批次/日期" prop="ph_no" />
        <el-table-column label="出库仓库" prop="warehouse_name" />
        <el-table-column label="使用地点" prop="use_place_id">
          <template #default="{ row }">
            <el-cascader
              v-if="row.use_place_id.length"
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
        <el-table-column label="入库日期" min-width="90" prop="in_wh_date" />
        <el-table-column label="库位" prop="ws_code" min-width="90" />
        <el-table-column label="生产日期" prop="pro_time" min-width="90" />
        <el-table-column label="到期日期" prop="exp_time" min-width="90" />
        <!-- <el-table-column label="领料状态" prop="sup_name" /> -->
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
      <div class="mt-[20px]">
        <el-divider />
        <!-- 流程组件 -->
        <assignFlow
          :id="preTableData.id"
          :warehouseIds="preTableData.goodsWarehouseId"
          :type="2"
          :arUname="preTableData.ar_uname_list"
          :apUname="preTableData.ap_uname"
        ></assignFlow>
        <el-divider />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
