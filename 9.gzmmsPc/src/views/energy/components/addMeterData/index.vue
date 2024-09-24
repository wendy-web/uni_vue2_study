<script setup lang="tsx">
import { ElInput, ElSelect, type FormInstance } from "element-plus";
import dayjs from "dayjs";
import {
  getEqipmentByRelApi,
  getLastMeterRecordApi,
  getMeterNowRecordApi,
} from "@/api/energy/common/index";
import { onlyNumPoint } from "@/utils/index";
import { useUserStoreHook } from "@/store/modules/user";
import { useSelectData } from "@/views/energy/hooks/index";

interface Props {
  orderType?: number;
  relId?: number;
}

type RelValueType = { is_bind: boolean; id: number; name: string };

const props = withDefaults(defineProps<Props>(), {
  orderType: 1,
  relId: 0,
});

const useUser = useUserStoreHook();
const {
  getUserList,
  userList,
  purposeOptions,
  classNoOptions,
  getRelData,
  relList,
  getClassTypeMap,
  classTypeList,
} = useSelectData();

/** 记录获取的设备信息 */
const eqipmentInfo = ref({
  asset_no: "", //绑定设备编码
  bar_title: "", //资产名称
  use_addr: "", //使用位置id
  use_addr_text: "", //使用位置
  equipment_type_name: "", //资产类型名称
  equipment_type_id: 0, //资产类型id
  eq_id: 0, //设备id
});

const nowBtnLoading = ref(false);
/** 记录一下点击编辑时传过来的采集表名id,如果该值存在表示是编辑 */
const rel_id = ref(0);

/** 表单信息字段 */
const addFormData = ref({
  relValue: {} as RelValueType,
  rel_name: "",
  rel_id: undefined as FormNumType, //采集表名id
  is_produce: 1, //是否生产；0：否；1：是
  class_no: undefined as FormNumType, //班次 1早 2中 3晚
  class_type: undefined as FormNumType, //班别(1A、2B、3C)
  meter_readings_id: useUser.uid, //抄表人
  dosage_num: "0.00", //用量
  last_meter_time: "", //上次抄表时间
  this_meter_time: dayjs().format("YYYY-MM-DD HH:mm:ss"), //本次抄表时间
  start_num: "", //起码读数/上次抄表读数
  end_num: "0.00", //止码读数/本次抄表数
  purpose: 0, //用途
  note: "", //备注
  isHaveEq: false, //是否有设备信息
});

const PlusFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 选择的采集表名是否已绑定 */
const isHaveEqShow = computed(() => {
  // return !addFormData.value.relValue.is_bind;
  return !addFormData.value.isHaveEq;
});

/** 当前是否编辑 */
const isEdit = computed(() => {
  return rel_id.value ? true : false;
});

async function getNowRecord() {
  let data = {
    type: props.orderType,
    rel_id: addFormData.value.rel_id,
  };
  nowBtnLoading.value = true;
  try {
    const result = await getMeterNowRecordApi(data);
    addFormData.value.this_meter_time = result.data.this_meter_time;
    addFormData.value.end_num = result.data.end_num;
    ElMessage.success(result.msg);
  } finally {
    nowBtnLoading.value = false;
  }
}

/** 获取绑定设备信息 */
async function getEqipmentInfo() {
  let data = {
    type: props.orderType,
    rel_id: addFormData.value.rel_id,
  };
  const result = await getEqipmentByRelApi(data);
  if (result.data) {
    addFormData.value.isHaveEq = true;
    eqipmentInfo.value = result.data;
    getLastRecord();
  } else {
    addFormData.value.isHaveEq = false;
    eqipmentInfo.value = {
      asset_no: "", //绑定设备编码
      bar_title: "", //资产名称
      use_addr: "", //使用位置id
      use_addr_text: "", //使用位置
      equipment_type_name: "", //资产类型名称
      equipment_type_id: 0, //资产类型id
      eq_id: 0, //设备id
    };
  }
  addFormRef.value.validateField("relValue");
}

/** 获取上次抄表数据 */
async function getLastRecord() {
  let data = {
    type: props.orderType,
    rel_id: addFormData.value.rel_id,
  };
  const result = await getLastMeterRecordApi(data);
  let info = result.data[0];

  addFormData.value.last_meter_time = info.meter_time;
  addFormData.value.start_num = info.meter_num;
}

