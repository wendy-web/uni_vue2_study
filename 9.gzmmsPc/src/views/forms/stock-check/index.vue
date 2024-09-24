<template>
  <div class="app-container">
    <!-- 库存核算页面 -->
    <div class="search-card">
      <el-form :model="formData" ref="form" :inline="true">
        <el-form-item label="仓库" prop="status">
          <el-select v-model="formData.status" placeholder="请选择仓库" clearable filterable>
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="货品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入货品名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search" v-deBounce>查询</el-button>
          <el-button :icon="Refresh" @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="货品条码" prop="order" />
        <el-table-column label="名称" prop="money" />
        <el-table-column label="计量单位" prop="time" />

        <el-table-column label="上期结存" prop="time">
          <template #default>
            <div class="w-[100%] flex justify-between border-solid border-b-[1px] border-gray-200">
              <span class="block text-center flex-1">数量</span>
              <span>|</span>
              <span class="block text-center flex-1">金额</span>
            </div>
            <div class="w-[100%] flex justify-between">
              <span class="block text-center flex-1">100kg</span>
              <span class="block text-center flex-1">1000元</span>
            </div>
          </template>
        </el-table-column>
        >
        <el-table-column label="本期入库" prop="time" />
        <el-table-column label="本期出库" prop="time" />
        <el-table-column label="本期结存" prop="time" />
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "FormsStockCheck",
};
</script>
<script setup lang="ts">
import { Search, Refresh } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

// 引入获取仓库列表的hooks
import { storageListHooks } from "@/hooks";

const { storageList } = storageListHooks();
const state = reactive({
  formData: {
    name: "",
    status: "",
    time: "",
    department: "",
  },
  options: [
    {
      value: 1,
      label: "待提审",
    },
    {
      value: 2,
      label: "待审核",
    },
  ],
  tableData: [
    {
      order: 12313123,
      money: 1123,
      prepared_by: 123123,
      time: "2022-03-10",
      status: 1,
    },
  ],
  tableLoading: false,
});
const { formData, options, tableData, tableLoading } = toRefs(state);
const form = ref<FormInstance>();

// 点击查询
const handleSearch = () => {};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss"></style>
