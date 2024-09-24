<script setup lang="ts">
/* 恒温培养箱使用记录列表页面 */
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, TableColumnCtx } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  getIncubatorListApi,
  incubatorConfirmApi,
  incubatorOutOrderApi,
  incubatorRecheckOrderApi,
  incubatorReportApi,
} from "@/api/quality/instrument/incubator";
import signDialogVue from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { flitterData } from "@/utils";
import { useList } from "./utils/hook";

const { startDownloadUrl } = useCommonHooks();
defineOptions({
  name: "InstrumentIncubator",
});

const useSetting = useSettingsStoreHook();
const {
  pagination,
  formData,
  columns,
  searchColumns,
  router,
  getProTypeName,
  cellDetail,
  outFormData,
  outVisible,
  outColumns,
  outRules,
} = useList();

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<any[]>([]);
const tableLoading = ref(false);

/** puretable的ref */
const prueTableRef = ref();

const check_sign = ref(""); //确认人签名
const out_sign = ref(""); //取出人签名
const recheck_sign = ref(""); //复核人签名

const ids = ref<number[]>([]);
const listId = ref(0); //记录一下当前点击的id

// 勾选触发事件
function changeSelect(selection: any[]) {
  console.log("🚀 ~ changeSelect ~ selection:", selection);
  ids.value = selection.map((item) => {
    return item.oid;
  });
}

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let { use_date, ...rest } = formData.value;
    let data = {
      use_date_start: isArray(use_date) ? use_date[0] : "",
      use_date_end: isArray(use_date) ? use_date[1] : "",
      ...rest,
    };
    startDownloadUrl(incubatorReportApi, data);
  } else {
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    // 1是选择导出
    startDownloadUrl(incubatorReportApi, { id: ids.value });
  }
};

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
const handleSearch = () => {
  getData();
};

