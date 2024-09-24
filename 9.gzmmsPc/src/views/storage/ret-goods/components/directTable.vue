<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
// 引入深克隆
import { cloneDeep } from "@pureadmin/utils";
import { getLabelInfoApi } from "@/api/common/index";
import { IinStockItem } from "@/api/common/types";
// 引入api
import { detailRetGoodsApi } from "@/api/storage/ret-goods";
// 引入类型
import type {
  IRetGoodsDetail,
  IRetGoodsDirect,
  RetGoodsGoods,
} from "@/api/storage/ret-goods/types";
import InStoBatchSelect, { API as batchApi } from "@/components/BatchSelect/InStoBatchSelect.vue";
import InStoSelect from "@/components/SelectDrop/InStoSelect.vue";
// 使用uniqueHooks
import { useUniqueHooks } from "@/hooks/unique";

export interface API {
  validateForm: () => Boolean;
  getDetail: (id: number) => void;
  getCodeInfo: () => void;
  goodsLen: number;
}

interface Props {
  pageType: number;
  // goodsList: IinStockItem[]; //已入库 货品列表数据
  inputBarcode?: string;
}
const props = withDefaults(defineProps<Props>(), {
  pageType: 1,
  // goodsList: () => [] as IinStockItem[],
  inputBarcode: "",
});

const state = reactive({
  form: {
    goods: [] as IRetGoodsDirect[],
    procure_no: "",
    return_time: dayjs().format("YYYY-MM-DD"), // 退货日期
    out_time: dayjs().format("YYYY-MM-DD"), //出库日期
  },
  rowList: ["barcode", "title", "spec", "warehouse_name", "batch_number"], //传给自定义组件的数据

  drawerShow: false, //抽屉弹窗开关
  // selectData: [] as IinStockItem[], //可选择的列表
});

const { form, rowList, drawerShow } = toRefs(state);
const { procure_no, goods } = toRefs(state.form);
const goodsLen = computed(() => {
  return goods.value.length;
});
let { stockIdList, stockNumList, detailGoodsList } = useUniqueHooks<IRetGoodsDirect>(goods);
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
  warehouse_name: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
});

const formRef = ref<FormInstance>();
const batchSelectRef = ref<batchApi | null>(null);

const emit = defineEmits<{
  (e: "sendData", data: {}): void;
  (e: "sendInfo", data: {}): void;
  (e: "sendLoad"): void;
}>();

const handleDelete = (row: IRetGoodsDirect, index: number) => {
  let valueArr = goods.value.splice(index, 1);
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击了添加");
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      goods.value.push({
        goods_id: 0,
        unique: "",
        barcode: "",
        title: "",
        spec: "",
        ret_num: undefined,
        sup_name: "",
        note: "",
        measure_name: "",
        brand: "",
        class_name: "",
        warehouse_id: 0,
        warehouse_name: "",
        ph_no: "",
        old_num: 1,
        stock_id: 0,
        price: "",
      });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// 点击批量添加
const handleBatchAdd = () => {
  drawerShow.value = true;
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectData: IinStockItem[]) => {
  console.log("selectData", selectData);
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    goods.value.push({
      goods_id: item.goods_id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.batch_number,
      ret_num: item.stock,
      old_num: item.stock,
      unique: item.unique as string,
      note: "",
      stock_id: item.stock_id,
      price: item.price,
    });
  });
  batchSelectRef.value?.setStatus();
  // tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
};

// select下拉选择框的选择触发事件
const selectChange = (item: IinStockItem, row: IRetGoodsDirect) => {
  console.log("item", item);

  row.unique = item.unique;
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
  row.ret_num = item.stock;
  row.old_num = item.stock;

  row.goods_id = item.goods_id;
  row.stock_id = item.stock_id;
  row.price = item.price;
  console.log("goods", goods.value);
};

