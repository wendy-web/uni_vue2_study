<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import printJS from "print-js";
import { scanCodeApi } from "@/api/common/index";
// 导入公用api类型
import { ICateItem } from "@/api/common/types";
// 导入编辑商品api
import { editGoodsApi, goodsDetailApi } from "@/api/storage/goods-manage";
import { IEditGoods, IGoodsItem } from "@/api/storage/goods-manage/types";
// 导入条形码组件
// import Barcode from "@/components/Barcode/index.vue";
// 导入二维码组件
import qrcode from "@/components/Barcode/qrcode.vue";
import { usePrint } from "@/hooks/print";
import goodsLogVue from "./components/goodsLog.vue";
import splitDialog from "./components/splitDialog.vue";

export interface Props {
  // formInfo: IGoodsItem; //编辑表单信息
  goodsId: number;
  goodsCateList: ICateItem[]; //分类列表
  unitList: ICateItem[]; //计量单位列表
}

const props = defineProps<Props>();
const { onePrint } = usePrint();

const state = reactive({
  formData: {
    // barcode:"",
    // title: "", //商品名称
    // spec: "", //规格
    // brand: "", //品牌
    // company: "", //公司
    // price: "", //价格
    // img_url: "", // 图片
    // class_name: "", //类别
    // measure_name: "", //单位
    // ss_num: "", //安全库存
    // order_point: "", //订货点
  } as IEditGoods,
  activeName: "first",
});

const { formData, activeName } = toRefs(state);
const pageLoading = ref(false);

const barcodeInfo = computed(() => {
  return {
    barcode: formData.value.barcode as string,
    title: formData.value.title as string,
    spec: formData.value.spec as string,
    content: formData.value.barcode as string,
  };
});
const splitShow = ref(false);

// const formData = reactive<IAddGoods>({
//   barcode: "",
//   title: "", //商品名称
//   spec: "", //规格
//   brand: "", //品牌
//   company: "", //公司
//   price: "", //价格
//   img_url: "", // 图片
//   class_name: "", //类别
//   measure_name: "", //单位
//   ss_num: "", //安全库存
//   order_point: "", //订货点
// })

const addform = ref<FormInstance>();
// const barcodeRef = ref<InstanceType<typeof Barcode>>();
const goods_id = ref(props.goodsId);

const qrcodeRef = ref<typeof qrcode>();

const emit = defineEmits(["aboutEdit"]);

