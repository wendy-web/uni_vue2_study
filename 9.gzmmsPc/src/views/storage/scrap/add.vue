<script setup lang="ts">
/* 报废单新建编辑页 */
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
// 引入自定义组件
import { dayjs } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { getLabelInfoApi } from "@/api/common/index";
// 引入类型
import { IinStockItem } from "@/api/common/types";
// 引入api
import { detailScrapApi } from "@/api/storage/scrap";
//引入表格类型
import { IScrapAdd, IScrapAddInfo, ScrapGoods } from "@/api/storage/scrap/types";
import { IAddEmit } from "@/api/storage/stotypes";
import { formartDate } from "@/utils/validate";
import InStoBatchSelect, { API as batchApi } from "@/components/BatchSelect/InStoBatchSelect.vue";
// 引入自定义组件
import InStoSelect from "@/components/SelectDrop/InStoSelect.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
// 使用uniqueHooks
import { useUniqueHooks } from "@/hooks/unique";

defineOptions({
  name: "StoScrapAdd",
});

enum ETitle {
  "新建报废单" = 1,
  "编辑报废单",
}

interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
});

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const state = reactive({
  form: {
    goods: [] as IScrapAdd[],
    out_time: dayjs().format("YYYY-MM-DD"), //出库日期
  },
  // 需要编辑的属性
  // editProp: ["scr_num", "note"],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  // rowList: ["barcode", "title", "spec", "warehouse_name", "batch_number"], //传给自定义组件的数据
  drawerShow: false, //抽屉弹窗开关
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
  drawerShow,
  // rowList,
} = toRefs(state);
const { goods } = toRefs(state.form);

// let { uniqueList, uniqueNumList, detailGoodsList } = useUniqueHooks<IScrapAdd>(goods);
let { stockIdList, stockNumList, detailGoodsList } = useUniqueHooks<IScrapAdd>(goods);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
});

const batchSelectRef = ref<batchApi | null>(null);

// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IScrapAddInfo>): void;
}>();

// const ids = computed(() => {
//   let arr = goods.value.map((item) => {
//     return item.goods_all_id;
//   });
//   return arr as number[];
// });

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  console.log(index);
  let valueArr = goods.value.splice(index, 1);
  formRef.value?.clearValidate(`goods.${index}.scr_num`)
  formRef.value?.clearValidate(`goods.${index}.title`)
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击了添加");
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      goods.value.push({
        goods_id: 0,
        // goods_all_id: 0,
        barcode: "",
        title: "",
        spec: "",
        brand: "",
        measure_name: "",
        class_name: "",
        scr_num: undefined,
        sup_name: "",
        ph_no: "",
        warehouse_id: 0,
        warehouse_name: "",
        note: "",
        unique: "",
        old_num: 1,
        stock_id: 0,
        ws_code: "",
        in_wh_date: "",
        price: "",
      });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// select下拉选择框的选择触发事件

const selectChange = (item: IinStockItem, row: IScrapAdd) => {
  console.log("item", item);
  // row.goods_all_id = item.id;
  row.unique = item.unique as string;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.brand = item.brand;
  row.class_name = item.class_name;
  // row.sup_name = item.sup_name;
  row.warehouse_name = item.warehouse_name;
  row.warehouse_id = item.warehouse_id;
  row.ph_no = item.batch_number;
  row.scr_num = item.stock;
  row.old_num = item.stock;
  row.goods_id = item.goods_id;
  row.stock_id = item.stock_id;
  row.ws_code = item.ws_code;
  row.in_wh_date = item.in_wh_date;
  row.price = item.price;
};

