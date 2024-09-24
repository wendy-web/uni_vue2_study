<script setup lang="ts">
import type { PaginationProps } from "@pureadmin/table";
import type { IdNameType } from "@/api/device/common/types";
import { getCountLogApi } from "@/api/device/inspection/meter-count/index";
import type { meterCountLogItem } from "@/api/device/inspection/meter-count/types";

const model = defineModel({ required: true, default: false });

interface Props {
  list: IdNameType[];
  detailInfo: {
    watch_id: number;
    bar_title: string;
    asset_no: string;
    save_addr_text: string;
    rel_id: number;
  };
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  detailInfo: () => ({
    watch_id: 0,
    bar_title: "",
    asset_no: "",
    save_addr_text: "",
    rel_id: 0,
  }),
});
const tableList = ref<meterCountLogItem[]>([]);
const detailLoading = ref(false);

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
  pageSizes: [10, 20, 40, 50],
});

async function getData() {
  let data = {
    watch_id: props.detailInfo.watch_id,
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
  detailLoading.value = true;
  const result = await getCountLogApi(data);
  detailLoading.value = false;
  tableList.value = result.data.list;
  pagination.total = result.data.total;
}

watch(
  () => props.detailInfo?.watch_id,
  (newVal) => {
    if (newVal) {
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
    prop: "rel_id",
    valueType: "select",
    options: computed(() => {
      return props.list.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }),
  },
];

const columns: TableColumnList = [
  {
    label: "时间",
    prop: "update_time",
    align: "center",
  },
  {
    label: "读数",
    prop: "num",
    align: "center",
  },
];
</script>
<template>
  <div class="detail-container" v-loading="detailLoading">
    <el-drawer title="读数明细" v-model="model" direction="rtl" size="60%">
      <PlusDescriptions :column="2" :columns="detailColumns" :data="detailInfo" />
      <pure-table
        class="mt-6"
        ref="prueTableRef"
        header-cell-class-name="table-gray-header"
        :data="tableList"
        :columns="columns"
        :pagination="pagination"
        @page-size-change="getData()"
        @page-current-change="getData()"
      ></pure-table>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>
