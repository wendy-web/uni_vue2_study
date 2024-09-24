<script setup lang="ts">
/* 拆装单新建编辑页 */
import { dayjs } from "element-plus";
import type { FormInstance } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import type { ICateItem, ISplitPrentList } from "@/api/common/types";
// import { getGoodsSplitApi } from "@/api/common/index";
// import SelectDrop from "@/components/SelectDrop/index.vue";
import { detailSplitApi } from "@/api/storage/split/index";
// 导入api类型
import type { IBeforeGood } from "@/api/storage/split/types";
import type { IAddEmit } from "@/api/storage/stotypes";
import inStoSplitBatch, { API as batchApi } from "@/components/BatchSelect/inStoSplitBatch.vue";
// import SplitBatch, { API as batchApi } from "@/components/BatchSelect/SplitBatch.vue";
// import inStoSplit from "@/components/SelectDrop/inStoSplit.vue";
import inStoSplitSelect from "@/components/SelectDrop/inStoSplitSelect.vue";
import type { goodsType, preInfoType } from "../utils/types";

defineOptions({
  name: "StoSplitAdd",
});
enum EAddTitle {
  "新建拆箱单" = 1,
  "编辑拆箱单",
}

const props = defineProps({
  listId: {
    type: Number,
    default: 0,
  },
  editFrom: {
    type: Number,
    default: 0,
  },
  storageList: Array as PropType<ICateItem[]>,
});
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<preInfoType>): void;
}>();

const rowList = ["barcode", "title", "spec", "measure_name", "batch_number"];
const batchSelectRef = ref<batchApi | null>(null);
const formData = reactive({
  split_date: dayjs().format("YYYY-MM-DD"), //拆装日期
  goods: [] as goodsType[],
  split_wh_name: "",
  warehouse_id: 0,
});
const { goods } = toRefs(formData);
// const goodsList = ref<ISplitPrentList[]>([]);
const formRef = ref<FormInstance>();
const tableLoading = ref(false); // 页面loading(app-card样式区域loading)
const pageType = ref(1); //1是新建,2是编辑
const drawerShow = ref(false); //批量选择弹窗控制开关
const note = ref("");
const file_info = ref({
  src: "",
  name: "",
});
const detailGoodsList = ref<goodsType[]>([]);

const headerTitle = computed(() => {
  return EAddTitle[pageType.value];
});

const uniqueList = computed(() => {
  let arr = goods.value.map((item) => {
    return item.unique;
  });
  return arr as string[];
});
const uniqueNumList = computed(() => {
  let arr = detailGoodsList.value.map((item) => {
    return {
      unique: item.unique,
      old_num: item.old_num,
    };
  });
  return arr as uniqueListType[];
});

const stockIdList = computed(() => {
  let arr = goods.value.map((item) => {
    return item.stock_id;
  });
  return arr as number[];
});

const stockNumList = computed(() => {
  let arr = detailGoodsList.value.map((item) => {
    return {
      stock_id: item.stock_id,
      old_num: item.old_num,
    };
  });
  return arr as stockIdListType[];
});

// 获取可录入的货品数据,以及供应商列表
// async function getData() {
//   const goodsResult = await getGoodsSplitApi({
//     warehouse_id: formData.warehouse_id,
//   });
//   console.log("goodsResult", goodsResult);
//   goodsList.value = goodsResult.data.list;
// }

function whChange(val: string) {
  console.log("选择拆装仓库", val);
  if (!val) return;
  let item = JSON.parse(val);
  formData.warehouse_id = item.id;
  formData.split_wh_name = item.name;
  // getData();
}

