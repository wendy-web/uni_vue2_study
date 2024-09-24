<script setup lang="ts">
import { getStocksUniqueLabelApi } from "@/api/common/index";
import { getLabelInfoMroApi } from "@/api/device/common/index";
import type { EquipmentModule, ReBaseSelecModule } from "@/api/device/common/types";
import { getRepairAddEditApi, getRepairInfoApi } from "@/api/device/maintain/repair/index";
import type { DownListEditType, OrderUpListEditType } from "@/api/device/maintain/repair/types";
import UserSelect from "@/components/DeptSelect/UserSelect.vue";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import SelectDevice from "@/components/Device/SelectDevice/index.vue";
import SelectDown from "@/components/Device/SelectDown/index.vue";
import SelectOrder from "@/components/Device/SelectOrder/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import MultiUpload from "@/components/Upload/MultiUpload.vue";
import { useEditHooks } from "@/hooks/edit";
import { formartDate } from "@/utils/validate";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { type FormInstance } from "element-plus";
import type { FieldValues } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
import { useTagsViewStore } from "@/store/modules/tagsView";
import selectUniqueCodeVue from "@/views/device/components/selectUniqueCode/index.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "deviceMaintainRepairAdd",
});

enum ETitle {
  "新建设备维修单" = 1,
  "编辑设备维修单",
}
const { isReqDetail } = useEditHooks();
// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const { group, addRules, getReBase, orderColumns, downColumns, formData, userList } = useAdd();

const selectOrderRef = ref<InstanceType<typeof SelectOrder>>();
const selectDownRef = ref<InstanceType<typeof SelectDown>>();

const director_uid = computed(() => {
  let res = formData.value.repair_director ? [formData.value.repair_director] : [];
  console.log("🚀 ~ constdirector_uid=computed ~ res:", res);
  return formData.value.repair_director ? [formData.value.repair_director] : [];
});

const scrollContainer = ref();
const dataLoading = ref(false);
const listId = ref(0);
const pageType = ref(1);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});

/** 所选择的设备id */
const equipment_id = ref(0);

/** 选择设备弹窗开关 */
const deviceDrawer = ref(false);

/** 用来记录编辑时 返回的维修图片 用两个数组上传图片不闪烁? 奇怪的upload */
// ["/static/uploads/58/20240515/3892d319b141328a6366e6f9c08394ad.png","/apios/static/uploads/58/20240516/edc2e27e62746ec87a5dc017ee9397ac.png"]
const repairImgList = ref();
/** 用来记录编辑时 返回的故障图片 用两个数组上传图片不闪烁? 奇怪的upload */
const faultImgList = ref();

/** 选择领用单弹窗开关 */
const orderDrawer = ref(false);
/** 领用单数据-关联领用单换上备件数据 */
const orderList = ref<ReBaseSelecModule.OrderUpListAddType[]>([]);
/** 勾选的-领用单数据-关联领用单换上备件数据 */
const checkOrderList = ref<ReBaseSelecModule.OrderUpListAddType[]>([]);
/** 领用单数据的id数组 */
const orderIds = computed(() => {
  return orderList.value.map((item) => item.rec_detail_id);
});

/** 选择换下备件弹窗开关 */
const downDrawer = ref(false);
/** 换下备件列表数据 */
const downList = ref<DownListEditType[]>([]);
/** 勾选的-关联换下备件数据 */
const checkDownList = ref<DownListEditType[]>([]);
/** 换下备件数据的id数组 */
const downIds = computed(() => {
  return downList.value.map((item) => item.repair_id);
});

/** 更换备件表单 */
const replaceFormRef = ref<FormInstance>();
const replaceForm = ref({
  chage_date: dayjs().format("YYYY-MM-DD"), //换上日期
  down_date: dayjs().format("YYYY-MM-DD"), //down_date
});

const validateDownStatus = ref(false);

const validateDown = (rule: any, value: any, callback: any) => {
  if (!value && validateDownStatus.value) {
    callback(new Error("请选择换下日期"));
  } else {
    callback();
  }
};

const replaceRules = {
  // chage_date: [
  //   {
  //     required: true,
  //     message: "请选择换上日期",
  //   },
  // ],
  // down_date: [
  //   {
  //     validator: validateDown,
  //     message: "请选择换下日期",
  //   },
  // ],
};

