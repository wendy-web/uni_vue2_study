<script setup lang="ts">
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { useThrottleFn } from "@vueuse/core";
// 引入货品分类类型
import type { ICateItem } from "@/api/common/types";
// 引入获取商品列表api
import {
  delGoodsApi,
  getGoodsListApi,
  goodsExportApi,
  setGoodsStatusApi,
} from "@/api/storage/goods-manage";
// 引入货品列表类型
import type { IGoodsItem } from "@/api/storage/goods-manage/types";
// 引入分页组件
import pagination from "@/components/Pagination/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import ExcelUpload from "@/components/Upload/ExcelUpload.vue";
import { usePrint } from "@/hooks/print";
import { useAdaptiveConfig, useTable } from "@/hooks/table";
import { useCellOmit } from "@/hooks/table";
import { useOrderList } from "./utils/hook";

defineOptions({
  name: "StoGoodsManageList",
});

interface Props {
  goodsCateList: ICateItem[];
}

const { multiPrint } = usePrint();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { startdownload } = useTable();
const { columns } = useOrderList();

const props = defineProps<Props>();

const state = reactive({
  formData: {
    keyword: "",
    class_name: "",
    page: 1,
    size: 10,
  },
  // goodsCateList: [] as ICateItem[],
  tableData: [] as IGoodsItem[],
  tableLoading: false,
  total: 0, //总条数
  uploadShow: false,
});
const { formData, tableData, tableLoading, total, uploadShow } = toRefs(state);
const ids = ref<number[]>([]);
const form = ref<FormInstance>();
const prueTableRef = ref();

const selectCodeData = ref<IGoodsItem[]>([]);

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const emit = defineEmits(["aboutList"]);

const { handleCellEnter, handleCellLeave,handleCellClass } = useCellOmit({ editProp: ["title", "spec"], type: 1 });

// 单元格开关
const handleChangeStatus = async (row: any) => {
  const text = row.is_stop_using === 1 ? "停用" : "启用";
  ElMessageBox.confirm(`确认要${text}条码为：【${row.barcode}】的商品吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = {
        goods_id: row.id,
        is_stop: row.is_stop_using,
      };

      let result = await setGoodsStatusApi(data);
      if (result.code === "-2") {
        row.is_stop_using = row.is_stop_using === 1 ? 0 : 1;
        return;
      }
      ElMessage.success(result.msg);
    })
    .catch(() => {
      row.is_stop_using = row.is_stop_using === 1 ? 0 : 1;
    });
};

// 点击导出按钮
const handleCommand = (command: number) => {
  console.log("command", command, typeof command);
  if (command === 2) {
    // 2是全部导出
    let data = {
      keyword: formData.value.keyword,
      class_name: formData.value.class_name,
    };
    startdownload(goodsExportApi, data);
  } else {
    // 1是选择导出
    if (ids.value.length === 0) {
      return ElMessage.warning("请您至少勾选一条数据");
    }
    startdownload(goodsExportApi, { ids: ids.value });
  }
};
// 勾选触发事件
function changeSelect(selection: IGoodsItem[]) {
  selectCodeData.value = selection;

  ids.value = selection.map((item) => {
    return item.id;
  });
}

function handleUpload() {
  getData();
}

// 获取数据
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

//输入框敲击回车
const handleEnterSearch = useThrottleFn(getData, 1000);

// 点击查询
const handleSearch = async () => {
  formData.value.page = 1;
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  ids.value = [];
  tableRef.value.clearSelection();
  getData();
};

//分页触发事件
const handleQuery = () => {
  getData();
};

// 点击新建货品 显示新建组件
const handleAdd = () => {
  emit("aboutList", 1);
};

// 单元格点击编辑
const cellEdit = (row: IGoodsItem) => {
  emit("aboutList", 2, row.id);
};

// 单元格点击删除
const cellDel = (row: IGoodsItem) => {
  let name = row.barcode;
  // delGoodsApi
  ElMessageBox.confirm(`确认删除条码为：${name} 的商品吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await delGoodsApi({ id: row.id });
      ElMessage.success(result.msg);
      //总数除以每页记录数
      let lastPage = Math.ceil(total.value / formData.value.size);
      // 判断当前页是否是最后一页 且 为最后一条数据
      if (formData.value.page === lastPage && total.value % formData.value.size === 1) {
        formData.value.page--; //页码-1
      }
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

function handlePrint() {
  let len = selectCodeData.value.length;
  if (len === 0) {
    ElMessage.warning("请选择要打印的数据");
    return;
  } else if (len > 10) {
    ElMessage.warning("一次只能打印10条数据");
    return;
  }

  multiPrint(selectCodeData.value);

  // let list = selectCodeData.value.map((item) => {
  //   return {
  //     qrcode: item.barcode,
  //     barcode: item.barcode,
  //     title: item.title,
  //     spec: item.spec,
  //   };
  // });
}

onActivated(() => {
  getData();
  prueTableRef.value?.setAdaptive();
});
onDeactivated(() => {
  
});
</script>

<template>
  <div class="app-container">
    <div class="search-card">
      <el-form :model="formData" ref="form" :inline="true">
        <el-form-item label="关键字" prop="keyword">
          <el-input
            v-model="formData.keyword"
            placeholder="条码/货品名称"
            @keyup.enter.native="handleEnterSearch"
          ></el-input>
        </el-form-item>

        <el-form-item label="分类" prop="class_name">
          <el-select
            v-model="formData.class_name"
            placeholder="请选择分类"
            clearable
            filterable
            @change=""
          >
            <el-option
              v-for="item in goodsCateList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search" v-deBounce>查询</el-button>
          <el-button :icon="Refresh" @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <pure-table-bar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="success" :icon="Plus" @click="handleAdd">新建货品</el-button>
          <el-button type="primary" class="mr-[14px]" @click="uploadShow = true">
            <template #icon>
              <i-ep-Upload></i-ep-Upload>
            </template>
            导入货品
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              货品导出
              <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">导出选中数据</el-dropdown-item>
                <el-dropdown-item :command="2">导出全部数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip effect="dark" content="一次最多只能打印10条勾选数据" placement="top-start">
            <el-button type="primary" @click="handlePrint" class="ml-[14px]">
              <template #icon>
                <i-ep-Printer></i-ep-Printer>
              </template>
              打印选中标签
            </el-button>
          </el-tooltip>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            stripe
            row-key="id"
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            @cell-mouse-enter="handleCellEnter"
            @cell-mouse-leave="handleCellLeave"
            adaptive
            :adaptiveConfig="adaptiveConfig"
            ref="prueTableRef"
            @selection-change="changeSelect"
          >
            <template #operation="scope">
              <el-button
                type="primary"
                size="default"
                link
                :icon="Edit"
                @click="cellEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="default"
                link
                :icon="Delete"
                @click="cellDel(scope.row)"
              >
                删除
              </el-button>
            </template>
            <template #status="{ row }">
              <el-switch
                v-model="row.is_stop_using"
                inline-prompt
                active-text="已停用"
                inactive-text="已启用"
                :active-value="1"
                :inactive-value="0"
                @change="handleChangeStatus(row)"
              />
            </template>
          </pure-table>
        </template>
      </pure-table-bar>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="formData.page"
        v-model:limit="formData.size"
        @pagination="handleQuery"
      />
    </div>

    <excel-upload v-model:visible="uploadShow" @upload="handleUpload"></excel-upload>
  </div>
</template>
<style>
.hiprint-printElement-text-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style scoped lang="scss">
:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.hiprint-printElement-text-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