// 编辑时 请求详情数据
const getDetail = (data: IRetGoodsDetail) => {
  let old_goods = data.goods;
  let new_goods = old_goods.map((item) => {
    return changeDetailData(item);
  });
  detailGoodsList.value = cloneDeep(new_goods);
  goods.value = new_goods;
  emit("sendLoad");
  // try {
  //   const result = await detailRetGoodsApi({ id });
  //   let note = result.data.note;
  //   let file_info = result.data.file_info;
  //   let type = result.data.type;
  //   emit("sendInfo", { file_info, note,type });
  //   console.log("result.data.goods;", result.data.goods);
  //   let old_goods = result.data.goods;
  //   let new_goods = old_goods.map((item) => {
  //     return changeDetailData(item);
  //   });
  //   detailGoodsList.value = cloneDeep(new_goods);
  //   goods.value = new_goods;
  // } finally {
  //   emit("sendLoad");
  // }
};

// 验证是否满足规则
const validateForm = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return false;
  }
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      emit("sendData", {
        goods: goods.value,
        procure_no: procure_no.value,
        return_time: form.value.return_time,
        out_time: form.value.out_time,
        type: 0,
      });
      return true;
    } else {
      return false;
    }
  });
};

async function getCodeInfo() {
  let code = props.inputBarcode;
  let data = {
    content: code,
    document_type: 2, //退货出库单 2
  };
  const result = await getLabelInfoApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;
  let success_num = 0;
  let fail_num = 0;
  findList.forEach((element: any) => {
    let findRes = goods.value.find((item) => {
      return element.stock_id == item.stock_id;
    });
    if (!findRes) {
      goods.value.push({
        goods_id: element.goods_id,
        barcode: element.barcode,
        title: element.title,
        spec: element.spec,
        brand: element.brand,
        measure_name: element.measure_name,
        class_name: element.class_name,
        warehouse_id: element.warehouse_id,
        warehouse_name: element.warehouse_name,
        ph_no: element.batch_number,
        ret_num: element.stock,
        old_num: element.stock,
        unique: element.unique,
        note: "",
        stock_id: element.stock_id,
        price: element.price,
      });
      success_num += 1;
    } else {
      fail_num += 1;
    }
  });
  fail_num === 0
    ? ElMessage.info(`成功添加${success_num}条数据`)
    : ElMessage.info(`成功添加${success_num}条商品,${fail_num}条商品已存在`);
}

// 处理扫描的条码
// function getCodeInfo() {
//   if (selectData.value.length == 0) {
//     ElMessage.warning("当前没有可选的商品数据");
//     return;
//   }
//   let findList = selectData.value.filter((item) => {
//     if (item.barcode == props.inputBarcode) {
//       item.select_status = true;
//     }
//     return item.barcode == props.inputBarcode;
//   });

//   if (findList.length === 0)
//     return ElMessage.warning(`扫描的条码${props.inputBarcode}商品不在可选范围内`);

//   let success_num = 0;
//   let fail_num = 0;
//   findList.forEach((element) => {
//     let findRes = goods.value.find((item) => {
//       return element.unique === item.unique;
//     });
//     // 如果不存在则添加
//     if (!findRes) {
//       goods.value.push({
//         goods_id: element.goods_id,
//         barcode: element.barcode,
//         title: element.title,
//         spec: element.spec,
//         brand: element.brand,
//         measure_name: element.measure_name,
//         class_name: element.class_name,
//         warehouse_id: element.warehouse_id,
//         warehouse_name: element.warehouse_name,
//         ph_no: element.batch_number,
//         ret_num: element.stock,
//         unique: element.unique as string,
//         note: "",
//         old_num: element.stock,
//         stock_id: element.stock_id,
//       });
//       success_num += 1;
//     } else {
//       fail_num += 1;
//     }
//   });

//   fail_num === 0
//     ? ElMessage.info(`成功添加${success_num}条数据`)
//     : ElMessage.info(`成功添加${success_num}条商品,${fail_num}条商品已存在`);
// }

defineExpose({
  validateForm: validateForm,
  getDetail: getDetail,
  getCodeInfo: getCodeInfo,
  goodsLen: goodsLen,
});