const validateBarcode = (rule: any, value: any, callback: any) => {
  if (value.length > 0 && value.length < 8) {
    callback(new Error("条码长度最低8位"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
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

function setRefresh() {
  getData(true);
}

// 条形码input失去焦点和回车触发
const handeleBlurBarcode = (event: FocusEvent) => {
  let inputValue = (event.target as HTMLInputElement).value;
  console.log("inputValue", inputValue, inputValue.length);
  // 6920202888883
  if (inputValue.length >= 13) {
    getBarcodeInfo();
  }
};

// 点击 获取条形码信息 触发事件
const handleBarcode = () => {
  let barcode = formData.value.barcode as string;
  if (barcode.length >= 13) {
    getBarcodeInfo();
  }
};
const getBarcodeInfo = async () => {
  let data = {
    barcode: formData.value.barcode as string,
  };
  const result = await scanCodeApi(data);
  console.log(result);
  if (result.code === "0") {
    return ElMessage.warning(result.msg);
  }
  let { title, brand, spec, company, price, img_url } = result.data;
  formData.value.title = title;
  formData.value.brand = brand;
  formData.value.spec = spec;
  formData.value.price = price as string;
  formData.value.company = company;
  formData.value.img_url = img_url;
};

// 点击取消 显示列表页
const handeleCancel = () => {
  addform.value?.clearValidate();
  emit("aboutEdit", 1);
};
// 点击保存 显示详情页
const hanleSave = () => {
  addform.value?.validate(async (valid) => {
    if (valid) {
      console.log("submit!");
      sendEdit();
    } else {
      console.log("error submit!");
    }
  });
};

// 发送编辑数据api
const sendEdit = async () => {
  let data = {
    ...formData.value,
  };
  const result = await editGoodsApi(data);
  ElMessage.success(result.msg);
  let detailForm = result.data;
  setTimeout(() => {
    emit("aboutEdit", 2, detailForm);
  }, 500);
};

async function getData(refreshSplit = false) {
  try {
    pageLoading.value = true;
    const result = await goodsDetailApi({ id: goods_id.value });
    if (!refreshSplit) {
      formData.value = result.data;
    } else {
      // 如果refreshSplit传了true，则只更新split_goods
      formData.value.split_goods = result.data.split_goods;
    }
  } finally {
    pageLoading.value = false;
  }
}

watch(
  () => props.goodsId,
  (newVal: number, oldVal) => {
    goods_id.value = newVal;
    getData();
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="编辑货品" name="first" class="bg-white">
          <div v-loading="pageLoading">
            <el-form
              :model="formData"
              ref="addform"
              :inline="false"
              label-width="130"
              label-position="left"
              :rules="rules"
            >
              <div class="top">
                <div v-if="formData.barcode" class="mb-[10px] flex">
                  <!-- <barcode :value="formData.barcode" ref="barcodeRef"></barcode> -->

                  <qrcode :info="barcodeInfo" ref="qrcodeRef"></qrcode>
                  <el-button type="primary" link @click="onePrint(barcodeInfo)" class="ml-[10px]">
                    <template #icon>
                      <svg-icon icon-class="print"></svg-icon>
                    </template>
                    打印标签
                  </el-button>
                </div>
                <!-- @blur="handeleBlurBarcode($event)"
              @keyup.enter.native="$event.target.blur()" -->
                <el-form-item label="货品条码" prop="barcode">
                  <el-input
                    v-model.trim="formData.barcode"
                    placeholder="请输入条形码"
                    clearable
                    style="width: 200px; margin-right: 20px"
                  ></el-input>
                  <el-button type="primary" link @click="handleBarcode">获取条形码信息</el-button>
                </el-form-item>

                <div class="text-gray-400 text-[14px] mt-[20px]">
                  注：无条码商品无需填写条码，系统会自动生成
                </div>
              </div>
              <div class="info">
                <div class="basic mb-[40px]">
                  <div class="font-bold mb-[20px] text-[14px]">基本信息</div>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="名称" prop="title">
                        <el-input v-model="formData.title" placeholder="请输入名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="规格型号" prop="spec">
                        <el-input v-model="formData.spec" placeholder="请输入规格型号"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="分类" prop="class_name">
                        <el-select
                          v-model="formData.class_name"
                          placeholder="请选择分类"
                          clearable
                          filterable
                          style="width: 100%"
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
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="品牌" prop="brand">
                        <el-input v-model="formData.brand" placeholder="请输入品牌"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="计量单位" prop="measure_name">
                        <el-select
                          v-model="formData.measure_name"
                          placeholder="请选择计量单位"
                          clearable
                          filterable
                          style="width: 100%"
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
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="自定义类别" prop="goods_class">
                        <el-input
                          v-model="formData.goods_class"
                          placeholder="请输入自定义类别"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="保质期(天)" prop="exp_day">
                        <el-input
                          v-model="formData.exp_day"
                          placeholder="请输入"
                          v-inputnum.int
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="保质期预警(天)" prop="exp_warning_day">
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
                    </el-col>
                  </el-row>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="默认价格" prop="purchase_price">
                        <el-input
                          v-model="formData.purchase_price"
                          placeholder="请输入默认价格"
                          v-inputnum.num_point
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="是否标识管理" prop="is_unique_identify">
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
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="是否费用化资产" prop="is_expensed_assets">
                        <el-switch
                          v-model="formData.is_expensed_assets"
                          inline-prompt
                          active-text="是"
                          inactive-text="否"
                          :active-value="1"
                          :inactive-value="0"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <!-- <div class="inventory">
                  <div class="font-bold mb-[20px] text-[14px]">库存信息</div>
                  <el-row :gutter="40">
                    <el-col :span="6" :offset="0">
                      <el-form-item label="安全库存" prop="ss_num">
                        <el-input v-model="formData.ss_num" placeholder="请输入安全库存"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="0">
                      <el-form-item label="订货点" prop="order_point">
                        <el-input
                          v-model="formData.order_point"
                          placeholder="请输入订货点"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div> -->
                <div>
                  <div class="font-bold mb-[20px] text-[14px]">拆零信息</div>
                  <el-button type="primary" size="default" @click="splitShow = true">
                    设置拆零规则
                  </el-button>
                  <el-table :data="formData.split_goods" border>
                    <el-table-column prop="assemble_goods.barcode" label="条码"></el-table-column>
                    <el-table-column prop="assemble_goods.title" label="名称"></el-table-column>
                    <el-table-column prop="assemble_goods.brand" label="品牌"></el-table-column>
                    <el-table-column
                      prop="assemble_goods.goods_class"
                      label="自定义类别"
                    ></el-table-column>
                    <el-table-column prop="assemble_goods.spec" label="规格型号"></el-table-column>
                    <el-table-column
                      prop="assemble_goods.measure_name"
                      label="计量单位"
                    ></el-table-column>
                    <el-table-column
                      prop="assemble_goods.class_name"
                      label="分类"
                    ></el-table-column>
                    <el-table-column
                      prop="assemble_goods.purchase_price"
                      label="默认价格"
                    ></el-table-column>
                    <el-table-column prop="assemble_goods.is_unique_identify" label="是否标识管理">
                      <template #default="{ row }">
                        <span>{{ row.assemble_goods?.is_unique_identify ? "是" : "否" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="assemble_goods.is_expensed_assets"
                      label="是否费用化资产"
                    >
                      <template #default="{ row }">
                        <span>{{ row.assemble_goods?.is_expensed_assets ? "是" : "否" }}</span>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column
                      prop="assemble_goods.order_point"
                      label="订货点"
                    ></el-table-column> -->
                    <!-- <el-table-column
                      prop="assemble_goods.ss_num"
                      label="安全库存"
                    ></el-table-column> -->
                    <el-table-column prop="quantity" label="拆零数量关系"></el-table-column>
                  </el-table>
                </div>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <goodsLogVue :goods-id="goods_id"></goodsLogVue>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div class="footer mt-[20px] pb-[20px]">
      <el-button size="large" class="w-[140px]" @click="handeleCancel">取消</el-button>
      <el-button
        type="primary"
        size="large"
        @click="hanleSave"
        class="w-[140px]"
        v-if="activeName == 'first'"
      >
        保存
      </el-button>
    </div>
    <splitDialog
      v-model:visible="splitShow"
      :parent_id="goodsId"
      :goodsCateList="goodsCateList"
      :unitList="unitList"
      @set-success="setRefresh"
    ></splitDialog>
  </div>
</template>

<style scoped lang="scss">
.app-card {
  padding: 20px 0 60px 20px;
}

.top {
  border-bottom: 1px solid #dadada;
  padding-bottom: 20px;
  margin-bottom: 20px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
}
// .ceshi {
//   position: absolute;
//   left: -80;
//   top: -80;
//   z-index: -99;
// }
</style>
