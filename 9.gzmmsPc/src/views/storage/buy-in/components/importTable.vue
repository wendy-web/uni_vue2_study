<script setup lang="ts">
import { Delete, Plus, RefreshLeft } from "@element-plus/icons-vue";
import type { Action, FormInstance, FormRules, MessageBoxState, TableInstance } from "element-plus";
import { dayjs } from "element-plus";
// 引入深克隆
import { cloneDeep } from "@pureadmin/utils";
import { getLabelGoodsApi } from "@/api/common/index";
// 引入类型
import { ICateItem, IProcureItem } from "@/api/common/types";
// 引入获取采购单详情api
import { detailBuyInApi, importBuyInApi } from "@/api/storage/buy-in";
// 引入类型
import { IBuyInAddGoods, IBuyInImportItem } from "@/api/storage/buy-in/types";
import { formartDate } from "@/utils/validate";
// 引入自定义组件
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import selectGoods from "./selectGoods/index.vue";

export interface API {
  validateForm: () => Boolean;
  getDetail: (id: number) => void;
  getCodeInfo: () => void;
}

defineOptions({
  name: "importTable",
});

interface Props {
  storageList: ICateItem[]; //仓库列表数据
  procureList: IProcureItem[]; //采购单列表数据
  pageType: number;
  inputBarcode: string;
}

const props = withDefaults(defineProps<Props>(), {
  storageList: () => [] as ICateItem[],
  procureList: () => [] as IProcureItem[],
  pageType: 1, //1是新建 2是编辑
  inputBarcode: "",
});

const state = reactive({
  form: {
    goods: [] as IBuyInAddGoods[],
    procure_no: "",
    in_time: dayjs().format("YYYY-MM-DD"), //入库日期
    in_wh_name: "", //仓库名称
    in_wh_id: 0, //仓库id
    operate_id: 1, // 作业方式, 1为扫码入库, 2为手动入库
  },
  backupsData: [] as IBuyInAddGoods[], //深克隆的所有可选列表,新建时可直接为导入的数据,编辑时为 goods数据和可选数据总和
  delIds: [] as number[], //被删除的id数组
  isImport: false, //是否已经导入过了
  operateList: [
    {
      id: 1,
      name: "扫码入库",
    },
    {
      id: 2,
      name: "手动入库",
    },
  ],
  dialogVisible: false,
  multiOrderList: [] as IProcureItem[],
  checkSelectList: [] as number[],
});

const {
  // selectData,
  backupsData,
  form,
  delIds,
  isImport,
  operateList,
  dialogVisible,
  multiOrderList,
  checkSelectList,
} = toRefs(state);
const { procure_no, goods, operate_id } = toRefs(state.form);

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入入库单价",
      trigger: "blur",
    },
  ],
  in_wh_name: {
    required: true,
    message: "请选择入库仓库",
    trigger: "change",
  },
});

const selectGoodsRef = ref<InstanceType<typeof selectGoods>>();
const drawerShow = ref(false);

const formRef = ref<FormInstance>();
const tabelRef = ref<TableInstance>();
const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();
const operateRef = ref();
const selectWarehouseRef = ref();

const idsList = computed(() => {
  return goods.value.map((item) => item.procure_goods_id);
});

const emit = defineEmits<{
  (e: "sendData", data: {}): void;
  (e: "sendInfo", data: {}): void;
  (e: "sendLoad"): void;
  (e: "clearCode"): void;
  (e: "changeWh", data: { in_wh_id: number }): void;
}>();

const regexp = /^CGD\d*$/; //正则
const pattern = /https:\/\/gzmms.y1b\.cn\/scan\?c=/;
let confirmFalg = 0; // 确定是否重新导入弹窗的标记

// 选择入库日期时触发
const selectDateChange = (val: string) => {
  setTimeout(() => {
    let inputEl = document.querySelector(
      ".dateBox  .el-input__wrapper .el-input__inner",
    ) as HTMLInputElement;
    // console.log("inputEl", inputEl);
    inputEl.blur();
  }, 50);
  console.log("val", val);
  let dateString = transformDate(val);
  goods.value.map((item) => (item.ph_no = dateString));
};

