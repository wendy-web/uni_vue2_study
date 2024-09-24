<script setup lang="tsx">
/* 检查表配置-列表页面 */
import { Plus } from "@element-plus/icons-vue";
import { getcheckConfigListApi } from "@/api/quality/environment/check-config";
import { CheckConfigListType } from "@/api/quality/environment/check-config/types";
import addEditConfigVue from "./components/addEditConfig.vue";

defineOptions({
  name: "EnvironmentCheckConfig",
});

const addEditConfigRef = ref<InstanceType<typeof addEditConfigVue>>();
const tableData = ref<CheckConfigListType[]>([]);
const tableLoading = ref(false);
const drawerVisible = ref(false);
const listId = ref(0);

function handleAdd() {
  drawerVisible.value = true;
}

function cellEdit(row: CheckConfigListType) {
  drawerVisible.value = true;
  listId.value = row.id;
  addEditConfigRef.value?.setData(row);
}

async function getData() {
  tableLoading.value = true;
  const result = await getcheckConfigListApi();
  tableData.value = result.data;
  tableLoading.value = false;
}

onActivated(() => {
  // 获取列表数据
  getData();
});

/** 表格列配置 */
const columns: TableColumnList = [
  {
    label: "所属表名称",
    prop: "name",
    align: "center",
  },
  {
    label: "备注",
    prop: "note",
    align: "center",
  },
  {
    label: "创建人",
    prop: "ct_name",
    align: "center",
  },
  {
    label: "创建时间",
    prop: "create_time",
    align: "center",
  },
  {
    label: "操作",
    slot: "operation",
    align: "center",
  },
];
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PureTableBar :columns="columns">
        <template #buttons>
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            v-hasPerm="['environment:checkconfig:addedit']"
          >
            新增配置
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-gray-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
          >
            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellEdit(row)"
                v-hasPerm="['environment:checkconfig:addedit']"
              >
                编辑
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <addEditConfigVue
      v-model:visible="drawerVisible"
      :listId="listId"
      @refresh="getData"
      ref="addEditConfigRef"
    ></addEditConfigVue>
  </div>
</template>
<style lang="scss" scoped></style>
