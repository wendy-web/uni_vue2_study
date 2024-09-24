<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
// 引入类型
import { GetImportList, ICateItem, IProcureItem } from "@/api/common/types";
// 引入类型
import {
  IRetGoodsAdd,
  IRetGoodsDetail,
  IRetGoodsDirect,
  RetGoodsGoods,
} from "@/api/storage/ret-goods/types";
import { formartDate } from "@/utils/validate";
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import type { ElSelectType } from "../utils/hook";
import selectGoods from "./selectGoods.vue";

export interface API {
  validateForm: () => Boolean;
  getDetail: (id: IRetGoodsDetail) => void;
  getCodeInfo: () => void;
  goodsLen: number;
}

interface Props {
  pageType: number;
  procureList: IProcureItem[]; //采购单列表数据
  inputBarcode: string;
  storageFilterList: ICateItem[]; //仓库列表数据
}
const props = withDefaults(defineProps<Props>(), {
  pageType: 1,
  procureList: () => [] as IProcureItem[],
  storageFilterList: () => [] as ICateItem[],
  inputBarcode: "",
});

const state = reactive({
  formData: {
    goods: [] as IRetGoodsDirect[],
    procure_no: "", //采购单号
    procure_id: undefined as FormNumType, //采购单id
    out_wh_id: undefined as FormNumType, //出库仓库id
    out_wh_name: "", //出库仓库name
    out_time: dayjs().format("YYYY-MM-DD"), //出库日期
  },
});

const warehouseSelectRef = ref<ElSelectType>();

const { formData } = toRefs(state);
const { procure_no, goods } = toRefs(state.formData);
const goodsLen = computed(() => {
  return goods.value.length;
});
const rules = reactive<FormRules>({
  procure_no: [
    {
      required: true,
      message: "请选择采购单号",
      trigger: "change",
    },
  ],
  warehouse_id: [
    {
      required: true,
      message: "请选择出库仓库",
      trigger: "change",
    },
  ],
});

const drawerShow = ref(false);

const formRef = ref<FormInstance>();
const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();
const selectGoodsRef = ref<InstanceType<typeof selectGoods>>();
const idsList = computed(() => {
  return goods.value.map((item) => item.stock_id);
});

const emit = defineEmits<{
  (e: "sendData", data: {}): void;
  (e: "sendInfo", data: {}): void;
  (e: "sendLoad"): void;
}>();

const orderChange = (index: number) => {
  console.log(index);
  let item = props.procureList[index];
  formData.value.procure_no = item.procure_no;
  formData.value.procure_id = item.id;
  handleImport();
};

// 点击导入货品
const handleImport = async () => {
  selectGoodsRef.value?.clearTable()
  if (!formData.value.out_wh_id) {
    return;
  }
  let data = {
    procure_no: formData.value.procure_no,
    warehouse_id: formData.value.out_wh_id,
  };

  const result = await selectGoodsRef.value?.getData(data);
  if (result && props.pageType !== 2) {
    ElMessage.success("导入成功,请点击选择商品添加货品");
  }
};

// 点击选择商品按钮
const handleSelect = () => {
  drawerShow.value = true;
};

// 监听子组件选择商品的事件
const batchSelectchange = (selectList: GetImportList[]) => {
  let datalength = selectList.length;
  selectList.forEach((item) => {
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
      ret_num: item.rem_num,
      old_num: item.rem_num,
      note: "",
      stock_id: item.stock_id,
      price: item.price,
    });
  });
  selectGoodsRef.value?.setStatus();
  ElMessage.success(`已批量添加${datalength}条商品`);
};

// 单元格点击删除
const handleDelete = (row: IRetGoodsAdd, index: number) => {
  // 点击删除时,goods数组-1;并返回删除的数组
  let valueItem = goods.value.splice(index, 1);
};

