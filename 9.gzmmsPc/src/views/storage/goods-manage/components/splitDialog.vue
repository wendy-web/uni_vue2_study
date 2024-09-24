<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { AxiosResponse } from "axios";
// 导入公用api类型
import { ICateItem, IGoodsItem } from "@/api/common/types";
// 导入新建商品api
import { addGoodsApi, getBarcodeInfoApi, setSplitApi } from "@/api/storage/goods-manage";
import { IAddGoods } from "@/api/storage/goods-manage/types";
import { clearScanCode, scanCode } from "@/utils/scanCode";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  parent_id: {
    type: Number,
    default: 0,
  },
  goodsCateList: Array as PropType<ICateItem[]>,
  unitList: Array as PropType<ICateItem[]>,
});

const formData = ref({
  barcode: "",
  title: "", //商品名称
  spec: "", //规格
  brand: "", //品牌
  company: "", //公司
  price: "", //价格
  img_url: "", // 图片
  class_name: "", //类别
  measure_name: "", //单位
  ss_num: "", //安全库存
  order_point: "", //订货点
  purchase_price: "", //默认价格
  goods_class: "", //自定义分类
  quantity: "",
  is_unique_identify: 0, //是否唯一标识管理；0：不是；1：是
  is_expensed_assets: 0, //是否费用化资产；0：不是；1：是
  exp_day: "", //保质期(天)
  exp_warning_day: "", //保质期预警天数
});

const formRef = ref<FormInstance>();
const allDisable = ref(true);

const validateBarcode = (rule: any, value: any, callback: any) => {
  if (value.length > 0 && value.length < 8) {
    callback(new Error("条码长度最低8位"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  quantity: {
    required: true,
    message: "请输入拆零数量关系",
    trigger: "blur",
  },
  title: [
    {
      required: true,
      message: "请输入商品名称",
      trigger: "blur",
    },
  ],
  barcode: [
    {
      validator: validateBarcode,
      trigger: "blur",
    },
  ],
  class_name: [
    {
      required: true,
      message: "请选择分类",
      trigger: "change",
    },
  ],
  measure_name: [
    {
      required: true,
      message: "请选择计量单位",
      trigger: "change",
    },
  ],
});

const split_goods_id = ref(0);
const btnLoading = ref(false);
const input_barcode = ref("");

let emits = defineEmits(["update:visible", "setSuccess"]);
let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    console.log("val", val);
    emits("update:visible", false);
  },
});

// 点击保存按钮
function clickSave() {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log("submit!");
      createAndSet();
    } else {
      console.log("error submit!");
    }
  });
}

// 条码输入框 失去焦点时 触发
const handeleBlurBarcode = () => {
  let barcode = formData.value.barcode;
  if (barcode && barcode.length >= 8) {
    console.log("如果条码存在");
    formRef.value?.clearValidate();
    getBarcodeInfo();
  }
};

async function getBarcodeInfo() {
  const result = await getBarcodeInfoApi({ barcode: formData.value.barcode });
  console.log("result", result);
  formData.value.title = result.data.title;
  formData.value.spec = result.data.spec;
  formData.value.brand = result.data.brand;
  formData.value.company = result.data.company;
  formData.value.price = result.data.price;
  formData.value.img_url = result.data.img_url;
  formData.value.class_name = result.data.class_name;
  formData.value.measure_name = result.data.measure_name;
  formData.value.ss_num = result.data.ss_num;
  formData.value.order_point = result.data.order_point;
  formData.value.purchase_price = result.data.purchase_price;
  formData.value.goods_class = result.data.goods_class;
  split_goods_id.value = result.data.id;
}

async function createAndSet() {
  let child_id = 0;
  let result = {} as AxiosResponse;
  if (!split_goods_id.value) {
    try {
      btnLoading.value = true;
      let data = formData.value;
      console.log("data", data);
      result = await addGoodsApi(data);
      child_id = result.data.id;
    } finally {
      btnLoading.value = false;
    }
  }

  if (props.parent_id) {
    try {
      // 如果props.parent_id存在,表示是编辑页面传递过来的,此时是编辑设置
      btnLoading.value = true;
      const res = await setSplitApi({
        parent_id: props.parent_id,
        child_id: split_goods_id.value ? split_goods_id.value : child_id,
        quantity: formData.value.quantity,
      });
      visibleDialog.value = false;
      ElMessage.success(res.msg);
      emits("setSuccess");
    } finally {
      btnLoading.value = false;
    }
  } else {
    // 如果props.parent_id不存在,表示是新建页面,设置
    visibleDialog.value = false;
    ElMessage.success(result.msg);
    let barcode = split_goods_id.value ? formData.value.barcode : result.data.barcode;
    let id = split_goods_id.value ? split_goods_id.value : result.data.id;
    formData.value.barcode = barcode;
    let data = {
      split_goods_id: id,
      ...formData.value,
    };
    emits("setSuccess", data);
  }
}