/** 去除日期格式的横线 */
function transformDate(dateString: string) {
  return dateString.replace(/-/g, "");
}

// 选择采购单号触发
const orderChange = async (index: number) => {
  console.log(index);
  let item = props.procureList[index];
  form.value.procure_no = item.procure_no;
  const result = await selectGoodsRef.value?.getData(form.value.procure_no);
  console.log("🚀 ~ orderChange ~ result:", result);
  if (result) {
    ElMessage.success("导入成功,请点击选择商品添加货品");
  }
  // handleImport();
};

// 切换选择作业方式
const selectOperateType = (val: number) => {
  console.log("val", val);
  // console.log("operateRef.value",)
  goods.value = [];
  procure_no.value = "";
  form.value.in_wh_id = 0;
  form.value.in_wh_name = "";
  isImport.value = false;
  emit("clearCode");
  emit("changeWh", { in_wh_id: form.value.in_wh_id });
  setTimeout(() => {
    operateRef.value?.blur();
  }, 50);
};

function rowChangeClass({ row, rowIndex }: { row: any; rowIndex: number }) {
  if (operate_id.value === 1) {
    if (rowIndex === 0 && row.in_num) {
      return "!bg-blue-400 active-row";
    }
    if (!row.in_num) {
      return "!bg-gray-200";
    } else {
      return "!bg-blue-100";
    }
  } else {
    return "";
  }
}

