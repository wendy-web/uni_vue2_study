<script setup lang="ts">
/* 本组件为: 仓库确认发料显示弹窗 */
// 引入确认发料api
import { approveGetSupWhApi } from "@/api/storage/get-supplier/index";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/store/modules/settings";
const settingStore = useSettingsStore();
interface Props {
  visible: boolean;
  data: any[];
  listId: number;
  qrcodeUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => [],
  listId: 0,
  qrcodeUrl: "",
});

let emits = defineEmits(["update:visible", "confirmGive"]);
const visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    giveStatus.value = false;
    emits("update:visible", false);
  },
});
/** 记录发料是否成功 */
const giveStatus = ref(false);
/** 记录发料按钮是否loading */
const btnLoading = ref(false);

// 点击确认发料
const tapConfirm = async () => {
  let goods = props.data.map((item) => {
    return {
      id: item.id,
      material_issue_num: item.this_num,
      goods_id: item.goods_id,
      goods_all_id: item.goods_all_id,
    };
  });
  console.log("🚀 ~ file: confirmGive.vue:35 ~ goods ~ goods:", goods);
  try {
    btnLoading.value = true;
    const result = await approveGetSupWhApi({ id: props.listId, goods });
    ElMessage.success(result.msg);
    giveStatus.value = true;
    emits("confirmGive");
  } finally {
    btnLoading.value = false;
  }
};
const url = ref(props.qrcodeUrl);
const qrcode_url = computed(() => {
  return settingStore.baseHttp + url.value;
});

watch(
  () => props.qrcodeUrl,
  (newValue) => {
    console.log("🚀 ~ file: confirmGive.vue:66 ~ newValue:", newValue)
    
    if (newValue) {
      url.value = newValue;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <el-dialog v-model="visibleDialog" title="仓库发料出库信息" width="60%" draggable>
      <div class="mb-[20px] flex justify-between pr-[20px]" v-if="giveStatus">
        <div flex>
          <i-ep-CircleCheck class="text-green-500 text-2xl mr-[10px]"></i-ep-CircleCheck>
          <span class="text-lg">发料成功</span>
        </div>
        <div class="flex flex-col items-center" v-if="url">
          <el-image :src="qrcode_url" class="w-[80px] h-[80px]">
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <p class="font-bold">领取人扫码确认</p>
        </div>
      </div>
      <el-table
        :data="data"
        border
        stripe
        header-cell-class-name="table-row-header"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="条码" prop="barcode"></el-table-column>
        <el-table-column label="名称" prop="title"></el-table-column>
        <el-table-column label="规格型号" prop="spec"></el-table-column>
        <el-table-column label="批次/日期" prop="ph_no"></el-table-column>
        <el-table-column label="单位" prop="measure_name"></el-table-column>
        <el-table-column label="出库仓库" prop="warehouse_name"></el-table-column>
        <el-table-column label="使用地点" prop="use_places"></el-table-column>
        <el-table-column label="申请数量" prop="rec_num"></el-table-column>
        <el-table-column label="已发数量" prop="issue_num"></el-table-column>
        <el-table-column label="本次发料" prop="this_num">
          <template #default="{ row, $index }">
            <span class="text-lg text-orange-500 font-bold">{{ row.this_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发料状态" prop="rec_num">
          <template #default="{ row, $index }">
            <span v-if="row.issuance_status == 1">部分发料</span>
            <span v-else-if="row.issuance_status == 2">全部发料</span>
            <span v-else>待发料</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="flex justify-center mt-10">
          <el-button
            @click="visibleDialog = false"
            size="large"
            class="w-[100px]"
            v-if="giveStatus"
          >
            关闭
          </el-button>
          <el-button type="primary" @click="tapConfirm" size="large" :loading="btnLoading" v-else>
            确认发料
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding-top: 4px;
}
</style>