// select下拉选择框的选择触发事件
const selectChange = (item: ISplitPrentList, row: goodsType) => {
  // let item = goodsList.value[index];
  console.log("item", item);
  // 记录一下之前的row.unique
  let old_unique = row.unique;

  row.goods_id = item.goods_id;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.goods.measure_name;
  row.class_name = item.goods.class_name;
  row.brand = item.brand;
  row.num = item.stock;
  row.old_num = item.stock;
  row.quantity = item.goods.split_goods[0]?.quantity;
  row.batch_number = item.batch_number;
  row.unique = item.unique;
  row.stock_id = item.goods.stock_id;
  row.price = item.goods.price;
  let {
    id: goods_id,
    title,
    spec,
    barcode,
    brand,
    class_name,
    measure_name,
    price,
    ws_code,
    in_wh_date,
  } = item.goods.split_goods[0].assemble_goods;
  row.assemble_goods = {
    goods_id,
    title,
    spec,
    barcode,
    brand,
    class_name,
    measure_name,
    num: item.stock * item.goods.split_goods[0]?.quantity,
    price,
    ws_code,
    in_wh_date,
  };

  // let unique = item.unique;
  // goodsList.value.forEach((item) => {
  //   if (item.unique == unique) {
  //     // 如果某个元素的id等于选择的id,那么表示该元素不可被选择了
  //     item.select_status = true;
  //   }
  //   if (item.unique == old_unique) {
  //     // 如果某个元素的id等于旧的之前的id,那么将该元素恢复可选
  //     item.select_status = false;
  //   }
  // });

  // console.log("row",row)
  // row.supplier_id = item.supplier_id;
  // row.sup_name = item.sup_name;
  console.log("goods.value", goods.value);
};

function bindInputBlur(row: any) {
  row.assemble_goods.num = row.num * row.quantity;
}

const addRule = [[() => !formData.warehouse_id, () => ElMessage.warning("请您先选择仓库后再操作")]];

// 点击添加按钮
function handleAdd() {
  // console.log("buyGoods.value", buyGoods.value);
  if (!formData.warehouse_id) {
    ElMessage.warning("请您先选择仓库后再操作");
    return;
  }

  goods.value.push({
    unique: "",
    barcode: "",
    title: "",
    spec: "",
    num: undefined,
    note: "",
    measure_name: "",
    brand: "",
    class_name: "",
    goods_id: 0,
    quantity: 10,
    batch_number: "",
    old_num: undefined,
    stock_id: 0,
    price: "",
    ws_code: "",
    in_wh_date: "",
    assemble_goods: {
      barcode: "",
      title: "",
      spec: "",
      num: undefined,
      measure_name: "",
      brand: "",
      class_name: "",
      goods_id: 0,
      price: "",
      ws_code: "",
      in_wh_date: "",
    },
  });
}
// 点击批量添加按钮
function handleBatchAdd() {
  if (!formData.warehouse_id) {
    ElMessage.warning("请您先选择仓库后再操作");
    return;
  }

  drawerShow.value = true;
}
function batchSelectchange(selectData: ISplitPrentList[]) {
  tableLoading.value = true;
  console.log("selectData", selectData);
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    let {
      id: goods_id,
      title,
      spec,
      barcode,
      brand,
      class_name,
      measure_name,
      price,
      ws_code,
      in_wh_date,
    } = item.goods.split_goods[0]?.assemble_goods;
    goods.value.push({
      goods_id: item.goods_id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      measure_name: item.goods.measure_name,
      class_name: item.goods.class_name,
      brand: item.brand,
      num: item.stock,
      old_num: item.stock,
      quantity: item.goods.split_goods[0]?.quantity,
      batch_number: item.batch_number,
      unique: item.unique,
      note: "",
      stock_id: item.goods.stock_id,
      price: item.price,
      ws_code: item.ws_code,
      in_wh_date: item.in_wh_date,
      assemble_goods: {
        goods_id,
        title,
        spec,
        barcode,
        brand,
        class_name,
        measure_name,
        num: item.stock * item.goods.split_goods[0]?.quantity,
        price,
        ws_code,
        in_wh_date,
      },
    });
  });
  // batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
}