async function getData() {
  let { use_date, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    use_date_start: isArray(use_date) ? use_date[0] : "",
    use_date_end: isArray(use_date) ? use_date[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const result = await getIncubatorListApi(data);
  let tableArr: any[] = [];
  let list = result.data.list;
  list.map((item: any) => {
    let checkinfo = item.checkinfo;
    let len = checkinfo.length;
    if (len < 2) {
      // 如果不够2行，补足空行
      checkinfo.length = Math.max(checkinfo.length, 2);
      checkinfo.fill({}, len, checkinfo.length);
    }

    item.checkinfo.forEach((el: any) => {
      tableArr.push({
        order_no: item.order_no, //外层单据编号
        use_date: item.use_date,
        type: item.type,
        report_no: item.report_no,
        temperature: item.temperature,
        humidity: item.humidity,
        check_user_name: item.check_user_name,
        ct_name: el.check_type ? item.ct_name : "--",
        parent_status: item.status, //外层状态(单据状态)
        ...el,
        check_type_name: getProTypeName(el.check_type),
        status: el.status !== undefined ? el.status : -1,
      });
    });
  });
  // console.log("🚀 ~ getData ~ arr:", arr);
  tableData.value = tableArr;
  console.log("🚀 ~ getData ~ tableData.value:", tableData.value);
  // tableData.value = list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

function handleAdd() {
  router.push({
    path: "/quality/instrument/incubator/add",
  });
}

/** 点击编辑 */
function cellEdit(row: any) {
  router.push({
    path: "/quality/instrument/incubator/add",
    query: {
      id: row.oid,
      pageType: 2,
    },
  });
}

/** 点击签字取出 */
function cellOutSign(row: any) {
  listId.value = row.id;
  outVisible.value = true;
}

function handleOutCancel() {
  outVisible.value = false;
}
async function handleOutConfirm(handleSubmit: () => Promise<boolean>) {
  const isPass = await handleSubmit();
  if (!isPass) return;
  handleSign(2);
}

/** 点击签字确认 */
function cellConfirm(row: any) {
  listId.value = row.id;
  handleSign(1);
}
function cellRecheck(row: any) {
  listId.value = row.id;
  handleSign(3);
}

// 签字提交
const signDialogRef = ref();
/** 显示签名弹窗 type为1是签字确认,2是签字取出,3是签字复核 */
async function handleSign(type: number = 1) {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名",
    contentRenderer: () =>
      h(signDialogVue, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      if (type === 1) {
        // 签字确认
        check_sign.value = result;
        sendConfirm();
      } else if (type === 2) {
        // 签字取出
        out_sign.value = result;
        sendOut();
      } else if (type === 3) {
        recheck_sign.value = result;
        sendRecheck();
      }
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

async function sendConfirm() {
  const result = await incubatorConfirmApi({
    id: listId.value,
    check_sign: check_sign.value,
    confirm_type: 0,
  });
  check_sign.value = "";
  ElMessage.success(result.msg);
  getData();
}

async function sendOut() {
  let data = {
    id: listId.value,
    out_sign: out_sign.value,
    out_time: outFormData.value.out_time,
  };
  const result = await incubatorOutOrderApi(data);
  out_sign.value = "";
  outVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

async function sendRecheck() {
  const result = await incubatorRecheckOrderApi({
    id: listId.value,
    recheck_sign: recheck_sign.value,
  });
  recheck_sign.value = "";
  ElMessage.success(result.msg);
  getData();
}

// 列合并
interface SpanMethodProps {
  row: any;
  column: TableColumnCtx<any>;
  rowIndex: number;
  columnIndex: number;
}

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if ([0, 1, 2, 3, 4, 5].includes(columnIndex)) {
    const _row = flitterData(tableData.value, "order_no").one[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  } else {
    return {
      rowspan: 1,
      colspan: 1,
    };
  }
};

onActivated(() => {
  // 获取列表数据
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button
            type="primary"
            @click="handleAdd"
            :icon="Plus"
            class="mr-4"
            v-hasPerm="['inst:incubator:addedit']"
          >
            新建
          </el-button>
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            v-hasPerm="['inst:incubator:report']"
          >
            <el-button type="primary">
              导出数据
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">导出选中数据</el-dropdown-item>
                <el-dropdown-item :command="2">导出列表数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
            @selection-change="changeSelect"
            :pagination="pagination"
            @page-size-change="getData()"
            @page-current-change="getData()"
            :span-method="objectSpanMethod"
          >
            <template #check_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.check_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.check_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.check_sign"
              />
              <span v-else>--</span>
            </template>
            <template #out_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.out_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.out_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.out_sign"
              />
              <span v-else>--</span>
            </template>
            <template #recheck_sign="{ row }">
              <el-image
                :src="useSetting.baseHttp + row.recheck_sign"
                style="width: 100px; height: 60px; border-radius: 6px"
                :preview-src-list="[useSetting.baseHttp + row.recheck_sign]"
                :z-index="9999"
                preview-teleported
                v-if="row.recheck_sign"
              />
              <span v-else>--</span>
            </template>
            <template #operation="{ row }">
              <template v-if="row.check_type">
                <el-button
                  type="primary"
                  @click="cellDetail(row)"
                  link
                  v-hasPerm="['inst:incubator:detail']"
                >
                  详情
                </el-button>
                <template v-if="row.parent_status === 0 && row.status === 0">
                  <el-button
                    type="primary"
                    @click="cellEdit(row)"
                    link
                    v-hasPerm="['inst:incubator:addedit']"
                  >
                    编辑
                  </el-button>
                </template>
                <template v-if="row.status === 0">
                  <el-button
                    type="primary"
                    @click="cellConfirm(row)"
                    link
                    v-hasPerm="['inst:incubator:confirm']"
                  >
                    签字确认
                  </el-button>
                </template>
                <template v-if="row.status === 1">
                  <el-button
                    type="primary"
                    @click="cellOutSign(row)"
                    link
                    v-hasPerm="['inst:incubator:takeout']"
                  >
                    签字取出
                  </el-button>
                </template>
                <template v-if="row.status === 2">
                  <el-button
                    type="primary"
                    @click="cellRecheck(row)"
                    link
                    v-hasPerm="['inst:incubator:approve']"
                  >
                    签字复核
                  </el-button>
                </template>
              </template>
              <span v-else>--</span>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      ref="dialogFormRef"
      v-model:visible="outVisible"
      v-model="outFormData"
      :dialog="{
        title: '签字取出',
        draggable: true,
        hasFooter: false,
      }"
      :form="{
        columns: outColumns,
        rules: outRules,
        labelWidth: '110px',
        labelPosition: 'right',
        hasFooter: true,
      }"
    >
      <template #form-footer="{ handleSubmit }">
        <el-button @click="handleOutCancel" class="w-[80px]">取消</el-button>
        <el-button type="primary" @click="handleOutConfirm(handleSubmit)">签字确认</el-button>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