/** 监听选择设备弹窗的-点击选择事件 */
function selectDevice(row: EquipmentModule.EquipmentItemType) {
  console.log("🚀 ~ selectDevice ~ row:", row);
  formData.value.bar_title = row.bar_title;
  formData.value.barcode = row.barcode;
  formData.value.spec = row.spec;
  formData.value.eq_type_text = row.eq_type_text;
  formData.value.save_addr_text = row.save_addr_text;
  formData.value.use_dept_text = row.use_dept_text;
  formData.value.use_duty_user_text = row.use_duty_user_text;
  equipment_id.value = row.id;
}

/** 监听故障图片的change事件 */
function faultImgChange(val: string[]) {
  formData.value.fault_picture = val;
}

/** 监听维修图片change事件 */
function repairImgChange(val: string[]) {
  console.log("🚀 ~ imgChange ~ val:", val);
  formData.value.repair_picture = val;
}

/** 监听表单的变化 */
const handleChange = (values: FieldValues) => {
  // 不用自动计算累计耗时了
  // let { repair_start_time, repair_end_time } = values;
  // if (repair_start_time && repair_end_time) {
  //   const start = dayjs(repair_start_time as string);
  //   const end = dayjs(repair_end_time as string);
  //   formData.value.stop_time = end.diff(start, "minute").toString();
  // } else {
  //   formData.value.stop_time = "";
  // }
};

/** 点击关联领用单 */
function handleShowOrderUp() {
  // replaceFormRef.value?.validateField("chage_date");
  // if (!replaceForm.value.chage_date) {
  //   ElMessage.warning("请您先选择换上日期");
  //   return;
  // }
  orderDrawer.value = true;
}

/** 监听选择领用单弹窗-点击确认选择事件 */
function orderSelectchange(selectData: ReBaseSelecModule.OrderUpListType[]) {
  let dataLength = selectData.length;
  let arr = changeOrderData(selectData);
  orderList.value = orderList.value.concat(arr);
  console.log("🚀 ~ orderSelectchange ~  orderList.value:", orderList.value);
  ElMessage.success(`已批量添加${dataLength}条数据`);
  selectOrderRef.value?.setStatus();
}

/** 领用单列表-勾选事件 */
function orderListCheck(selection: ReBaseSelecModule.OrderUpListAddType[]) {
  checkOrderList.value = selection;
}

/** 领用单列表-点击删除选中 */
function orderListDel() {
  let ids = checkOrderList.value.map((item) => item.rec_detail_id);
  orderList.value = orderList.value.filter((item) => !ids.includes(item.rec_detail_id));
}

/** 点击关联换下备件 */
function handleShowDown() {
  if (!equipment_id.value) {
    ElMessage.warning("请您先填写设备信息");
    formRef.value?.validateField("bar_title");
    return;
  }
  // if (!replaceForm.value.down_date) {
  //   validateDownStatus.value = true;
  //   replaceFormRef.value?.validateField("down_date");
  //   ElMessage.warning("请您先选择换下日期");
  //   return;
  // }
  downDrawer.value = true;
}

/** 监听选择换下备件弹窗-点击确认选择事件 */
function downSelectchange(selectData: ReBaseSelecModule.DownListType[]) {
  console.log("selectData", selectData);
  let dataLength = selectData.length;
  let arr = selectData.map((item) => {
    /** edit_id为0表示是,自己新增的数据,而不是编辑时,详情接口返回的数据 */
    return {
      ...item,
      parts_id: item.id,
      edit_id: 0,
      type_text: item.order_type_text,
      down_num: item.is_have_unique ? 0 : item.online_num,
      down_date: replaceForm.value.down_date,
      stock_id: item.stock_id,
    };
  });
  downList.value = downList.value.concat(arr);
  ElMessage.success(`已批量添加${dataLength}条数据`);
  selectDownRef.value?.setStatus();
}

/** 换下备件列表-勾选事件 */
function downListCheck(selection: DownListEditType[]) {
  checkDownList.value = selection;
}