// 编辑时 请求详情数据
const getDetail = (data: IRetGoodsDetail) => {
  procure_no.value = data.procure_no;
  formData.value.procure_id = data.procure_id;
  formData.value.out_time = formartDate(data.out_time);
  formData.value.out_wh_id = data.out_wh_id;
  formData.value.out_wh_name = data.out_wh_name;
  formData.value.goods = changeDetailGoods(data.goods);
  emit("sendLoad");
  handleImport();
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
        procure_id: formData.value.procure_id,
        out_wh_id: formData.value.out_wh_id,
        out_wh_name: formData.value.out_wh_name,
        out_time: formData.value.out_time,
        type: 1,
      });
      return true;
    } else {
      return false;
    }
  });
};
function getCodeInfo() {}

function changeDetailGoods(list: RetGoodsGoods[]) {
  let arr = list.map((item) => {
    return {
      goods_id: item.goods_id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.ph_no,
      ret_num: item.ret_num,
      old_num: item.max_rem_num,
      note: "",
      stock_id: item.stock_id,
      price: item.price,
    };
  });
  return arr;
}

defineExpose({
  validateForm: validateForm,
  getDetail: getDetail,
  getCodeInfo: getCodeInfo,
  goodsLen: goodsLen,
});

watchEffect(() => {
  if (warehouseSelectRef.value) {
    formData.value.out_wh_name = warehouseSelectRef.value.selected.currentLabel;
  }
});
</script>
<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="rules">
      <div class="flex">
        <el-form-item label="采购单号" prop="procure_no" class="mr-4">
          <order-select
            :order-num="procure_no"
            @change="orderChange"
            :list="procureList"
            :isDisabled="pageType == 2 || goods.length > 0"
            ref="orderSelecteRef"
          ></order-select>
        </el-form-item>
        <el-form-item label="出库仓库" prop="procure_no">
          <el-select
            v-model="formData.out_wh_id"
            :placeholder="formData.procure_no ? '请选择出库仓库' : '请先选择采购单号'"
            filterable
            :disabled="goods.length > 0 || !formData.procure_no"
            @change="handleImport"
            ref="warehouseSelectRef"
          >
            <el-option
              v-for="item in storageFilterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库日期" prop="out_time" class="ml-[20px]">
          <el-date-picker
            style="width: 100%"
            v-model="formData.out_time"
            type="date"
            placeholder="请选择出库日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </el-form-item>
      </div>
      <el-table :data="formData.goods" border stripe height="800">
        <el-table-column label="条码" prop="barcode" width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.barcode || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="title" class="table-item" width="200">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.title }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="spec" show-overflow-tooltip width="200">
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
        <el-table-column label="可出库数" prop="ret_num" width="160">
          <template #header>
            <span class="text-red-500">*</span>
            <span>可出库数</span>
          </template>
          <template #default="scope">
            <div class="item">
              <el-form-item
                :prop="`goods.${scope.$index}.ret_num`"
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
                <el-input v-model.number="scope.row.ret_num" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="批次/日期" prop="ph_no" width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.ph_no || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="库位" prop="ws_code" width="120">
          <template #default="scope">
            <span class="table-span">{{ scope.row.ws_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" prop="in_wh_date" width="120">
          <template #default="scope">
            <span class="table-span">{{ scope.row.in_wh_date }}</span>
          </template>
        </el-table-column>

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
              <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">
                <template #icon>
                  <i-ep-delete></i-ep-delete>
                </template>
                删除
              </el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex justify-center mt-[20px] relative">
      <slot name="note"></slot>
      <el-tooltip
        effect="dark"
        content="请先选择采购单和仓库"
        placement="top-start"
        :disabled="Boolean(formData.procure_no && formData.out_wh_id)"
      >
        <el-button type="success" :icon="Plus" @click="handleSelect" class="w-[100px]">
          选择商品
        </el-button>
      </el-tooltip>
    </div>
    <selectGoods
      v-model="drawerShow"
      :ids="idsList"
      ref="selectGoodsRef"
      @change="batchSelectchange"
    ></selectGoods>
  </div>
</template>

<style scoped lang="scss"></style>