// 点击导入货品
const handleImport = async () => {
  console.log("点击导入,采购单号", procure_no.value);
  if (!form.value.procure_no) {
    return;
  }
  console.log("isImport.value", isImport.value);

  if (isImport.value && confirmFalg === 0) {
    setTimeout(() => {
      confirmFalg += 1;
      ElMessageBox.confirm(`您已导入过商品,确定要再次导入吗?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action: Action, instance: MessageBoxState, done: () => void) => {
          if (action === "confirm") {
            // @ts-expect-error
            instance.onclick = (function () {
              let type = window.event?.type;

              if (type !== "keydown") {
                done();
              }
            })();
          } else {
            done();
          }
        },
      })
        .then(() => {
          confirmFalg = 0;
          orderSelecteRef.value?.selectBlur();
          sendImport();
        })
        .catch((error) => {
          confirmFalg = 0;
          console.log(error);
        });
    }, 500);

    return;
  } else if (isImport.value && confirmFalg === 1) {
    return;
  }
  sendImport();
};

const sendImport = async () => {
  try {
    const result = await importBuyInApi({ procure_no: procure_no.value });
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }
    ElMessage.success("导入成功");
    let list = result.data.list;
    /*
      将导入的数据 转换一下字段,赋值给goods
      procure_goods_id:商品id; in_num: 入库数量,可修改的;
      note: 备注,默认为空; old_in_num: 最大可退货数量,in_num的原始值
    */
    let newList = list.map((item) => {
      let { id, goods_id, rem_num, dept,exp_day, ...rest } = item;
      return {
        ...rest,
        dept_name: dept?.name,
        goods_id,
        procure_goods_id: id,
        in_num: operate_id.value == 1 ? undefined : rem_num,
        note: "",
        old_in_num: rem_num,
        pro_time: "",
        exp_day,
        exp_time: "",
        ws_code: "",
        ph_no: transformDate(form.value.in_time),
        isSelect: false,
      };
    });
    // console.log("🚀 ~ newList ~ newList:", newList)

    let barcode_arr = newList.map((item) => {
      return item.barcode;
    });
    console.log("barcode_arr", barcode_arr);
    let new_barcode = barcode_arr.filter(function (item) {
      return barcode_arr.lastIndexOf(item) == barcode_arr.indexOf(item);
    });
    // console.log("🚀 ~ new_barcode:", new_barcode)
    newList.forEach((item) => {
      if (!new_barcode.includes(item.barcode)) {
        item.isSelect = true;
      }
    });
    goods.value = newList;
    // setGoodsWarehouse();
    // 导入重置
    // selectData.value = [];
    backupsData.value = cloneDeep(newList);
    // 记录已经导入了
    isImport.value = true;
    delIds.value = [];
  } catch (error) {}
};

// 选择入库仓库触发
const selectWarehouse = (val: string) => {
  // console.log("🚀 ~ selectWarehouse ~ val:", val)
  let val_arr = val.split(",");
  let warehouse_name = val_arr[0];
  let warehouse_id = val_arr[1];
  form.value.in_wh_name = warehouse_name;
  form.value.in_wh_id = Number(warehouse_id);
  emit("changeWh", { in_wh_id: form.value.in_wh_id });
  setTimeout(() => {
    selectWarehouseRef.value?.blur();
  }, 50);
};

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  // 点击删除时,goods数组-1;并返回删除的数组
  let valueItem = goods.value.splice(index, 1);
  delIds.value.push(row.procure_goods_id);
  console.log("🚀 ~ handleDelete ~ delIds.value:", delIds.value);
};

// 点击选择商品按钮
const handleSelect = () => {
  drawerShow.value = true;
};

// 监听子组件选择商品的事件
const batchSelectchange = (selectList: IBuyInImportItem[]) => {
  let datalength = selectList.length;
  selectList.forEach((item) => {
    let { id, goods_id, rem_num, dept, exp_day, ...rest } = item;
    goods.value.push({
      ...rest,
      dept_name: dept?.name,
      goods_id,
      procure_goods_id: id,
      in_num: operate_id.value == 1 ? undefined : rem_num,
      note: "",
      old_in_num: rem_num,
      pro_time: "",
      exp_day,
      exp_time: "",
      ws_code: "",
      ph_no: transformDate(form.value.in_time),
      isSelect: false,
    });
  });
  selectGoodsRef.value?.setStatus();
  ElMessage.success(`已批量添加${datalength}条商品`);
};

// 点击恢复删除按钮
const handleAdd = () => {
  let list = toRaw(backupsData.value);
  let arr: IBuyInAddGoods[] = [];
  list.forEach((item) => {
    if (delIds.value.includes(item.procure_goods_id)) {
      arr.push({ ...item });
    }
  });

  goods.value.push(...arr);
  delIds.value = [];
};

const getDetail = async (id: number) => {
  try {
    const result = await detailBuyInApi({ id });
    let note = result.data.note;
    let file_info = result.data.file_info;
    form.value.in_time = formartDate(result.data.in_time);
    form.value.in_wh_id = result.data.in_wh_id;
    form.value.in_wh_name = result.data.in_wh_name;
    emit("changeWh", { in_wh_id: form.value.in_wh_id });
    emit("sendInfo", { file_info, note });
    procure_no.value = result.data.procure_no;
    let old_goods = result.data.goods;
    let new_goods = old_goods.map((item) => {
      let {
        dept,
        dept_id,
        goods_id,
        id,
        procure_goods_id,
        procure_id,
        barcode,
        title,
        spec,
        measure_name,
        price,
        in_num,
        sup_name,
        delivery_time,
        contract_no,
        note,
        brand,
        class_name,
        ph_no,
        pro_time,
        exp_day,
        exp_time,
        ws_code,
      } = item;
      let old_in_num = item.in_num;
      return {
        dept_name: dept?.name ?? "",
        dept_id,
        goods_id,
        id,
        procure_goods_id,
        procure_id,
        title,
        barcode,
        spec,
        brand,
        measure_name,
        class_name,
        price,
        in_num,
        sup_name,
        delivery_time,
        contract_no,
        note,
        ph_no: ph_no ?? "",
        old_in_num,
        pro_time,
        exp_day,
        exp_time,
        ws_code,
        isSelect: true,
      };
    });
    // 拿到通过 采购编号导入的数据
    const resultImport = await importBuyInApi({
      procure_no: result.data.procure_no,
    });
    if (resultImport.code === "0") {
      goods.value = new_goods;
      console.log("goods.value", goods.value);
      backupsData.value = cloneDeep(new_goods);
      return;
    }
    let importList = resultImport.data.list;
    // 判断 如果导入数据中的id == 详情数据中的 procure_goods_id,则最大的退货数量 = 详情数据中的 old_in_num + 导入数据中的rem_num;
    // 情况1:此种情况出现, 是新建的时候,某个商品填写的退货数量未达到最大值,编辑时,该商品还有可剩余的退货数量,故而最大数量需要相加
    new_goods.forEach((element) => {
      importList.forEach((item) => {
        if (item.id == element.procure_goods_id) {
          element.old_in_num = element.old_in_num + item.rem_num;
        }
      });
    });
    goods.value = new_goods;
    backupsData.value = cloneDeep(new_goods);

    // 拿到 详情数据中所有的商品id
    let idList = new_goods.map((item: any) => {
      return item.procure_goods_id;
    });
    // 判断 如果导入数据中 不包含该商品id,则返回
    // 此做法是因为: 返回的数组,即为添加后 可选择的数据;
    // 情况2: 新建时导入数据有5条,删除了3条,只保存了2条,那么在编辑时,那3条是可选的,为了避免和情况1冲突,选择通过id过滤
    let arr = importList.filter((element) => {
      return !idList.includes(element.id);
    });
    // 转换一下数据格式
    let newArr = arr.map((item) => {
      let { id, rem_num, dept, exp_day, ...rest } = item;
      // let { id, rem_num, ...rest } = item;
      return {
        ...rest,
        dept_name: dept?.name,
        procure_goods_id: id,
        in_num: operate_id.value === 1 ? undefined : rem_num,
        note: "",
        old_in_num: rem_num,
        pro_time: "",
        exp_day,
        exp_time: "",
        ph_no: "",
        ws_code: "",
      };
    });
    // selectData.value = newArr;
    goods.value = goods.value.concat(newArr);

    backupsData.value = backupsData.value.concat(cloneDeep(newArr));
  } finally {
    emit("sendLoad");
  }
};

// 验证是否满足规则
const validateForm = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return false;
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      if (operate_id.value === 1) {
        let list = goods.value.filter((item) => {
          return !!item.in_num;
        });
        // 如果都没有 数量直接 return
        // if (list.length === 0) return false;
        if (list.length === 0) {
          ElMessage.warning("入库数量填写不完整");
          return false;
        }
        let compareNum = goods.value.length - list.length;
        if (compareNum > 0) {
          ElMessageBox.confirm(`当前有${compareNum}条商品未点数,确定要执行下一步吗?`, "温馨提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              emit("sendData", {
                goods: list,
                procure_no: procure_no.value,
                in_time: form.value.in_time,
                in_wh_id: form.value.in_wh_id,
                in_wh_name: form.value.in_wh_name,
              });
              return true;
            })
            .catch((error) => {
              return false;
            });
        } else {
          emit("sendData", {
            goods: list,
            procure_no: procure_no.value,
            in_time: form.value.in_time,
            in_wh_id: form.value.in_wh_id,
            in_wh_name: form.value.in_wh_name,
          });
          return true;
        }
      } else {
        emit("sendData", {
          goods: goods.value,
          procure_no: procure_no.value,
          in_time: form.value.in_time,
          in_wh_id: form.value.in_wh_id,
          in_wh_name: form.value.in_wh_name,
        });
        return true;
      }
    } else {
      if (!form.value.in_wh_id) {
        ElMessage.warning("请您先选择入库仓库");
        return false;
      }
      return false;
    }
  });
};

// 列表勾选时触发事件
function changeSelect(selection: IBuyInAddGoods[]) {
  checkSelectList.value = [];
  if (selection.length > 1) {
    tabelRef.value?.clearSelection();
    //@ts-expect-error
    tabelRef.value?.toggleRowSelection(selection[selection.length - 1], undefined);
    let list = [selection[selection.length - 1]];
    checkSelectList.value = list.map((item) => {
      return item.procure_goods_id;
    });
  } else {
    checkSelectList.value = selection.map((item) => {
      return item.procure_goods_id;
    });
  }
}

// 勾选框是否允许勾选
function selectTable(row: any, index: number) {
  return row.isSelect;
}

// 处理扫描的条码
// 通过接口获取单号信息
function getCodeInfo() {
  if (operate_id.value === 1) {
    // 扫码入库模式
    scanMode();
    // handleScanMode()
  } else {
    // 手动入库模式
    manualMode();
  }
}

// 选择采购单号弹窗下拉框选择
function multiChange(index: number) {
  let item = multiOrderList.value[index];
  form.value.procure_no = item.procure_no;
}

// 选择采购单号弹窗确定
function dialogConfirm() {
  dialogVisible.value = false;
  handleImport();
}

// async function handleScanMode() {
//   let code = props.inputBarcode;
//   console.log("🚀 ~ handleScanMode ~ code:", code);
//   let data = {
//     content: code,
//     document_type: 2, //采购单 1
//   };

//   const result = await getLabelGoodsApi(data);
// }

// 扫码入库事件
function scanMode() {
  console.log("procureList", props.procureList);
  // let code = props.inputBarcode;
  let searchRes = regexp.test(props.inputBarcode);
  if (searchRes) {
    let code = props.inputBarcode;
    let code_len = code.length;
    /* 如果为true表示扫描的code是 CGD开头的,即视为扫描 单号 */
    if (props.pageType == 2) {
      ElMessage.warning(`编辑状态,不可修改单号`);
      return;
    }

    if (code_len < 12) {
      // 单号最小长度为12,如果长度不足12位,表示扫描不全,给予提示
      ElMessage.warning(`扫描单号${code}非正常采购单号,请重试`);
      return;
    }
    form.value.procure_no = code;
    handleImport();
  } else {
    /* code不是CGD开头的 即视为 扫描商品 */
    let code = props.inputBarcode.replace(pattern, "");
    let code_len = code.length;
    if (code_len < 8) {
      //商品条码最小长度为8 长度不足8位,表示扫描不全,给予提示
      console.log("code", code);
      console.log("code_en", code_len);
      ElMessage.warning(`扫描条码${code}非正常条码,请重试`);
      return;
    }
    if (!procure_no.value) {
      // 如果单号不存在,则需要判断此商品条码 是否存在于多个单号中
      // console.log("单号不存在,需要另外处理");

      let list = props.procureList.filter((item) => {
        return item.barcodes.includes(code);
      });
      console.log("list", list);
      if (list.length === 0) {
        // 如果list长度为0,则表示该条码 不存在于任一单号中,直接提示
        ElMessage.warning(`扫描条码${code}的商品没有可匹配的采购单`);
        return;
      } else if (list.length === 1) {
        // 如果list长度为1, 则表示该条码只存在于一个单号中,直接导入该单号
        form.value.procure_no = list[0].procure_no;
        handleImport();
      } else {
        // 如果list长度大于1,则表示该条码存在于多个单号中,显示弹窗,将存在该条码的所有单号,放入下拉选择框
        multiOrderList.value = list;
        dialogVisible.value = true;
      }

      return;
    }

    /* 单号已存在,扫描商品条码的情况 */
    /* 可能存在一个单号中,多个商品同一个条码,不同供应商的情况,用ids数组记录匹配商品条码的唯一值 */
    let ids: number[] = [];

    goods.value.forEach((item, index) => {
      if (item.barcode == code) {
        ids.push(item.procure_goods_id);
      }
    });

    if (ids.length === 0) {
      if (goods.value.length === 0 && delIds.value.length > 0) {
        // 如果商品列表没有数据,同时删除列表又有数据, 则
        let list = toRaw(backupsData.value);
        // console.log("🚀 ~ scanMode ~ list:", list);
        // console.log("🚀 ~ scanMode ~ code:", code);
        let arr: IBuyInAddGoods[] = [];
        let findRes = list.find((item) => {
          return item.barcode == code;
        });
        // console.log("findRes", findRes);
        if (findRes) {
          arr.push(findRes);
          goods.value.push(...arr);
          delIds.value = delIds.value.filter((item) => {
            return item !== findRes?.procure_goods_id;
          });
          // console.log("delIds",delIds.value)
        }
        return;
      }
      ElMessage.warning(`扫描条码${code}的商品不在单据范围内`);
      return;
    } else if (ids.length === 1) {
      // 如果ids长度为1,表示该条码在单号中只有一个商品
      let find_index = goods.value.findIndex((item) => {
        return ids.includes(item.procure_goods_id);
      });

      let valueArr = goods.value.splice(find_index, 1);
      valueArr[0].in_num = valueArr[0].in_num ? valueArr[0].in_num + 1 : 1;
      goods.value.unshift(...valueArr);
    } else {
      // 如果ids长度大于1,表示该条码在单号中存在多个商品
      let good_list: IBuyInAddGoods[] = [];
      let arr: IBuyInAddGoods[] = [];

      // 分别用两个数组记录, 匹配唯一值的商品,和不匹配的
      goods.value.forEach((item, index) => {
        if (ids.includes(item.procure_goods_id)) {
          good_list.push(item);
        } else {
          arr.push(item);
        }
      });
      // 重新赋值,排序
      goods.value = [...good_list, ...arr];
      if (checkSelectList.value.length !== 1) {
        // 如果没有勾选提示勾选,
        // ElMessage.warning("该条码存在多个,请手动勾选一个");
        setTimeout(() => {
          ElMessageBox.confirm(`该条码存在多个,请手动勾选一个`, "温馨提示", {
            confirmButtonText: "我知道了",
            showCancelButton: false,
            type: "warning",
            callback: (action: Action) => {},
          })
            .then(() => {
              console.log("点击了 确定删除");
            })
            .catch((error) => {
              console.log(error);
            });
        }, 500);
        return;
      }
      // 拿到勾选的唯一值
      let id = checkSelectList.value[0];
      // 查找唯一值匹配且条码匹配的
      let find_index = goods.value.findIndex((item) => {
        return item.procure_goods_id === id && item.barcode == code;
      });
      if (find_index != -1) {
        let valueArr = goods.value.splice(find_index, 1);
        valueArr[0].in_num = valueArr[0].in_num ? valueArr[0].in_num + 1 : 1;
        goods.value.unshift(...valueArr);
      }
    }
  }
}

// 手动入库模式
function manualMode() {
  if (props.pageType == 2) {
    ElMessage.warning("编辑页面不可导入单号");
    return;
  }
  let code_len = props.inputBarcode.length;
  let search_num = props.inputBarcode.search("CGD");
  if (code_len < 12 || search_num == -1) {
    ElMessage.warning(`扫描单号${props.inputBarcode}非正常采购单号,请重试`);
    return;
  }

  form.value.procure_no = props.inputBarcode;
  handleImport();
}

const bindInputBlur = (row: IBuyInAddGoods) => {
  console.log("🚀 ~ bindInputBlur ~ row:", row);
  let exp_day = Number(row.exp_day);
  let pro_time = row.pro_time;
  if (exp_day && pro_time) {
    console.log("exp_day", exp_day);
    console.log("pro_time", pro_time);
    let exp_time = dayjs(pro_time).add(exp_day, "day").format("YYYY-MM-DD");
    row.exp_time = exp_time;
  }
};

defineExpose({
  validateForm: validateForm,
  getDetail: getDetail,
  getCodeInfo: getCodeInfo,
});
</script>
<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules">
      <div class="flex items-baseline">
        <el-form-item label="作业方式" prop="operate_type">
          <el-select
            v-model="operate_id"
            placeholder="请选择作业方式"
            @change="selectOperateType"
            :disabled="pageType == 2"
            ref="operateRef"
          >
            <el-option
              v-for="item in operateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购单号" prop="procure_no" class="ml-[10px]">
          <order-select
            v-if="operate_id == 2"
            ref="orderSelecteRef"
            :order-num="procure_no"
            @change="orderChange"
            :list="procureList"
            :isDisabled="pageType == 2 || goods.length > 0"
          ></order-select>
          <el-row :gutter="0" v-else>
            <el-input
              v-model="procure_no"
              placeholder="请扫描采购单号"
              readonly
              :disabled="pageType == 2"
            >
              <template #suffix>
                <svg-icon icon-class="scan" size="24px"></svg-icon>
              </template>
            </el-input>
          </el-row>
        </el-form-item>
        <el-form-item label="入库仓库" class="ml-[10px]" prop="in_wh_name">
          <el-select
            v-model="form.in_wh_name"
            placeholder="请选择入库仓库"
            clearable
            filterable
            default-first-option
            @change="selectWarehouse"
            ref="selectWarehouseRef"
          >
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.name + ',' + item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库日期" prop="in_date" class="ml-[10px]">
          <el-date-picker
            style="width: 100%"
            v-model="form.in_time"
            type="date"
            placeholder="请选择入库日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
            class="dateBox"
            @change="selectDateChange"
          />
        </el-form-item>
        <div class="flex items-center ml-[auto]" v-if="operate_id === 1">
          <div class="flex items-center mr-[4px]">
            <span class="block w-[30px] h-[16px] bg-blue-400 mr-[4px]"></span>
            <span class="block min-w-[28px]">活跃</span>
          </div>
          <div class="flex items-center mr-[4px]">
            <span class="block w-[30px] h-[16px] bg-blue-100 mr-[4px]"></span>
            <span class="block min-w-[28px]">已扫</span>
          </div>
          <div class="flex items-center mr-[4px]">
            <span class="block w-[30px] h-[16px] bg-gray-200 mr-[4px]"></span>
            <span class="block min-w-[28px]">未扫</span>
          </div>
        </div>
      </div>

      <el-table
        :data="goods"
        border
        :row-class-name="rowChangeClass"
        @selection-change="changeSelect"
        row-key="procure_goods_id"
        ref="tabelRef"
        class="goods-table"
        height="600"
        scrollbar-always-on
      >
        <el-table-column
          type="selection"
          width="40"
          :selectable="selectTable"
          :reserve-selection="true"
          v-if="operate_id === 1"
        />
        <el-table-column type="index" label="#" />
        <el-table-column label="条码" prop="barcode" width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.barcode || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="title" class="table-item" width="160">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.title }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="spec" min-width="90" show-overflow-tooltip>
          <template #default="scope">
            <el-form-item>
              <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                {{ scope.row.spec || "-" }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand" width="90">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.brand || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="待入数量" prop="old_in_num" width="90">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.old_in_num || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="入库数量" prop="in_num" width="100">
          <template #header>
            <span class="text-red-500" v-if="operate_id === 2">*</span>
            <span>入库数量</span>
          </template>
          <template #default="scope">
            <div class="item in-num">
              <el-form-item
                :prop="`goods.${scope.$index}.in_num`"
                :rules="
                  operate_id === 2 || scope.row.in_num > 0
                    ? [
                        {
                          required: true,
                          message: '请输入入库数量',
                          trigger: 'blur',
                        },
                        {
                          type: 'number',
                          min: 1,
                          max: scope.row.old_in_num,
                          message: `应在1~${scope.row.old_in_num}范围内`,
                          trigger: 'blur',
                        },
                      ]
                    : []
                "
              >
                <el-input
                  v-model.number="scope.row.in_num"
                  placeholder="请输入内容"
                  v-inputnum.intp
                ></el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="供应商" prop="sup_name" min-width="100">
          <template #default="scope">
            <el-form-item :prop="`goods.${scope.$index}.sup_name`">
              <div class="item">
                <span>{{ scope.row.sup_name }}</span>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="需求部门" prop="dept_name" min-width="100">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.dept_name || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="measure_name" width="90">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.measure_name || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)" prop="price" width="120">
          <template #header>
            <span class="text-red-500" v-if="operate_id === 2">*</span>
            <span>单价(元)</span>
          </template>
          <template #default="scope">
            <div class="item">
              <el-form-item
                :prop="`goods.${scope.$index}.price`"
                :rules="operate_id === 2 || scope.row.in_num > 0 ? rules.price : []"
              >
                <el-input
                  v-model="scope.row.price"
                  placeholder="请输入内容"
                  v-inputnum.num_point
                ></el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库位" prop="ws_code" width="120">
          <template #default="scope">
            <el-form-item>
              <el-input v-model="scope.row.ws_code" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="class_name" width="90">
          <template #default="scope">
            <el-form-item>
              <span>{{ scope.row.class_name || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="批次/日期" prop="ph_no" width="160">
          <template #default="scope">
            <el-form-item>
              <div class="item">
                <el-input
                  v-model="scope.row.ph_no"
                  placeholder="请输入批次/日期"
                  v-inputnum.num_alp
                ></el-input>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="pro_time" width="160">
          <template #default="scope">
            <el-form-item>
              <el-date-picker
                style="width: 100%"
                v-model="scope.row.pro_time"
                type="date"
                placeholder="请选择生产日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :clearable="false"
                @blur="bindInputBlur(scope.row)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="保质期(天)" prop="exp_day" min-width="100">
          <template #default="scope">
            <el-form-item>
              <!-- <el-input
                v-model="scope.row.exp_day"
                placeholder="请输入保质期(天)"
                v-inputnum.int
                @blur="bindInputBlur(scope.row)"
              ></el-input> -->
              <span>{{ scope.row.exp_day || "-" }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="到期日期" prop="exp_time" width="160">
          <template #default="scope">
            <el-form-item>
              <el-date-picker
                style="width: 100%"
                v-model="scope.row.exp_time"
                type="date"
                placeholder="请选择到期日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="note" min-width="100">
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
    <div class="flex justify-center mt-[20px]">
      <el-tooltip
        effect="dark"
        content="请先选择采购单号"
        placement="top-start"
        :disabled="Boolean(procure_no)"
        v-if="operate_id === 2"
      >
        <el-button type="success" :icon="Plus" @click="handleSelect" class="w-[100px]">
          选择商品
        </el-button>
      </el-tooltip>

      <el-button
        type="success"
        :icon="RefreshLeft"
        @click="handleAdd"
        class="w-[100px]"
        v-show="delIds.length > 0 && operate_id === 1"
      >
        恢复删除
      </el-button>
    </div>
    <selectGoods
      v-model="drawerShow"
      :ids="idsList"
      ref="selectGoodsRef"
      @change="batchSelectchange"
    ></selectGoods>
    <el-dialog v-model="dialogVisible" title="采购单选择" width="30%" top="30vh">
      <div>
        <p class="mb-[20px]">该条码于多个采购单中存在</p>
        <div class="flex items-center">
          <span class="block mr-[10px]">请选择一个采购单</span>
          <order-select
            class="flex-1"
            :order-num="procure_no"
            @change="multiChange"
            :list="multiOrderList"
          ></order-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/* 设置弹窗padding */
:deep(.el-dialog__body) {
  padding-top: 10px;
}

:deep(.code-box .el-input__wrapper .el-input__inner) {
  font-weight: 700;
  color: #ff5722;
  font-size: 16px;
}
:deep(.code-box .el-input.is-disabled .el-input__inner) {
  -webkit-text-fill-color: #ff5722;
}

/* 隐藏表格列表全选 */
:deep(.el-table__header-wrapper .el-checkbox) {
  // display: none;//设置不成功，页面卡顿
  visibility: hidden;
}
/* 设置table列表勾选框的颜色 */
:deep(.goods-table .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}

/* 设置入库 第一行入库数量的颜色 */
:deep(.active-row .in-num .el-input__wrapper .el-input__inner) {
  color: #ff5722;
  font-size: 18px;
  font-weight: 600;
}

// .showy-text
:deep(.active-row .el-input.is-disabled .el-input__inner) {
  color: var(--el-text-color-primary);
  -webkit-text-fill-color: var(--el-text-color-primary);
}
</style>
