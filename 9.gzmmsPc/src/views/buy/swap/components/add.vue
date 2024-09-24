<script setup lang="ts">
import GoodsBatch from "@/components/BatchSelect/GoodsBatch.vue";
import DropLoad from "@/components/SelectDrop/DropLoad.vue";
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import { procureListHooks } from "@/hooks/index";
import { useAddEdit } from "../utils/add";
import { EAddTitle, Props } from "../utils/types";

defineOptions({
  name: "swapOrderAdd",
});

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
});
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: any): void;
}>();

const { procureList } = procureListHooks(2);
const {
  formRef,
  pageType,
  formData,
  procure_no,
  refundGoods,
  buyGoods,
  replacement_data,
  tableLoading,
  delIds,
  handleRefundDelete,
  selectRefund,
  handleRecover,
  handleImport,
  goodsList,
  selectLoading,
  supList,
  departmentList,
  selectChange,
  bindInputBlur,
  visibleChange,
  supChange,
  handleDelete,
  handleAdd,
  handleBatchAdd,
  getData,
  drawerShow,
  batchSelectchange,
  selectBuy,
  tableRowClassName,
  buyRules,
  note,
  file_info,
  getDetail,
  handleSwap,
} = useAddEdit();

const headerTitle = computed(() => {
  return EAddTitle[pageType.value];
});
// 选择采购单号触发
const orderChange = (index: number) => {
  console.log(index);
  let item = procureList.value[index];
  formData.procure_no = item.procure_no;
  handleImport();
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
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
  if (refundGoods.value.length === 0) {
    return ElMessage.warning("请您先添加换货商品数据");
  } else if (buyGoods.value.length === 0) {
    return ElMessage.warning("请您先添加换回商品数据");
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          procure_no: procure_no.value,
          id: props.listId,
          refundGoods: refundGoods.value,
          buyGoods: buyGoods.value,
          note: note.value,
          file_info: file_info.value,
          replacement_data: replacement_data.value,
        },
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  if (props.editFrom != 0 && pageType.value == 1) {
    // 如果不是从预览页返回且是新建页面
    getData();
  }
  /*
    当是编辑页时需要判断
    props.editFrom值来判断
    是否获取详情数据,如果为0从pre页面返回的则不获取
  */
  console.log("pageType.value", pageType.value);
  if (pageType.value == 2 && props.editFrom) {
    getDetail(props.listId);
  }
});
watch(
  () => props.listId,
  (newValue, oldValue) => {
    // console.log("listId变了", newValue, oldValue);
    if (newValue) {
      // console.log("newValue存在");
      pageType.value = 2;
    } else {
      // console.log("newValue不存在");
      pageType.value = 1;
      refundGoods.value = [];
      buyGoods.value = [];
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
          <el-form-item label="采购单号">
            <order-select
              :order-num="formData.procure_no"
              @change="orderChange"
              :list="procureList"
              ref="orderSelecteRef"
              :is-disabled="pageType == 2"
            ></order-select>
          </el-form-item>
          <el-form-item label="换货日期" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="replacement_data"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>
        <div class="mb-[20px]">
          <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold mr-[10px]">
            换货商品
          </el-tag>
          <span class="text-gray-400">
            点击【复制到换回】按钮,可以将【勾选的换货商品】直接复制到下方换回商品列表,换回商品已存在的则不会复制
          </span>
          <el-divider />
          <div>
            <el-button type="primary" size="default" @click="handleSwap" class="mb-[10px]">
              复制到换回
            </el-button>
            <el-button type="danger" @click="handleRefundDelete" class="mb-[10px]">
              <template #icon>
                <i-ep-Delete></i-ep-Delete>
              </template>
              删除
            </el-button>
          </div>
          <el-table
            :data="refundGoods"
            border
            stripe
            @selection-change="selectRefund"
            class="min-h-[300px]"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="#" type="index" />
            <el-table-column label="条码" prop="barcode" width="160">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.barcode" disabled></el-input> -->
                  <span>{{ scope.row.barcode }}</span>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="名称" prop="title" class="table-item">
              <template #default="scope">
                <el-form-item>
                  <span>{{ scope.row.title }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" prop="spec">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.spec" disabled></el-input> -->
                  <span>{{ scope.row.spec || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="品牌" prop="brand" width="100">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.brand" disabled></el-input> -->
                  <span>{{ scope.row.brand || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="分类" prop="class_name" width="100">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.class_name" disabled></el-input> -->
                  <span>{{ scope.row.class_name || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="measure_name" width="100">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.measure_name" disabled></el-input> -->
                  <span>{{ scope.row.measure_name || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="退货数量" prop="ret_num" width="160">
              <template #header>
                <span class="text-red-500">*</span>
                <span>退货数量</span>
              </template>
              <template #default="scope">
                <div class="item">
                  <el-form-item
                    :prop="`refundGoods.${scope.$index}.return_num`"
                    :rules="[
                      {
                        required: true,
                        message: '请输入退货数量',
                        trigger: 'blur',
                      },
                      {
                        type: 'number',
                        min: 1,
                        max: scope.row.old_ret_num,
                        // message: `须>=1,<= ${scope.row.old_ret_num}`,
                        message: `应在1~${scope.row.old_ret_num}范围内`,
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      class="item__input"
                      v-model.number="scope.row.return_num"
                      placeholder="请输入数量"
                      v-inputnum.intp
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="供应商" prop="sup_name">
              <template #default="scope">
                <el-form-item :prop="`goods.${scope.$index}.sup_name`">
                  <span>{{ scope.row.sup_name }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="需求部门" prop="dept_name">
              <template #default="scope">
                <el-form-item :prop="`goods.${scope.$index}.dept_name`">
                  <span>{{ scope.row.dept_name || "-" }}</span>
                </el-form-item>
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
            <!-- <el-table-column label="操作" fixed="right">
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
            </el-table-column> -->
          </el-table>
          <div class="flex justify-center mt-[20px]">
            <!-- <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button> -->
            <el-button
              type="success"
              @click="handleRecover"
              class="w-[100px]"
              v-show="delIds.length > 0"
            >
              <template #icon>
                <i-ep-RefreshLeft></i-ep-RefreshLeft>
              </template>
              恢复删除
            </el-button>
          </div>
        </div>
        <div>
          <el-tag size="large" type="info" effect="plain" class="!text-[14px] font-bold">
            换回商品
          </el-tag>
          <el-divider />
          <el-button type="danger" @click="handleDelete" class="mb-[10px]">
            <template #icon>
              <i-ep-Delete></i-ep-Delete>
            </template>
            删除
          </el-button>
          <el-table
            :data="buyGoods"
            border
            stripe
            @selection-change="selectBuy"
            :row-class-name="tableRowClassName"
            class="min-h-[300px]"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="#" type="index" />
            <el-table-column label="条码" prop="barcode" width="160">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.barcode" disabled></el-input> -->
                  <span>{{ scope.row.barcode }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="title" class="table-item" width="160">
              <template #header>
                <span class="text-red-500">*</span>
                <span>名称</span>
              </template>
              <template #default="scope">
                <el-form-item :prop="`buyGoods.${scope.$index}.title`" :rules="buyRules.title">
                  <!-- <select-drop
                    :list="goodsList"
                    :title="scope.row.title"
                    @change="selectChange($event, scope.row)"
                  ></select-drop> -->

                  <drop-Load
                    :title="scope.row.title"
                    @change="selectChange($event, scope.row)"
                  ></drop-Load>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" prop="spec" min-width="100" show-overflow-tooltip>
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.spec" disabled></el-input> -->
                  <span>{{ scope.row.spec || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="品牌" prop="brand">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.brand" disabled></el-input> -->
                  <span>{{ scope.row.brand || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="分类" prop="class_name" width="100">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.class_name" disabled></el-input> -->
                  <span>{{ scope.row.class_name || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="measure_name">
              <template #default="scope">
                <el-form-item>
                  <!-- <el-input v-model="scope.row.measure_name" disabled></el-input> -->
                  <span>{{ scope.row.measure_name || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="采购数量" prop="num" width="120">
              <template #header>
                <span class="text-red-500">*</span>
                <span>采购数量</span>
              </template>
              <template #default="scope">
                <div class="item">
                  <el-form-item :prop="`buyGoods.${scope.$index}.num`" :rules="buyRules.num">
                    <el-input
                      class="item__input"
                      v-model="scope.row.num"
                      placeholder="请输入内容"
                      @blur="bindInputBlur($event, scope.row)"
                      v-inputnum.intp
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="采购单价(元)" prop="price" width="120">
              <template #header>
                <span class="text-red-500">*</span>
                <span>采购单价(元)</span>
              </template>
              <template #default="scope">
                <el-form-item :prop="`buyGoods.${scope.$index}.price`" :rules="buyRules.price">
                  <div class="item">
                    <el-input
                      class="item__input"
                      v-model="scope.row.price"
                      placeholder="请输入单价"
                      @blur="bindInputBlur($event, scope.row)"
                      v-inputnum.num_point
                    ></el-input>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="小计" prop="sub_total" width="100">
              <template #default="scope">
                <el-form-item>
                  <!-- <div class="item">
                    <el-input
                      class="item__input"
                      v-model="scope.row.sub_total"
                      placeholder=""
                      disabled
                    ></el-input>
                  </div> -->
                  <span>{{ scope.row.sub_total || "-" }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="供应商" prop="sup_name" min-width="160">
              <template #header>
                <span class="text-red-500">*</span>
                <span>供应商</span>
              </template>
              <template #default="scope">
                <el-form-item
                  :prop="`buyGoods.${scope.$index}.sup_name`"
                  :rules="buyRules.sup_name"
                >
                  <div class="item">
                    <el-select
                      v-model="scope.row.sup_name"
                      :placeholder="!scope.row.title ? '请先选择名称' : '请选择供应商'"
                      filterable
                      default-first-option
                      @visible-change="visibleChange($event, scope.row)"
                      @change="supChange($event, scope.row)"
                      :disabled="!scope.row.title"
                      :loading="selectLoading"
                      :validate-event="!!scope.row.sup_name"
                    >
                      <el-option
                        v-for="(item, index) in supList"
                        :key="item.id"
                        :label="item.name"
                        :value="index"
                        :disabled="item.disable"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="需求部门" prop="dept_id" min-width="100">
              <template #default="scope">
                <el-form-item>
                  <dept-select
                    :department-list="departmentList"
                    v-model="scope.row.dept_id"
                  ></dept-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="提交日期"
              prop="submit_time"
              width="160"
              :rules="buyRules.submit_time"
            >
              <template #header>
                <span class="text-red-500">*</span>
                <span>提交日期</span>
              </template>
              <template #default="scope">
                <el-form-item :prop="`buyGoods.${scope.$index}.submit_time`">
                  <div class="item">
                    <el-date-picker
                      style="width: 100%"
                      v-model="scope.row.submit_time"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      :clearable="false"
                      :editable="false"
                    />
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="交货期" prop="delivery_time" width="160">
              <template #default="scope">
                <el-form-item>
                  <div class="item">
                    <el-date-picker
                      style="width: 100%"
                      v-model="scope.row.delivery_time"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="合同编号" prop="contract_no" min-width="100">
              <template #default="scope">
                <el-form-item>
                  <div class="item">
                    <el-input
                      class="item__input"
                      v-model="scope.row.contract_no"
                      placeholder="请输入合同编号"
                      v-inputnum.num_alp
                    ></el-input>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note">
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
          </el-table>
        </div>
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

    <!-- <batch-select
      v-model="drawerShow"
      :drawerData="goodsList"
      @change="batchSelectchange"
    ></batch-select> -->
    <GoodsBatch v-model="drawerShow" @change="batchSelectchange"></GoodsBatch>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/index.scss";
</style>