function changeDetailData(data: RetGoodsGoods) {
  let {
    unique,
    goods_id,
    id,
    barcode,
    brand,
    class_name,
    measure_name,
    ph_no,
    note,
    ret_num,
    spec,
    sup_name,
    title,
    warehouse_name,
    warehouse_id,
    stock,
    stock_id,
    price,
  } = data;
  let old_num = ret_num + stock;
  return {
    unique,
    goods_id,
    id,
    title,
    barcode,
    spec,
    brand,
    measure_name,
    class_name,
    ret_num,
    sup_name,
    ph_no: ph_no ?? "",
    warehouse_name,
    warehouse_id,
    note,
    old_num,
    stock_id,
    price,
  };
}
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form">
      <div class="flex">
        <el-form-item label="退货日期" prop="return_time">
          <el-date-picker
            style="width: 100%"
            v-model="form.return_time"
            type="date"
            placeholder="请选择退货日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="出库日期" prop="out_time" class="ml-[20px]">
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
      <el-table :data="form.goods" border stripe height="800" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.barcode || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="title" class="table-item" width="200">
          <template #header>
            <span class="text-red-500">*</span>
            <span>名称</span>
          </template>
          <template #default="scope">
            <el-form-item :prop="`goods.${scope.$index}.title`" :rules="rules.title">
              <InStoSelect
                :stockIdList="stockIdList"
                :detailStockIdList="stockNumList"
                :page-type="pageType"
                :title="scope.row.title"
                :rowList="rowList"
                @change="selectChange($event, scope.row)"
              ></InStoSelect>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="spec" show-overflow-tooltip>
          <template #default="scope">
            <el-form-item>
              <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                {{ scope.row.spec || "-" }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.brand || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="class_name">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.class_name || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="measure_name" width="120">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.measure_name || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="出库仓库" prop="warehouse_name" min-width="160">
          <template #header>
            <span class="text-red-500">*</span>
            <span>出库仓库</span>
          </template>
          <template #default="scope">
            <div class="item">
              <el-form-item :prop="`goods.${scope.$index}.warehouse_name`">
                <span>{{ scope.row.warehouse_name || "-" }}</span>
              </el-form-item>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="出库数量" prop="ret_num" width="160">
          <template #header>
            <span class="text-red-500">*</span>
            <span>出库数量</span>
          </template>
          <template #default="scope">
            <div class="item">
              <el-form-item
                :prop="`goods.${scope.$index}.ret_num`"
                :rules="[
                  {
                    required: true,
                    message: '请输入出库数量',
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
                <el-input v-model.number="scope.row.ret_num" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="批次/日期" prop="ph_no" min-width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.ph_no || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- <el-table-column label="生产日期" prop="pro_time" width="120">
          <template #default="scope">
            <div class="item">
              <el-form-item :prop="`goods.${scope.$index}.pro_time`">
                <el-input
                 
                  v-model.number="scope.row.pro_time"
                  placeholder=""
                  disabled
                ></el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="供应商" prop="sup_name" width="160">
          <template #default="scope">
            <el-form-item :prop="`goods.${scope.$index}.sup_name`" :rules="rules.sup_name">
              <el-input v-model="scope.row.sup_name" disabled></el-input>
            </el-form-item>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="单价" prop="price">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.price || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column> -->
        <el-table-column label="备注" prop="note" width="180">
          <template #default="scope">
            <el-form-item>
              <div class="item">
                <el-input
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
              <el-button
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.row, scope.$index)"
              >
                删除
              </el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex justify-center mt-[20px] relative">
      <slot name="note"></slot>
      <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button>
      <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
        批量添加
      </el-button>
    </div>
    <InStoBatchSelect
      :stock-id-list="stockIdList"
      ref="batchSelectRef"
      v-model="drawerShow"
      @change="batchSelectchange"
    ></InStoBatchSelect>
  </div>
</template>

<style scoped lang="scss"></style>
