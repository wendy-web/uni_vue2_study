<script setup lang="ts">
import type { PaginationProps } from "@pureadmin/table";
import { AxiosPromise } from "axios";
import { electricMeterReadDetailsApi } from "@/api/energy/electric-meter/gather/index";
import { steamMeterReadDetailsApi } from "@/api/energy/steam-meter/gather/index";
import { waterMeterReadDetailsApi } from "@/api/energy/water-meter/gather/index";

const model = defineModel({ required: true, default: false });

interface Props {
  orderType: number;
  info: {
    id: number;
    bar_title: string;
    asset_no: string;
    save_addr_text: string;
    rel_id: number;
  };
}
const props = withDefaults(defineProps<Props>(), {
  orderType: 1, //0电表 1水表 2蒸汽表
  info: () => ({
    id: 0,
    bar_title: "",
    asset_no: "",
    save_addr_text: "",
    rel_id: 0,
  }),
});
const tableList = ref<any[]>([]);
const detailLoading = ref(false);

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
  pageSizes: [10, 20, 40, 50],
  align: "left",
});

async function getData() {
  let data = {
    id: props.info.id,
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
  detailLoading.value = true;

  let requestAPI: (data: {}) => AxiosPromise = waterMeterReadDetailsApi;
  if (props.orderType === 1) {
    // 如果是水表
    requestAPI = waterMeterReadDetailsApi;
  } else if (props.orderType === 2) {
    // 如果是蒸汽表
    requestAPI = steamMeterReadDetailsApi;
  } else if (props.orderType === 0) {
    // 如果是电表
    requestAPI = electricMeterReadDetailsApi;
  }
  const result = await requestAPI(data);
  detailLoading.value = false;
  if (props.orderType === 0) {
    // 如果是电表时,数据格式不同
    tableList.value = result.data.list.record_list;
  } else {
    tableList.value = result.data.list;
  }

  pagination.total = result.data.total;
}

function clickColse() {
  model.value = false;
}

watch(
  () => model.value,
  (newVal) => {
    console.log("🚀 ~ newVal:", newVal);
    if (newVal && props.info?.id) {
      pagination.currentPage = 1
      getData();
    }
  },
);

const detailColumns: PlusColumnList = [
  {
    label: "资产名称",
    prop: "bar_title",
  },
  {
    label: "设备编码",
    prop: "asset_no",
  },
  {
    label: "使用位置",
    prop: "save_addr_text",
  },
  {
    label: "绑定关系",
    prop: "rel_name",
  },
];

const columns: TableColumnList = [
  {
    label: "采集时间",
    prop: "update_time",
    align: "center",
  },
  {
    label: "表码数",
    prop: "num",
    align: "center",
  },
];
</script>
<template>
  <div class="detail-container" v-loading="detailLoading">
    <el-drawer title="读数明细" v-model="model" direction="rtl" size="60%">
      <PlusDescriptions :column="2" :columns="detailColumns" :data="info" />
      <pure-table
        class="mt-6"
        ref="prueTableRef"
        header-cell-class-name="table-gray-header"
        :data="tableList"
        :columns="columns"
        :pagination="pagination"
        adaptive
        :adaptiveConfig="{ offsetBottom: 140 }"
        @page-size-change="getData()"
        @page-current-change="getData()"
      ></pure-table>
      <template #footer>
        <div class="flex items-start">
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            关闭
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>