// 点击批量添加
const handleBatchAdd = () => {
  drawerShow.value = true;
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectData: IinStockItem[]) => {
  tableLoading.value = true;
  console.log("selectData", selectData);
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    goods.value.push({
      goods_id: item.goods_id,
      // goods_all_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      // sup_name: item.sup_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.batch_number,
      // scr_num: item.rem_num,
      scr_num: item.stock as number,
      unique: item.unique as string,
      note: "",
      // old_scr_num: item.rem_num,
      old_num: item.stock,
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      in_wh_date: item.in_wh_date,
      price: item.price,
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
};

// 单元格鼠标移入时触发
const handleCellEnter = (row: any, column: any, cell: any, event: any) => {
  const property = column.property;
  // if (editProp.value.includes(property)) {
  //   cell.querySelector(".el-input__inner").focus();
  // }
};

// 点击取消
const handeleCancel = () => {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
  }
};
// 点击下一步
const hanleNext = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      let list = goods.value.map((item) => {
        // 剔除不需要传递的字段old_rec_num, select_status
        let { old_num, ...rest } = item;
        return {
          ...rest,
        };
      });
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          out_time: form.value.out_time,
          id: props.listId,
          goods: list,
          note: note.value,
          file_info: file_info.value,
        },
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 编辑时 请求详情数据
const getDetail = async (id: number) => {
  try {
    tableLoading.value = true;
    const result = await detailScrapApi({ id });
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    form.value.out_time = formartDate(result.data.out_time);

    let old_goods = result.data.goods;
    // 将详情返回的商品数据字段 改为需要的字段
    let new_goods = old_goods.map((item: ScrapGoods) => {
      let changeData = changeDetailData(item);
      return changeData;
    });
    console.log("new_goods", new_goods);

    detailGoodsList.value = cloneDeep(new_goods);
    goods.value = new_goods;
  } finally {
    tableLoading.value = false;
  }
};

// 将函数赋值给hooks中的函数变量,通过扫描枪扫出来的条码添加商品
async function getBarcodeInfo() {
  let code = input_barcode.value;
  let data = {
    content: code,
    document_type: 7, //报废单 7
  };
  const result = await getLabelInfoApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;
  let success_num = 0;
  let fail_num = 0;
  findList.forEach((element) => {
    let findRes = goods.value.find((item) => {
      return element.stock_id === item.stock_id;
    });
    // 如果不存在则添加
    if (!findRes) {
      goods.value.push({
        goods_id: element.goods_id,
        barcode: element.barcode,
        title: element.title,
        spec: element.spec,
        brand: element.brand,
        measure_name: element.measure_name,
        class_name: element.class_name,
        // sup_name: element.sup_name,
        warehouse_id: element.warehouse_id,
        warehouse_name: element.warehouse_name,
        ph_no: element.batch_number,
        scr_num: element.stock,
        unique: element.unique as string,
        note: "",
        old_num: element.stock,
        stock_id: element.stock_id,
        ws_code: element.ws_code,
        in_wh_date: element.in_wh_date,
        price: element.price,
      });
      success_num += 1;
    } else {
      fail_num += 1;
    }
  });
}

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  if (props.editFrom != 0 && pageType.value == 1) {
    // 如果不是从预览页返回且是新建页面
  }
  /*
      当是编辑页时需要判断
      props.editFrom值来判断
      是否获取详情数据,如果为0从pre页面返回的则不获取
    */
  if (pageType.value == 2 && props.editFrom) {
    getDetail(props.listId);
  }
});

