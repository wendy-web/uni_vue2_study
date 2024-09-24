<template>
  <div class="app-container">
    <div class="search-card">
      <el-form :model="formData" ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="名称" prop="keyword">
          <el-input
            v-model="formData.keyword"
            placeholder="请输入名称"
            @keyup.enter.native="handleEnterSearch"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search" v-deBounce>查询</el-button>
          <el-button :icon="Refresh" @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="success" :icon="Plus" class="mb-[10px]" @click="handleAdd">
            新建供应商
          </el-button>
          <!-- <el-button type="primary" class="mb-[10px]">
            <template #icon>
              <svg-icon icon-class="import"></svg-icon>
            </template>
            导入供应商
          </el-button> -->
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="(size as any)"
            adaptive
            :adaptiveConfig="adaptiveConfig"
            :max-height="maxHeight"
          >
            <template #operation="scope">
              <el-button type="primary" link :icon="Edit" @click="cellEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" link :icon="Delete" @click="cellDel(scope.row)">
                删除
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="formData.page"
        v-model:limit="formData.size"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "SupplierManageList",
};
</script>

<script setup lang="ts">
import { Search, Refresh, Plus, Edit, Delete } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { useThrottleFn } from "@vueuse/core";

// 导入api
import { getGoodsListApi, delSupplierApi } from "@/api/buy/sup/index";
import { ISupItem, IQuery } from "@/api/buy/sup/types";
import { isLastPage } from "@/utils/lastPage";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useOrderList } from "./utils/hook";
import { useAdaptiveConfig } from "@/hooks/table";

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns } = useOrderList();
const state = reactive({
  formData: {
    keyword: "",
    page: 1,
    size: 10,
  } as IQuery,
  tableData: [] as ISupItem[],
  tableLoading: false,
  total: 1,
});
const { formData, tableData, tableLoading, total } = toRefs(state);
const form = ref<FormInstance>();

const emit = defineEmits(["aboutList"]);

// 请求数据
const getData = async () => {
  try {
    tableLoading.value = true;
    let data = formData.value;
    const result = await getGoodsListApi(data);
    tableData.value = result.data.list;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
};

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击新建供应商 显示新建组件
const handleAdd = () => {
  console.log("点击新建");
  emit("aboutList", 1);
};

// 单元格点击编辑
const cellEdit = (row: ISupItem) => {
  console.log("编辑");
  emit("aboutList", 2, row);
};

// 单元格点击删除
const cellDel = (row: ISupItem) => {
  console.log(row);
  console.log("删除", "id", row.id);
  let name = row.name;
  // delGoodsApi
  ElMessageBox.confirm(`确认删除：${name} 该供应商吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await delSupplierApi({ id: row.id });
      ElMessage.success(result.msg);
      let lastPage = isLastPage({
        total: total.value,
        page: formData.value.page,
        size: formData.value.size,
      });
      if (lastPage) {
        formData.value.page--;
      }
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

//输入框敲击回车
const handleEnterSearch = useThrottleFn(getData, 1000);
// 点击查询
const handleSearch = () => {
  formData.value.page = 1;
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

onActivated(() => {
  getData();
});
</script>

<style scoped lang="scss"></style>