/** 换下备件列表-点击删除选中 */
function downListDel() {
  let ids = checkDownList.value.map((item) => item.id);
  downList.value = downList.value.filter((item) => !ids.includes(item.id));
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/maintain/repair",
  });
}

async function handleConfirm(status: number) {
  // 保存传0, 提交验收传1
  // console.log("formData.value", formData.value);
  const vaildateRes = await formRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          formRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) {
    ElMessage.warning("有必填项未填写或者填写不正确,请检查填写内容");
    return;
  }
  if (formData.value.is_replace) {
    if (!replaceForm.value.chage_date) {
      replaceFormRef.value?.validateField("chage_date");
      ElMessage.warning("请您先选择换上日期");
      return;
    } else if (!orderList.value.length) {
      ElMessage.warning("请您先填写关联领用单换上备件数据");
      return;
    }
    let orderFindRes = orderList.value.find((item) => item.use_num === 0);
    let downFindRes = downList.value.find((item) => item.down_num === 0);
    if (orderFindRes) {
      ElMessage.warning("使用数量不可为0,请检查填写内容");
      return;
    } else if (downFindRes) {
      ElMessage.warning("换下数量不可为0,请检查填写内容");
      return;
    }
  }
  if (!formData.value.repair_end_time && status === 1) {
    ElMessage.warning("提交验收必须填写维修结束时间,请您先填写维修结束时间");
    formRef.value.scrollToField("repair_end_time");
    return;
  }

  let {
    bar_title,
    barcode,
    spec,
    eq_type_text,
    save_addr_text,
    use_dept_text,
    use_duty_user_text,
    other_repair_director,
    fault_reason,
    fault_type,
    ...rest
  } = formData.value;

  let rec_arr = formData.value.is_replace
    ? orderList.value.map((item) => {
        let { rem_num, ...rest } = item;
        return {
          ...rest,
        };
      })
    : undefined;

  let down_arr = formData.value.is_replace ? checkEdit() : undefined;

  let data = {
    id: listId.value ? listId.value : undefined,
    equipment_id: equipment_id.value,
    other_repair_director: other_repair_director.join(","),
    fault_reason: fault_reason.join(","),
    fault_type: fault_type.join(","),
    ...rest,
    status,
    rec_arr,
    down_arr,
  };
  console.log("data", data);
  const result = await getRepairAddEditApi(data);
  ElMessageBox.confirm(`${result.msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  })
    .then(() => {
      const currentTag = router.currentRoute.value;
      router.replace({
        path: "/device/maintain/repair",
      });
      tagsViewStore.delView(currentTag);
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 检测-关联换下备件中的内容是新添加的还是详情数据返回的-然后返回传给接口换下备件的数组 */
function checkEdit() {
  // 如果edit是0则标识是新增的 edit存在则标识是详情数据返回的
  let arr = downList.value.map((item) => {
    let { edit_id, id, down_num, down_date, parts_id, unique_label_detail, stock_id } = item;
    let obj = {
      parts_id,
      down_num,
      down_date,
      unique_label_detail,
      stock_id,
    };
    return edit_id ? { id, ...obj } : obj;
  });
  return arr;
}

/** 调整详情接口返回的 关联领用单换上备件 - 数据 */
function changeDetailOrder(data: OrderUpListEditType[]) {
  let arr = data.map((item) => {
    return {
      id: item.id,
      re_no: item.re_no,
      rec_detail_id: item.rec_detail_id,
      goods_id: item.goods_id,
      out_date: item.out_date,
      out_ware_id: item.out_ware_id,
      out_ware: item.out_ware,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      class_name: item.class_name,
      measure_name: item.measure_name,
      received_num: item.received_num,
      price: item.price,
      in_wh_date: item.in_wh_date ? formartDate(item.in_wh_date) : "",
      sup_name: item.sup_name,
      use_addr: Number(item.use_addr),
      rem_num: item.rem_num,
      use_num: item.use_num,
      eq_id: item.eq_id,
      chage_date: item.chage_date,
      stock_id: item.stock_id,
      unique_label_detail: item.unique_label_detail || [],
      is_have_unique: item.is_have_unique,
    };
  });
  return arr;
}

function changeOrderData(data: ReBaseSelecModule.OrderUpListType[]) {
  let arr = data.map((item) => {
    return {
      re_no: item.wh_rec_no,
      rec_detail_id: item.rec_detail_id,
      goods_id: item.goods_id,
      out_date: item.out_time ? formartDate(item.out_time) : "",
      out_ware_id: item.warehouse_id,
      out_ware: item.warehouse_name,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      class_name: item.class_name,
      measure_name: item.measure_name,
      received_num: item.received_num,
      price: item.price,
      in_wh_date: item.in_wh_date ? formartDate(item.in_wh_date) : "",
      sup_name: item.sup_name,
      use_addr: item.use_place_id,
      rem_num: item.rem_num,
      eq_id: equipment_id.value,
      chage_date: replaceForm.value.chage_date,
      stock_id: item.stock_id,
      use_num: item.is_have_unique ? 0 : item.rem_num,
      is_have_unique: item.is_have_unique,
    };
  });

  return arr;
}

async function getEditData() {
  dataLoading.value = true;
  const result = await getRepairInfoApi({ id: listId.value });
  let data = result.data;
  equipment_id.value = data.equipment_id;
  formData.value.class_type = data.class_type;
  formData.value.bar_title = data.bar_title;
  formData.value.barcode = data.barcode;
  formData.value.spec = data.spec;
  formData.value.eq_type_text = data.eq_type_text;
  formData.value.save_addr_text = data.save_addr_text;
  formData.value.use_dept_text = data.use_dept_text;
  formData.value.use_duty_user_text = data.use_duty_user_text;
  formData.value.occurrence_time = data.occurrence_time;
  formData.value.repair_user_id = data.repair_user_id;
  formData.value.fault_body = data.fault_body;
  formData.value.fault_note = data.fault_note;
  formData.value.product_line = data.product_line;
  formData.value.repair_type = data.repair_type;
  formData.value.fault_reason = data.fault_reason
    ? data.fault_reason.split(",").map((m) => Number(m))
    : [];
  formData.value.fault_type = data.fault_type
    ? data.fault_type.split(",").map((m) => Number(m))
    : [];
  formData.value.repair_director = data.repair_director;

  formData.value.other_repair_director = data.other_repair_director
    ? data.other_repair_director.split(",").map((m) => Number(m))
    : [];
  formData.value.repair_start_time = data.repair_start_time;
  formData.value.repair_end_time = data.repair_end_time;
  formData.value.is_stop = data.is_stop;
  formData.value.stop_time = data.stop_time;
  formData.value.outsourcing_id = data.outsourcing_id;
  formData.value.repair_price = data.repair_price;
  formData.value.repair_note = data.repair_note;
  formData.value.is_replace = data.is_replace;

  repairImgList.value = data.repair_picture;
  faultImgList.value = data.fault_picture;
  formData.value.repair_picture = data.repair_picture;
  formData.value.fault_picture = data.fault_picture;

  if (data.is_replace) {
    orderList.value = changeDetailOrder(data.repair_parts);

    replaceForm.value.chage_date = orderList.value[0]?.chage_date || dayjs().format("YYYY-MM-DD");
    replaceFormRef.value?.validateField("chage_date");

    /** edit_id相当于记录是编辑返回的数据,新建的时edit_id为0 */
    let down_arr = data.chage_parts.map((item) => ({ ...item, edit_id: item.id }));
    downList.value = down_arr;
    replaceForm.value.down_date = downList.value[0]?.down_date || dayjs().format("YYYY-MM-DD");
    replaceFormRef.value?.validateField("down_date");
  }
  dataLoading.value = false;
}

/** 如果use_num为null,则将其设置为1 */
const changeUseNum = (val: FocusEvent, row: ReBaseSelecModule.OrderUpListAddType) => {
  console.log("row", row);
  if (row.use_num === null) {
    row.use_num = 1;
  }
};

/** 如果down_num为null,则将其设置为1 */
const changeDownNum = (val: FocusEvent, row: ReBaseSelecModule.DownListType) => {
  console.log("row", row);
  if (row.down_num === null) {
    row.down_num = 1;
  }
};

function downDateBlur() {
  console.log("replaceFormRef.value?", replaceFormRef.value);
  validateDownStatus.value = false;
  replaceFormRef.value?.clearValidate("down_date");
}

/** 滚动到底部 */
function scrollBottom() {
  nextTick(() => {
    scrollContainer.value.scrollTo(0, scrollContainer.value.scrollHeight);
  });
}

const initTagsView = () => {
  // id存在表示是编辑
  pageType.value = listId.value ? 2 : 1;
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

function handleTooltip(data: any) {
  console.log("🚀 ~ handleTooltip ~ data:", data);
}

watch(
  () => formData.value.is_replace,
  (newVal) => {
    if (newVal) {
      scrollBottom();
    }
  },
);

onActivated(() => {
  getReBase();
  listId.value = Number(route.query.id) || 0;
  initTagsView();
  if (listId.value && isReqDetail.value) {
    getEditData();
  }
});

async function getBarcodeInfo() {
  console.log("处理扫码后的事件", input_barcode.value);

  let data = {
    content: input_barcode.value,
    document_type: 11,
    data_type: 1, //明细码和唯一码数据返回类型；0：按照库存所有数据返回：1：只返回一条库存数据；
    order_id: listId.value ? listId.value : undefined,
    eq_id: equipment_id.value,
  };
  const result = await getLabelInfoMroApi(data);
  // ElMessage.success("扫描成功");
  const findData = result.data.list;
  // code_type 条码类型；1：普通条码二维码；2：库存明细二维码；3：唯一标签二维码；
  // const codeType = result.data.code_type;
  // "数据类型；1：领用单换上备件；2：关联换下备件"
  const scanType = result.data.type;

  if (Object.keys(findData).length) {
    // let findBarcode = findData.barcode;
    if (scanType === 1) {
      // 如果是换上
      let orderFindRes = orderList.value.find((item) => {
        return findData.rec_detail_id == item.rec_detail_id;
      });
      if (!orderFindRes) {
        orderList.value.unshift({
          re_no: findData.wh_rec_no,
          rec_detail_id: findData.rec_detail_id,
          goods_id: findData.goods_id,
          out_date: findData.out_time ? formartDate(findData.out_time) : "",
          out_ware_id: findData.warehouse_id,
          out_ware: findData.warehouse_name,
          barcode: findData.barcode,
          title: findData.title,
          spec: findData.spec,
          brand: findData.brand,
          class_name: findData.class_name,
          measure_name: findData.measure_name,
          received_num: findData.received_num,
          price: findData.price,
          in_wh_date: findData.in_wh_date ? formartDate(findData.in_wh_date) : "",
          sup_name: findData.sup_name,
          use_addr: findData.use_place_id,
          rem_num: findData.rem_num,
          use_num: 1,
          eq_id: equipment_id.value,
          chage_date: replaceForm.value.chage_date,
          stock_id: findData.stock_id,
          is_have_unique: true,
          unique_label_detail: [
            {
              unique_code: findData.unique_code,
            },
          ],
        });
      } else {
        let unique_label_detail = orderFindRes.unique_label_detail || [];
        let unique_label_list = unique_label_detail.map((el) => el.unique_code);
        if (unique_label_list.includes(findData.unique_code)) {
          ElMessage.info("该唯一码已添加,请勿重复扫描");
          return;
        } else {
          orderFindRes.unique_label_detail?.push({
            unique_code: findData.unique_code,
          });
          orderFindRes.use_num = orderFindRes.unique_label_detail?.length || 1;
          console.log("good.value", orderList.value);
        }
      }
    } else {
      // 如果是换下
      let downFindRes = downList.value.find((item) => {
        return findData.repair_id == item.repair_id;
      });
      if (!downFindRes) {
        downList.value.unshift({
          ...findData,
          parts_id: findData.id,
          edit_id: 0,
          type_text: findData.order_type_text,
          down_num: 1,
          down_date: replaceForm.value.down_date,
          stock_id: findData.stock_id,
          is_have_unique: true,
          unique_label_detail: [
            {
              unique_code: findData.unique_code,
            },
          ],
        });
      } else {
        let unique_label_detail = downFindRes.unique_label_detail || [];
        let unique_label_list = unique_label_detail.map((el) => el.unique_code);
        if (unique_label_list.includes(findData.unique_code)) {
          ElMessage.info("该唯一码已添加,请勿重复扫描");
          return;
        } else {
          downFindRes.unique_label_detail?.push({
            unique_code: findData.unique_code,
          });
          downFindRes.down_num = downFindRes.unique_label_detail?.length || 1;
        }
      }
    }
  }
}
// 更改 - 关联换上时间
function selectChageDate(val: string) {
  orderList.value.forEach((item) => {
    item.chage_date = val ?? "";
  })
}
function selectDownDate(val: string) {
  downList.value.forEach((item) => {
    item.down_date = val ?? "";
  })
}
const selectUniqueCodeRef = ref();
async function selectGoodsDetais(row: any, event: any, type = 1) {
  // type为1 是换上,2是换下
  console.log("🚀 ~ selectGoodsDetais ~ row:", row);
  if (event.key === "Enter") {
    event.preventDefault();
    return;
  }
  let { stock_id } = row;
  let apiData = {
    stock_id,
    type: listId.value ? 2 : 1,
    order_id: listId.value ? listId.value : undefined,
    order_type: 11,
    operate_type: type,
    repair_id: type === 2 ? row.repair_id : undefined,
    rec_detail_id: type === 1 ? row.rec_detail_id : undefined,
  };
  const result = await getStocksUniqueLabelApi(apiData);
  let list = result.data.labels;
  let rowCodeList = row.unique_label_detail
    ? row.unique_label_detail.map((item: any) => item.unique_code)
    : [];

  list.forEach((element: any) => {
    if (rowCodeList.includes(element.code)) {
      element.select_status = true;
    }
  });

  // selectUniqueVue
  addDialog({
    width: "60%",
    draggable: true,
    closeOnClickModal: false,
    btnClass: "w-[80px]",
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "选择标签明细",
    contentRenderer: () =>
      h(selectUniqueCodeVue, {
        ref: selectUniqueCodeRef,
        data: list,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const uniqueCodeList = selectUniqueCodeRef.value?.uniqueCodeList || [];
      console.log("🚀 ~ beforeSure: ~ uniqueCodeList:", uniqueCodeList);
      row.unique_label_detail = uniqueCodeList;
      if (type === 1) {
        row.use_num = uniqueCodeList.length;
      } else if (type === 2) {
        row.down_num = uniqueCodeList.length;
      }

      updateDialog(false, "btnLoading");
      done();
    },
  });
}
</script>
<template>
  <div class="app-container">
    <div class="app-card" ref="scrollContainer">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
      </div>
      <PlusForm
        ref="PlusformRef"
        v-model="formData"
        :group="group"
        :colProps="{ span: 8 }"
        :rowProps="{ gutter: 20 }"
        labelWidth="110"
        :hasFooter="false"
        :rules="addRules"
        @change="handleChange"
        v-loading="dataLoading"
      >
        <!-- 选择资产名称 -->
        <template #plus-field-bar_title>
          <el-input v-model="formData.bar_title" placeholder="请点击搜索" readonly>
            <template #append>
              <el-button :icon="Search" @click="deviceDrawer = true">搜索</el-button>
            </template>
          </el-input>
        </template>

        <!-- 选择维修图片 -->
        <template #plus-field-repair_picture>
          <MultiUpload :list="repairImgList" @change="repairImgChange"></MultiUpload>
        </template>
        <!-- 选择故障图片 -->
        <template #plus-field-fault_picture>
          <MultiUpload :list="faultImgList" @change="faultImgChange"></MultiUpload>
        </template>
        <!-- 选择维修人员 -->
        <template #plus-field-repair_director>
          <UserSelect
            :list="userList"
            v-model="formData.repair_director"
            :ids="formData.other_repair_director"
            :valueKey="false"
          ></UserSelect>
        </template>
        <!-- 选择其他维修人员 -->
        <template #plus-field-other_repair_director>
          <UserSelect
            :list="userList"
            v-model="formData.other_repair_director"
            multiple
            :valueKey="false"
            :ids="director_uid"
          ></UserSelect>
        </template>
      </PlusForm>
      <template v-if="formData.is_replace">
        <el-form :model="replaceForm" ref="replaceFormRef" :rules="replaceRules">
          <el-card shadow="never" class="mb-6">
            <template #header>关联领用单换上备件</template>
            <div class="mb-4 flex">
              <el-button type="primary" @click="handleShowOrderUp">关联领用单</el-button>
              <el-button type="primary" @click="orderListDel">删除选中</el-button>
              <div class="ml-4">
                <el-form-item label="换上时间" prop="chage_date">
                  <!-- :disabled="Boolean(orderList.length)"   disabled-->
                  <el-date-picker
                    v-model="replaceForm.chage_date"
                    type="date"
                    placeholder="请选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="ml-4"
                    @change="selectChageDate"
                  />
                </el-form-item>
              </div>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              @selection-change="orderListCheck"
              row-key="rec_detail_id"
              :data="orderList"
              :columns="orderColumns"
            >
              <template #use_num="scope">
                <el-input-number
                  v-model="scope.row.use_num"
                  :min="scope.row.is_have_unique ? 0 : 1"
                  @blur="changeUseNum($event, scope.row)"
                  style="width: 100%"
                  :disabled="scope.row.is_have_unique"
                ></el-input-number>
                <el-button
                  v-if="scope.row.is_have_unique"
                  link
                  class="!text-[12px] !text-sky-500"
                  @click="selectGoodsDetais(scope.row, $event, 1)"
                  @keydown="
                    (event: KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                      }
                    }
                  "
                >
                  选择编码
                </el-button>
              </template>
            </pure-table>
          </el-card>
          <el-card shadow="never">
            <template #header>关联换下备件</template>
            <div class="mb-4 flex">
              <el-button type="primary" @click="handleShowDown">关联换下备件</el-button>
              <el-button type="primary" @click="downListDel">删除选中</el-button>
              <div class="ml-4">
                <el-form-item label="换下时间" prop="down_date">
                  <!--  :disabled="Boolean(downList.length)"  disabled -->
                  <el-date-picker
                    v-model="replaceForm.down_date"
                    type="date"
                    placeholder="请选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="ml-4"
                    @blur="downDateBlur"
                    @change="selectDownDate"
                  />
                </el-form-item>
              </div>
            </div>
            <pure-table
              header-cell-class-name="table-gray-header"
              @selection-change="downListCheck"
              row-key="id"
              :data="downList"
              :columns="downColumns"
            >
              <template #down_num="scope">
                <!-- :max="scope.row.online_num" -->
                <el-input-number
                  v-model="scope.row.down_num"
                  :min="scope.row.is_have_unique ? 0 : 1"
                  @blur="changeDownNum($event, scope.row)"
                  style="width: 100%"
                  :disabled="scope.row.is_have_unique"
                ></el-input-number>
                <el-button
                  v-if="scope.row.is_have_unique"
                  link
                  class="!text-[12px] !text-sky-500"
                  @click="selectGoodsDetais(scope.row, $event, 2)"
                  @keydown="
                    (event: KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                      }
                    }
                  "
                >
                  选择编码
                </el-button>
              </template>
            </pure-table>
          </el-card>
        </el-form>
      </template>
      <DeviceApproveFlow :id="listId" :order-type="1" class="mt-6"></DeviceApproveFlow>
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm(0)" class="w-[100px]" size="large">
        确定
      </el-button>
      <el-button type="primary" @click="handleConfirm(1)" class="w-[100px]" size="large">
        提交验收
      </el-button>
    </div>
    <SelectDevice
      v-model="deviceDrawer"
      :ids="[]"
      :multiple="false"
      @select="selectDevice"
    ></SelectDevice>
    <SelectOrder
      ref="selectOrderRef"
      v-model="orderDrawer"
      @change="orderSelectchange"
      :ids="orderIds"
    ></SelectOrder>
    <SelectDown
      ref="selectDownRef"
      v-model="downDrawer"
      @change="downSelectchange"
      :ids="downIds"
      :eqId="equipment_id"
    ></SelectDown>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

:deep(.el-upload-list__item.is-ready) {
  // 因为此饿了么组件图片上传的时候会产生一个类,将其隐藏就可以解决上传图片完成后闪动的问题
  display: none;
}

:deep(.plus-form .el-card) {
  box-shadow: none;
}
.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 1;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>