//点击删除
function handleDelete(row: any, index: number) {
  let valueArr = goods.value.splice(index, 1);
  // let valueItem = valueArr[0];
  // if (valueItem.unique) {
  //   goodsList.value.forEach((item) => {
  //     //如果selectData中存在该元素
  //     if (item.unique == valueItem.unique) {
  //       // 状态恢复可选
  //       item.select_status = false;
  //     }
  //   });
  // }
}

// 点击取消
function handeleCancel() {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
  }
}
// 点击下一步
function hanleNext() {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          split_wh_name: formData.split_wh_name,
          warehouse_id: formData.warehouse_id,
          split_date: formData.split_date,
          goods: goods.value,
          id: props.listId,
          note: note.value,
          file_info: file_info.value,
        },
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
}

// 选择文件改变
function bindFile(file: { name: string; src: string }) {
  console.log("file", file);
  file_info.value = file;
}

async function getDetail(id: number) {
  try {
    tableLoading.value = true;
    const result = await detailSplitApi({ id });

    formData.split_date = result.data.split_assemble_time;
    formData.split_wh_name = result.data.warehouse?.name;
    formData.warehouse_id = result.data.warehouse_id;
    note.value = result.data.note;
    file_info.value = result.data.file_info;

    let old_goods = result.data.before_goods;
    // 将详情返回的商品数据字段 改为需要的字段
    let new_goods = old_goods.map((item) => {
      let changeData = changeDetailData(item);
      return changeData;
    });
    console.log("new_goods", new_goods);
    detailGoodsList.value = cloneDeep(new_goods);
    goods.value = new_goods;
  } finally {
    tableLoading.value = false;
  }
}
function changeDetailData(item: IBeforeGood) {
  console.log("详情item", item);
  let {
    id,
    goods_id,
    batch_number,
    split_assemble_num,
    goods,
    note,
    after,
    unique,
    warehouse_id,
    stock,
    stock_id,
    price,
    ws_code,
    in_wh_date,
  } = item;
  let { barcode, title, spec, measure_name, brand, class_name, split_quantity } = goods;
  return {
    id,
    barcode,
    title,
    spec,
    num: parseInt(split_assemble_num),
    note,
    measure_name,
    brand,
    class_name,
    goods_id,
    quantity: split_quantity,
    old_num: parseInt(split_assemble_num) + parseInt(stock),
    batch_number,
    unique,
    warehouse_id,
    stock_id,
    price,
    ws_code,
    in_wh_date,
    assemble_goods: {
      barcode: after.goods?.barcode,
      title: after.goods?.title,
      spec: after.goods?.spec,
      num: parseInt(after.split_assemble_num),
      measure_name: after.goods?.measure_name,
      brand: after.goods?.brand,
      class_name: after.goods?.class_name,
      goods_id: after.goods_id,
      price: after.price,
      ws_code: after.ws_code,
      in_wh_date: after.in_wh_date,
    },
  };
}

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  // if (props.editFrom != 0 && pageType.value == 1) {
  //   // 如果不是从预览页返回且是新建页面
  //   getData();
  // }
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
      console.log("newValue存在");
      pageType.value = 2;
      // getDetail(newValue);
    } else {
      console.log("newValue不存在");
      pageType.value = 1;
      goods.value = [];
      detailGoodsList.value = [];
      note.value = "";
      file_info.value = {
        src: "",
        name: "",
      };
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-loading="tableLoading">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="formData" @submit.native.prevent>
        <div class="flex">
          <el-form-item label="拆装仓库" prop="out_wh_name">
            <el-select
              v-model="formData.split_wh_name"
              placeholder="请选择拆装仓库"
              clearable
              filterable
              @change="whChange($event)"
              :disabled="formData.goods.length > 0"
            >
              <el-option
                v-for="item in storageList"
                :key="item.id"
                :label="item.name"
                :value="JSON.stringify(item)"
                :disabled="item.selectStatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拆装日期" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="formData.split_date"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
          </el-form-item>
        </div>
        <el-table :data="formData.goods" border height="840">
          <el-table-column width="140" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>大包装规格</span>
              </el-form-item>
              <el-row class="top-border">
                <span>拆零规格</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="条码" prop="barcode" width="200" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.barcode || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.barcode }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            prop="title"
            class="table-item"
            width="260"
            class-name="bottom-column"
          >
            <template #default="scope">
              <el-form-item
                style="width: 100%"
                :prop="`goods.${scope.$index}.title`"
                :rules="[
                  {
                    required: true,
                    message: '请选择名称',
                    trigger: 'blur',
                  },
                ]"
              >
                <!-- <span>{{ scope.row.title }}</span> -->
                <!-- <select-drop
                  :list="goodsList"
                  :title="scope.row.title"
                  :rowList="rowList"
                  @change="selectChange($event, scope.row)"
                ></select-drop> -->
                <!-- <inStoSplit
                  :detail-unique-list="uniqueNumList"
                  :unique-list="uniqueList"
                  :warehouse_id="formData.warehouse_id"
                  :title="scope.row.title"
                  @change="selectChange($event, scope.row)"
                  :page-type="pageType"
                ></inStoSplit> -->
                <inStoSplitSelect
                  :stockIdList="stockIdList"
                  :detailStockIdList="stockNumList"
                  :warehouse_id="formData.warehouse_id"
                  :title="scope.row.title"
                  @change="selectChange($event, scope.row)"
                  :page-type="pageType"
                ></inStoSplitSelect>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.title }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" width="200" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.spec || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.spec }}</span>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column label="品牌" prop="brand" width="140" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.brand || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.brand }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="批次/日期"
            prop="batch_number"
            width="140"
            class-name="bottom-column"
          >
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.batch_number || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.batch_number }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" width="140" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.measure_name || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.measure_name }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="拆装数量" prop="num" width="140" class-name="bottom-column">
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.num`"
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
              >
                <el-input
                  v-model.number="scope.row.num"
                  @blur="bindInputBlur(scope.row)"
                  v-inputnum.intp
                ></el-input>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.num }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="关系" prop="relation" width="140" class-name="bottom-column">
            <template #default="scope">
              <el-form-item><span>1</span></el-form-item>
              <el-row class="top-border">
                <span>{{ "1: " + scope.row.quantity }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="ws_code" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.ws_code || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.ws_code || "-" }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="入库日期"
            prop="in_wh_date"
            class-name="bottom-column"
            width="120"
          >
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.in_wh_date || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.in_wh_date || "-" }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="price" class-name="bottom-column">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.price || "-" }}</span>
              </el-form-item>
              <el-row class="top-border">
                <span>{{ scope.row.assemble_goods.price }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="180">
            <template #default="scope">
              <el-form-item>
                <div class="item">
                  <el-input
                    class="item__input"
                    v-model="scope.row.note"
                    placeholder="请输入备注"
                    maxlength="30"
                  ></el-input>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-form-item>
                <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">
                  <template #icon>
                    <i-ep-Delete></i-ep-Delete>
                  </template>
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px] relative">
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
        <el-button type="success" @click="handleAdd" class="w-[100px]">添加</el-button>
        <el-button type="primary" @click="handleBatchAdd" class="w-[100px]">批量添加</el-button>
      </div>

      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
          >可上传pdf和图片格式</span
        > -->
      </div>
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
    </div>

    <!-- <SplitBatch
      :unique-list="uniqueList"
      ref="batchSelectRef"
      :warehouse_id="formData.warehouse_id"
      v-model="drawerShow"
      @change="batchSelectchange"
    ></SplitBatch> -->
    <inStoSplitBatch
      :stock-id-list="stockIdList"
      ref="batchSelectRef"
      :warehouse_id="formData.warehouse_id"
      v-model="drawerShow"
      @change="batchSelectchange"
    ></inStoSplitBatch>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/split.scss";
</style>