function scanCodeInfo() {
  formData.value.barcode = input_barcode.value;
  getBarcodeInfo();
}

onMounted(() => {
  // console.log("拆零商品组件加载了")
  scanCode(input_barcode, scanCodeInfo);
});
onUnmounted(() => {
  // console.log("拆零商品组件卸载了")
  clearScanCode();
});

function beforeClose() {
  formRef.value?.clearValidate();
}
</script>
<template>
  <!-- <div class="split-wrapper"> -->
  <el-dialog v-model="visibleDialog" title="设置拆零商品" width="40%" draggable destroy-on-close>
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      label-width="80"
      label-position="left"
      class="ml-[10px]"
    >
      <div class="flex">
        <el-form-item label="拆零条码" prop="barcode">
          <el-input
            v-model="formData.barcode"
            placeholder="请输入/扫描条码"
            @blur="handeleBlurBarcode"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="拆零数量关系"
          prop="quantity"
          label-width="108"
          class="ml-[26px] font-bold"
        >
          <el-input v-model="formData.quantity" placeholder="请输入数量"></el-input>
        </el-form-item>
      </div>
      <div class="text-gray-400 text-[14px] mt-[-10px] mb-[20px]">
        注：无条码商品无需填写条码，系统会自动生成
      </div>
      <div class="basic mb-[40px]">
        <div class="font-bold mb-[20px] text-[14px]">基本信息</div>
        <div class="flex">
          <el-form-item label="名称" prop="title">
            <el-input v-model="formData.title" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="spec" class="ml-[42px]" label-width="82">
            <el-input v-model="formData.spec" placeholder="请输入规格型号"></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="分类" prop="class_name">
            <el-select
              v-model="formData.class_name"
              placeholder="请选择分类"
              clearable
              filterable
              style="width: 90%"
              default-first-option
            >
              <el-option
                v-for="item in goodsCateList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brand" label-width="82" class="ml-[20px]">
            <el-input v-model="formData.brand" placeholder="请输入品牌"></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="计量单位" prop="measure_name">
            <el-select
              v-model="formData.measure_name"
              placeholder="请选择计量单位"
              clearable
              filterable
              style="width: 90%"
              default-first-option
            >
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义类别" prop="goods_class" label-width="82" class="ml-[20px]">
            <el-input v-model="formData.goods_class" placeholder="请输入自定义类别"></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="保质期(天)" prop="exp_day">
            <el-input v-model="formData.exp_day" placeholder="请输入" v-inputnum.int></el-input>
          </el-form-item>
          <el-form-item label="保质期预警(天)" prop="exp_warning_day" class="ml-[42px]" label-width="130">
            <template #label>
              <span>保质期预警(天)</span>
              <el-tooltip effect="dark" content="值为空时不会预警" placement="top">
                <i-ep-QuestionFilled></i-ep-QuestionFilled>
              </el-tooltip>
            </template>
            <el-input
              v-model="formData.exp_warning_day"
              placeholder="请输入"
              v-inputnum.int
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="默认价格" prop="purchase_price">
          <el-row :gutter="0">
            <el-input v-model="formData.purchase_price" placeholder="请输入默认价格"></el-input>
          </el-row>
        </el-form-item>
        <div class="flex">
          <el-form-item label="是否标识管理" prop="is_unique_identify" label-width="120">
            <template #label>
              <span>是否标识管理</span>
              <el-tooltip effect="dark" content="不可随意修改" placement="top">
                <i-ep-WarningFilled></i-ep-WarningFilled>
              </el-tooltip>
            </template>
            <el-switch
              v-model="formData.is_unique_identify"
              inline-prompt
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="是否费用化资产" prop="is_expensed_assets" class="ml-[42px]" label-width="110">
            <el-switch
              v-model="formData.is_expensed_assets"
              inline-prompt
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </div>
      </div>
      <!-- <div class="inventory">
          <div class="font-bold mb-[20px] text-[14px]">库存信息</div>
          <div class="flex">
            <el-form-item label="安全库存" prop="ss_num">
              <el-input v-model="formData.ss_num" placeholder="请输入安全库存"></el-input>
            </el-form-item>
            <el-form-item label="订货点" prop="order_point" class="ml-[42px]">
              <el-row :gutter="30">
                <el-input v-model="formData.order_point" placeholder="请输入订货点"></el-input>
              </el-row>
            </el-form-item>
          </div>
        </div> -->
    </el-form>
    <template #footer>
      <span>
        <el-button @click="visibleDialog = false" size="large" class="w-[100px]">关闭</el-button>
        <el-button type="primary" @click="clickSave" size="large" class="w-[100px]">保存</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- </div> -->
</template>
<style lang="scss" scoped></style>