watch(
  () => props.listId,
  (newValue, oldValue) => {
    console.log("listId变了", newValue, oldValue);
    if (newValue) {
      pageType.value = 2;
    } else {
      pageType.value = 1;
      goods.value = [];
      note.value = "";
      file_info.value = {
        src: "",
        name: "",
      };
    }
  },
  { immediate: true },
);
function changeDetailData(data: ScrapGoods) {
  let {
    goods_id,
    // goods_all_id,
    barcode,
    brand,
    class_name,
    title,
    spec,
    measure_name,
    price,
    note,
    ph_no,
    sup_name,
    warehouse_id,
    warehouse_name,
    unique,
    scr_num,
    stock,
    stock_id,
    ws_code,
    in_wh_date,
  } = data;
  let old_num = scr_num + stock;
  return {
    goods_id,
    // goods_all_id,
    title,
    barcode,
    spec,
    brand,
    measure_name,
    class_name,
    price,
    scr_num,
    sup_name,
    ph_no: ph_no ?? "",
    warehouse_name,
    warehouse_id,
    note,
    unique,
    old_num,
    stock_id,
    ws_code,
    in_wh_date,
    select_status: false,
  };
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="form">
        <div class="flex">
          <el-form-item label="出库日期">
            <el-date-picker
              style="width: 100%"
              v-model="form.out_time"
              type="date"
              placeholder="请选择出库日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
          </el-form-item>
        </div>
        <el-table
          :data="form.goods"
          border
          stripe
          @cell-mouse-enter="handleCellEnter"
          v-loading="tableLoading"
          height="800"
          scrollbar-always-on
          class="table-class"
        >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="条码" prop="barcode" width="160">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.barcode" disabled></el-input> -->
              <span>{{ scope.row.barcode || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="title" class="table-item" width="260">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.title`"
                :rules="rules.title"
                :inline-message="true"
              >
                <InStoSelect
                  :stockIdList="stockIdList"
                  :detailStockIdList="stockNumList"
                  :page-type="pageType"
                  :title="scope.row.title"
                  @change="selectChange($event, scope.row)"
                ></InStoSelect>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" width="160" show-overflow-tooltip>
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.spec" disabled></el-input> -->
              <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                {{ scope.row.spec || "-" }}
              </span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand" width="120">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.brand" disabled></el-input> -->
              <span>{{ scope.row.brand || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="class_name" width="120">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.class_name" disabled></el-input> -->
              <span>{{ scope.row.class_name || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="批次/日期" prop="ph_no" width="160">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.ph_no" disabled></el-input> -->
              <span>{{ scope.row.ph_no || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" width="100">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.measure_name" disabled></el-input> -->
              <span>{{ scope.row.measure_name || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="scr_num" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>数量</span>
            </template>
            <template #default="scope">
              <div class="item">
                <el-form-item
                  :prop="`goods.${scope.$index}.scr_num`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入数量',
                      trigger: 'blur',
                    },
                    {
                      type: 'number',
                      min: 1,
                      max: scope.row.old_num,
                      message: `应在1~${scope.row.old_num}范围内`,
                      trigger: 'blur',
                    },
                  ]"
                  :inline-message="true"
                >
                  <el-input
                    v-model.number="scope.row.scr_num"
                    placeholder="请输入内容"
                    v-inputnum.intp
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="出库仓库" prop="warehouse_name" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>出库仓库</span>
            </template>
            <template #default="scope">
              <div class="item">
                <!-- <el-form-item> -->
                <!-- <el-input v-model="scope.row.warehouse_name" placeholder="" disabled></el-input> -->
                <span>{{ scope.row.warehouse_name || "-" }}</span>
                <!-- </el-form-item> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="measure_name" width="100">
            <template #default="scope">
              <!-- <el-form-item> -->
              <span>{{ scope.row.ws_code || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="measure_name" width="100">
            <template #default="scope">
              <!-- <el-form-item> -->
              <span>{{ scope.row.price || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="入库日期" prop="in_wh_date" width="110">
            <template #default="scope">
              <!-- <el-form-item> -->
              <!-- <el-input v-model="scope.row.measure_name" disabled></el-input> -->
              <span>{{ formartDate(scope.row.in_wh_date) || "-" }}</span>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="160">
            <template #default="scope">
              <!-- <el-form-item> -->
              <div class="item">
                <el-input
                  v-model="scope.row.note"
                  placeholder="请输入备注"
                  maxlength="30"
                ></el-input>
              </div>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <!-- <el-form-item> -->
              <el-button
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.row, scope.$index)"
              >
                删除
              </el-button>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px] relative">
        <!-- <el-button type="primary" :icon="Plus" @click="handleMoni" class="w-[100px]">
          模拟扫码
        </el-button> -->
        <div class="note absolute left-0">
          <span>备注</span>
          <el-input
            style="width: 240px; margin-left: 10px"
            v-model="note"
            placeholder="请输入备注"
            clearable
            maxlength="30"
          ></el-input>
        </div>
        <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button>
        <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
          批量添加
        </el-button>
      </div>

      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
            >可上传pdf和图片格式</span
                  > -->
      </div>
      <div class="footer-btn mt-[20px] pb-[20px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
    </div>

    <InStoBatchSelect
      :stock-id-list="stockIdList"
      ref="batchSelectRef"
      v-model="drawerShow"
      @change="batchSelectchange"
    ></InStoBatchSelect>
  </div>
</template>

<style scoped lang="scss">
.text-omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.table-class .el-form-item) {
  margin-bottom: 0px;
}
</style>