const validatorForm = async () => {
  // if (!addFormData.value.relValue.id) {
  //   ElMessage.warning("请选择采集表名");
  //   return false;
  // } else {
  //   if (!addFormData.value.relValue.is_bind) {
  //     ElMessage.warning("当前远程仪表未绑仪表,请换一个远程仪表,或者请先去绑定");
  //     return false;
  //   }
  // }

  const vaildateRes = await addFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          addFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });

  if (vaildateRes) {
    let endNum = Number(addFormData.value.end_num);
    let startNum = Number(addFormData.value.start_num);
    if (endNum < startNum) {
      const confirmRes = await ElMessageBox.confirm(
        `注意本次抄表数异常提示，本次抄表数小于上次抄表数，请确认是否正确`,
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      );
      if (confirmRes === "confirm") {
        return true;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }

  // return vaildateRes;
};

function setFormData(eqipmentData: typeof eqipmentInfo.value, data: typeof addFormData.value) {
  eqipmentInfo.value = eqipmentData;
  addFormData.value = { ...data, isHaveEq: true };
}

onMounted(() => {
  getUserList();
  getClassTypeMap();
  getRelData(props.orderType);
  rel_id.value = props.relId;
});

defineExpose({
  validatorForm,
  addFormData,
  setFormData,
  eqipmentInfo,
});

const addColumns: PlusColumnList = [
  {
    label: "采集表名",
    prop: "relValue",
    valueType: "select",
    colProps: {
      span: 24,
    },
    fieldProps: computed(() => {
      return {
        disabled: isEdit.value,
        filterable: true,
        valueKey: "id",
        onChange: (value: RelValueType) => {
          console.log("🚀 ~ value:", value);
          addFormData.value.rel_id = value.id;
          addFormData.value.rel_name = value.name;
          getEqipmentInfo();
        },
      };
    }),
    options: computed(() => {
      return relList.value.map((item) => {
        return {
          label: item.name,
          value: {
            id: item.id,
            is_bind: item.is_bind,
            name: item.name,
          },
        };
      });
    }),
    renderExtra: () => (
      <>
        {addFormData.value.relValue.id && isHaveEqShow.value ? (
          <span>当前远程仪表未绑仪表</span>
        ) : null}
        {!isHaveEqShow.value ? (
          <ul class="flex">
            <li class="mr-4">
              <span>绑定设备编码：</span>
              <span class="text-black">{eqipmentInfo.value.asset_no}</span>
            </li>
            <li class="mr-2">
              <span>资产名称：</span>
              <span class="text-black">{eqipmentInfo.value.bar_title}</span>
            </li>
            <li class="mr-2">
              <span>使用位置：</span>
              <span class="text-black">{eqipmentInfo.value.use_addr_text || "--"}</span>
            </li>
            <li class="mr-2">
              <span>资产类型：</span>
              <span class="text-black">{eqipmentInfo.value.equipment_type_name}</span>
            </li>
          </ul>
        ) : null}
      </>
    ),
  },
  {
    label: "上次抄表时间",
    prop: "last_meter_time",
    fieldProps: {
      disabled: true,
      placeholder: "请选择采集表名",
    },
    hideInForm: isHaveEqShow,
  },
  {
    label: "上次抄表读数",
    prop: "start_num",
    fieldProps: {
      disabled: true,
      placeholder: "请选择采集表名",
    },
    hideInForm: isHaveEqShow,
  },
  {
    label: "本次抄表时间",
    prop: "this_meter_time",
    valueType: "date-picker",
    fieldProps: {
      type: "datetime",
      placeholder: "请选择",
      format: "YYYY-MM-DD HH:mm:ss",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      clearable: false,
    },
    hideInForm: isHaveEqShow,
  },
  {
    label: "本次抄表数",
    prop: "end_num",
    hideInForm: isHaveEqShow,
  },
  {
    label: "抄表人",
    prop: "meter_readings_id",
    valueType: "select",
    fieldProps: {
      filterable: true,
    },
    options: computed(() => {
      return userList.value;
    }),
    hideInForm: isHaveEqShow,
  },
  {
    label: "用量",
    prop: "dosage_num",
    renderField: (value, onChange) => {
      let val = onlyNumPoint(value);
      return h(ElInput, {
        modelValue: val,
        onChange,
      });
    },
    hideInForm: isHaveEqShow,
  },
  {
    label: "班别",
    prop: "class_no",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择",
    },
    options: classNoOptions,
    hideInForm: isHaveEqShow,
  },
  {
    label: "班次",
    prop: "class_type",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择",
    },
    options: computed(() => {
      return classTypeList.value.map((item) => {
        return {
          label: item.name,
          value: item.id,
          ...item,
        };
      });
    }),
    hideInForm: isHaveEqShow,
  },
  {
    label: "是否生产",
    prop: "is_produce",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择",
      onChange: (value: number) => {
        if (value === 1) {
          addFormData.value.purpose = 0;
        }
      },
    },
    options: [
      {
        label: "是",
        value: 1,
      },
      {
        label: "否",
        value: 0,
      },
    ],
    hideInForm: isHaveEqShow,
  },
  {
    label: "用途",
    prop: "purpose",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择",
    },
    options: purposeOptions,
    hideInForm: isHaveEqShow,
  },
  {
    label: "备注",
    prop: "note",
    fieldProps: {
      placeholder: "请输入",
    },
    colProps: {
      span: 24,
    },
    hideInForm: isHaveEqShow,
  },
];

const addRules = {
  relValue: [
    {
      required: true,
      validator: (rule: any, value: RelValueType, callback: any) => {
        if (value.id) {
          if (addFormData.value.isHaveEq) {
            callback();
          } else {
            callback(new Error("当前远程仪表未绑仪表，请换一个远程仪表，或者请先去绑定"));
          }
        } else {
          callback(new Error("请选择采集表名"));
        }
      },
    },
  ],
  this_meter_time: [
    {
      required: true,
      message: "请选择本次抄表时间",
    },
  ],
  end_num: [
    {
      required: true,
      message: "请输入本次抄表数",
    },
  ],
  meter_readings_id: [
    {
      required: true,
      message: "请选择抄表人",
    },
  ],
};
</script>
<template>
  <div class="merter-wrapper">
    <PlusForm
      ref="PlusFormRef"
      :rules="addRules"
      v-model="addFormData"
      labelWidth="110"
      label-position="top"
      :columns="addColumns"
      :row-props="{ gutter: 20 }"
      :col-props="{ span: 12 }"
      :hasFooter="false"
    >
      <template #plus-field-end_num>
        <el-input v-model="addFormData.end_num" v-inputnum.num_point>
          <template #append>
            <el-button type="primary" @click="getNowRecord" :loading="nowBtnLoading">
              获取实时
            </el-button>
          </template>
        </el-input>
      </template>
    </PlusForm>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
}
</style>
