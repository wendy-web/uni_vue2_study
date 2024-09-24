<script setup lang="tsx">
import { isObject } from "@pureadmin/utils";
import {
  powerConfirmExecuteApi,
  powerConfirmSignatureApi,
} from "@/api/quality/process-inspection/start";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import checkPopupVue from "@/views/quality/process-inspection/cip/components/checkPopup.vue";
import checkPopupCIPVue from "@/views/quality/process-inspection/cip/components/checkPopupCIP.vue";
import firstPopupVue from "./firstPopup.vue";
import reCheckPopupVue from "./reCheckPopup.vue";

type signatureDataType = {
  [key: string]: string;
};

const useSetting = useSettingsStoreHook();
const emit = defineEmits(["refresh"]);
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

let check_id = ref(0); //检测信息id
let order_id = ref(0); //单据id

const water_microbial_detection = ref(); //试水微生物
const before_start_water = ref(); //开机前过滤器后水样（二氧化氯）
const before_start_wip = ref(); //开机前战马/红牛半成品
const before_start_outwater = ref(); //开机前灌装出口水样
const open_product = ref(); // 开机时战马/红牛产品
const after_open = ref(); //开机后
const work_15min = ref(); //正常生产15分钟后
const work_20min = ref(); //正常生产20分钟后
const filling_condition1 = ref(); //灌装条件1, info是数组
const filling_condition2 = ref(); //灌装条件2, info是对象

const pz_manager_signature = ref(""); //品管部经理签名 1
const product_manag_signature = ref(""); //生产部经理签名 2
const laboratory_manager_signature = ref(""); //化验室负责人签名 3
const product_manager_signature = ref(""); //生产部主管签名 4
const ingredient_signature = ref(""); //配料确认人签名 5

const product_manag_uid_name = ref(""); //生产部经理名称
const pz_manager_uid_name = ref(""); //品质部经理名称

/** 查询品管部经理/生产部经理/化验室负责人/生产部主管四个人是否已经签名,是true否false */
const fourSignaturesStatus = computed(() => {
  if (
    pz_manager_signature.value &&
    product_manag_signature.value &&
    laboratory_manager_signature.value &&
    product_manager_signature.value
  ) {
    return true;
  } else {
    return false;
  }
});

/** 查询灌装条件和开机前过滤器后水样中,是否不存在未检测的项目,是为true*/
const getFillingAndFilterStatus = computed(() => {
  let water_list = before_start_water.value.info.map((item: any) => item.check_ret);
  let filling1_list = filling_condition1.value.info.map((item: any) => item.check_ret);
  let filling2_ret = Number(filling_condition2.value.check_ret);
  let allCheckRet = [water_list, filling1_list].flat().map((item) => Number(item));
  allCheckRet.push(filling2_ret);
  let someRes = allCheckRet.some((item) => item === 0);
  return !someRes;
});

const loadingData = ref(false);
const checkRetMap = new Map([
  [0, "未检测"],
  [1, "已检测"],
  [2, "无需检测"],
]);
/** 获取内容文本 */
function getContentText(content: string, base_val: any) {
  if (isObject(base_val)) {
    // 如果是一个对象,表示有标准值,获取标准值文本
    let initval = base_val.initval;
    return `${content}(${initval})`;
  }
  return content;
}

/** 获取检测状态文本 */
function getCheckRetText(check_ret: number | string) {
  let new_check_ret = Number(check_ret);
  return checkRetMap.get(new_check_ret) || "";
}

/** 根据状态返回测定值文本 */
function getValuesText(value: string, check_ret: number | string) {
  let new_check_ret = Number(check_ret);
  if (new_check_ret === 2) {
    return "-";
  } else {
    return value;
  }
}
/** 判断执行和无需执行按钮是否禁用 */
function disableBtnStatus(check_ret: number | string) {
  let new_check_ret = Number(check_ret);
  // 如果为0, 表示未检测,返回false,
  return new_check_ret === 0 ? false : true;
}

/** 根据状态返回合格/不合格的字符串1,0, ''返回文本 */
function getDropdownText(val: string) {
  let text = "";
  if (val === "1") {
    text = "合格";
  } else if (val === "0") {
    text = "不合格";
  }
  return text;
}

function getImgOrBtn(type: number, check_status?: string | number) {
  let signature_url = "";
  let disabledStatus = true; //默认禁止

  switch (type) {
    case 1:
      // 如果是1, 检测状态为1,则不禁用按钮
      disabledStatus = !Number(check_status);
      signature_url = pz_manager_signature.value; // 品管部经理签名
      break;
    case 2:
      // 同1
      disabledStatus = !Number(check_status);
      signature_url = product_manag_signature.value; //生产部经理签名
      break;
    case 3:
      // 如果是3, 查询灌装条件和开机前过滤器后水样中,是否不存在未检测的项目,是为true,则不禁用按钮
      disabledStatus = !getFillingAndFilterStatus.value;
      signature_url = laboratory_manager_signature.value; //化验室负责人签名
      break;
    case 4:
      // 同3
      disabledStatus = !getFillingAndFilterStatus.value;
      signature_url = product_manager_signature.value; //生产部主管签名
      break;
    case 5:
      // 如果是5, 其他四个签名都存在,则不禁用按钮
      disabledStatus = !fourSignaturesStatus.value;
      signature_url = ingredient_signature.value; //配料确认人签名
      break;
  }
  if(props.disabled){
    disabledStatus = true
  }
  return (
    <>
      {signature_url.length > 1 ? (
        <el-image
          src={useSetting.baseHttp + signature_url}
          preview-src-list={[useSetting.baseHttp + signature_url]}
          style="width: 100px; height: 60px"
        ></el-image>
      ) : (
        <el-button type="primary" disabled={disabledStatus} onClick={() => handleSignature(type)}>
          签字确认
        </el-button>
      )}
    </>
  );
}

function getImgOrSpan(signature_url: string, check_ret: number | string) {
  return (
    <>
      {signature_url.length > 1 ? (
        <el-image
          src={useSetting.baseHttp + signature_url}
          preview-src-list={[useSetting.baseHttp + signature_url]}
          style="width: 100px; height: 60px"
        ></el-image>
      ) : (
        <span>{getValuesText(signature_url, check_ret)}</span>
      )}
    </>
  );
}

/** 点击签字确认 */
const signDialogRef = ref();
function handleSignature(type: number) {
  //   签名类型；1:品管部经理签名; 2:生产部经理签名;3:化验室负责人签名;4:生产部主管签名; 5:配料确认人签名;
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名确认",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const singResult = await signDialogRef.value.handleGenerate();
      let data = {
        id: order_id.value,
        type,
        signature: singResult,
      };
      const result = await powerConfirmSignatureApi(data);
      ElMessage.success(result.msg);
      switch (type) {
        case 1:
          pz_manager_signature.value = singResult; // 品管部经理签名
          break;
        case 2:
          product_manag_signature.value = singResult; //生产部经理签名
          break;
        case 3:
          laboratory_manager_signature.value = singResult; //化验室负责人签名
          break;
        case 4:
          product_manager_signature.value = singResult; //生产部主管签名
          break;
        case 5:
          ingredient_signature.value = singResult; //配料确认人签名
          break;
        default:
          break;
      }
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

const dailogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
  title: "执行检测",
};

/** 第一条试水微生物检测点击执行检测触发 */
const firstPopupRef = ref();
function handleExecuteFirst(item: any, check_name: string) {
  console.log("🚀 ~ handleExecuteFirst ~ item:", item);
  let info = {
    name: check_name,
    content: item.name,
    value: item.values ? Number(item.values) : undefined,
    product_manag_uid_name: product_manag_uid_name.value,
    pz_manager_uid_name: pz_manager_uid_name.value,
  };
  addDialog({
    ...dailogOptions,
    contentRenderer: () =>
      h(firstPopupVue, {
        ref: firstPopupRef,
        info: info,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const validateRes = await firstPopupRef.value.validateExecute();
      if (!validateRes) return;
      // updateDialog(true, "btnLoading");
      let check_info = firstPopupRef.value.check_info;
      console.log("🚀 ~ beforeSure: ~ check_info:", check_info);
      // return;
      let data = {
        water_microbial_detection: {
          values: check_info.value,
          check_ret: 1,
          index: item.index,
        },
      };
      let sendData = {
        id: check_id.value,
        oid: order_id.value,
        check_ret: getRetList(),
        data,
      };

      const result = await powerConfirmExecuteApi(sendData);
      ElMessage.success(result.msg);
      updateDialog(false, "btnLoading");
      emit("refresh");
      done();
    },
  });
}

/** 点击执行检测 */
const checkPopupRef = ref();
function handleExecuteCheck(item: any, dataKey: string, check_name: string) {
  console.log("🚀 ~ handleExecuteCheck ~ item:", item);
  let info = {
    name: check_name,
    content: item.name,
    value: item.values,
    val_type: item.val_type,
  };
  addDialog({
    ...dailogOptions,
    contentRenderer: () =>
      h(checkPopupVue, {
        ref: checkPopupRef,
        info: info,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const validateRes = await checkPopupRef.value.validateExecute();
      if (!validateRes) return;
      updateDialog(true, "btnLoading");
      let check_info = checkPopupRef.value.check_info;
      console.log("🚀 ~ beforeSure: ~ check_info:", check_info);
      let data = {
        [dataKey]: {
          values: check_info.value,
          check_ret: 1,
          check_sign: check_info.check_sign,
          index: item.index,
        },
      };
      let sendData = {
        id: check_id.value,
        oid: order_id.value,
        check_ret: getRetList(),
        data,
      };

      const result = await powerConfirmExecuteApi(sendData);
      ElMessage.success(result.msg);
      updateDialog(false, "btnLoading");
      emit("refresh");
      done();
    },
  });
}

/** CIP点击执行检测 */
const checkPopupCIPRef = ref();
function handleCIPExecute(cipInfo: any, childName: string) {
  console.log("🚀 ~ handleCIPExecute ~ childName:", childName);
  console.log("🚀 ~ handleCIPExecute ~ cipInfo:", cipInfo);
  let info = {
    name: "灌装条件",
    content: childName,
    pm5: {
      avg: cipInfo.pm5.avg,
      vals: cipInfo.pm5.vals,
      index: cipInfo.pm5.index,
    },
    pm05: {
      avg: cipInfo.pm05.avg,
      vals: cipInfo.pm05.vals,
      index: cipInfo.pm05.index,
    },
  };
  addDialog({
    ...dailogOptions,
    contentRenderer: () =>
      h(checkPopupCIPVue, {
        ref: checkPopupCIPRef,
        info: info,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const validateRes = await checkPopupCIPRef.value.validateExecute();
      if (!validateRes) return;
      updateDialog(true, "btnLoading");
      let check_info = checkPopupCIPRef.value.check_info;
      console.log("🚀 ~ beforeSure: ~ check_info:", check_info);
      let data = {
        filling_condition2: {
          check_ret: 1,
          check_sign: check_info.check_sign,
          info: {
            pm05: check_info.pm05,
            pm5: check_info.pm5,
          },
        },
      };
      let sendData = {
        id: check_id.value,
        oid: order_id.value,
        check_ret: getRetList(),
        data,
      };

      const result = await powerConfirmExecuteApi(sendData);
      ElMessage.success(result.msg);
      updateDialog(false, "btnLoading");
      emit("refresh");
      done();
    },
  });
}

/** 点击无需执行 */
async function handleNoExecute(item: any, dataKey: string) {
  console.log("🚀 ~ handleNoExecute ~ item:", item);
  let data = {
    [dataKey]: {
      values: "",
      check_ret: 2,
      check_sign: "",
      index: item.index,
    },
  };
  let sendData = {
    id: check_id.value,
    oid: order_id.value,
    check_ret: getRetList(),
    data,
  };
  const result = await powerConfirmExecuteApi(sendData);
  ElMessage.success(result.msg);
  emit("refresh");
}

/** 带复检的项目点击执行检测 */
const reCheckPopupRef = ref();
function handleReCheckExecute(item: any, dataKey: string, check_name: string) {
  console.log("🚀 ~ handleExecuteCheck ~ item:", item);

  let info = {
    name: check_name,
    content: item.name,
    value: item.values,
    recheck_values: item.recheck_values,
    val_type: item.val_type,
  };
  addDialog({
    ...dailogOptions,
    contentRenderer: () =>
      h(reCheckPopupVue, {
        ref: reCheckPopupRef,
        info: info,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const validateRes = await reCheckPopupRef.value.validateExecute();
      if (!validateRes) return;
      updateDialog(true, "btnLoading");
      let check_info = reCheckPopupRef.value.check_info;
      console.log("🚀 ~ beforeSure: ~ check_info:", check_info);
      let data = {
        [dataKey]: {
          values: check_info.value,
          recheck_values: check_info.recheck_values,
          check_ret: getRetList(),
          check_sign: check_info.check_sign,
          index: item.index,
        },
      };
      let sendData = {
        id: check_id.value,
        oid: order_id.value,
        check_ret: getRetList(),
        data,
      };

      const result = await powerConfirmExecuteApi(sendData);
      ElMessage.success(result.msg);
      updateDialog(false, "btnLoading");
      emit("refresh");
      done();
    },
  });
}

function setData(check_info: any, signatureData: signatureDataType, userinfo: signatureDataType) {
  check_id.value = check_info.id;
  order_id.value = check_info.oid;
  filling_condition1.value = check_info.filling_condition1;
  filling_condition2.value = check_info.filling_condition2;
  water_microbial_detection.value = check_info.water_microbial_detection; //试水微生物
  before_start_water.value = check_info.before_start_water; // 开机前过滤器后水样 （二氧化氯）
  before_start_wip.value = check_info.before_start_wip; //开机前红牛半成品
  before_start_outwater.value = check_info.before_start_outwater; //开机前灌装出口水样
  open_product.value = check_info.open_product; //开机时红牛产品
  after_open.value = check_info.after_open; //开机后
  work_15min.value = check_info.work_15min; //正常生产15分钟后
  work_20min.value = check_info.work_20min; //正常生产20分钟后

  // 获取签字信息
  pz_manager_signature.value = signatureData.pz_manager_signature; //品管部经理签名
  product_manager_signature.value = signatureData.product_manager_signature; //生产部主管签名
  product_manag_signature.value = signatureData.product_manag_signature; //生产部经理签名
  laboratory_manager_signature.value = signatureData.laboratory_manager_signature; //化验室负责人签名
  ingredient_signature.value = signatureData.ingredient_signature; //配料确认人签名

  product_manag_uid_name.value = userinfo.product_manag_uid_name; //生产部经理名称
  pz_manager_uid_name.value = userinfo.pz_manager_uid_name; //品质部经理名称

  loadingData.value = true;
}

function getRetList() {
  let checkStatus = 2; //默认部分检测
  let water_microbial_detection_ret = water_microbial_detection.value.info.map((item: any) => {
    return item.check_ret;
  });
  let before_start_water_ret = before_start_water.value.info.map((item: any) => {
    return item.check_ret;
  });
  let before_start_wip_ret = before_start_wip.value.info.map((item: any) => {
    return item.check_ret;
  });
  let before_start_outwater_ret = before_start_outwater.value.info.map((item: any) => {
    return item.check_ret;
  });
  let open_product_ret = open_product.value.info.map((item: any) => {
    return item.check_ret;
  });
  let after_open_ret = after_open.value.info.map((item: any) => {
    return item.check_ret;
  });
  let work_15min_ret = work_15min.value.info.map((item: any) => {
    return item.check_ret;
  });
  let work_20min_ret = work_20min.value.info.map((item: any) => {
    return item.check_ret;
  });

  let filling_condition1_res = filling_condition1.value.info.map((item: any) => {
    return item.check_ret;
  });

  let filling_condition2_ret = Number(filling_condition2.value.check_ret);

  let allCheckRet = [
    water_microbial_detection_ret,
    before_start_water_ret,
    before_start_wip_ret,
    before_start_outwater_ret,
    open_product_ret,
    after_open_ret,
    work_15min_ret,
    work_20min_ret,
    filling_condition1_res,
  ]
    .flat()
    .map((item) => Number(item));

  allCheckRet.push(filling_condition2_ret);
  console.log("🚀 ~ getRetList ~ allCheckRet:", allCheckRet);
  let zerolist = allCheckRet.filter((item) => item === 0);
  console.log("🚀 ~ getRetList ~ zerolist:", zerolist);
  if (zerolist.length === 1) {
    // 如果为检测状态为0的只有一个,表示该传 全部已检测了
    checkStatus = 1;
  }
  return checkStatus;
}

defineExpose({
  setData,
});
</script>
<template>
  <!-- <div v-if="loadingData"> -->
  <div v-if="loadingData">
    <table>
      <colgroup>
        <col style="width: 60px" />
        <col style="width: 200px" />
        <col style="width: 200px" />
      </colgroup>
      <!-- 试水微生物检测开始 -->
      <tr class="tr-40 font-bold">
        <td rowspan="2">序号</td>
        <td rowspan="2">内容</td>
        <td rowspan="2">检测结果</td>
        <td colspan="2">确认人</td>
        <td rowspan="2" :colspan="disabled ? 2 : 1">检测状态</td>
        <td rowspan="2" v-if="!disabled">操作</td>
      </tr>
      <tr class="tr-40 font-bold">
        <td>品管部经理</td>
        <td>生产部经理</td>
      </tr>
      <tr v-for="(item, i) in water_microbial_detection.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="water_microbial_detection.info.length">{{ item.name }}</td>
        <td>{{ getDropdownText(item.values) }}</td>
        <!-- 品质部经理签字确认 -->
        <td>
          <component :is="getImgOrBtn(1, item.check_ret)"></component>
        </td>
        <!-- 生产部经理签名 -->
        <td>
          <component :is="getImgOrBtn(2, item.check_ret)"></component>
        </td>
        <td :colspan="disabled ? 2 : 1">{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteFirst(item, water_microbial_detection.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <tr>
        <td colspan="7">1项检测结果合格后，生产线可开机</td>
      </tr>
    </table>
    <!-- 试水微生物检测结束 -->
    <table>
      <colgroup>
        <col style="width: 60px" />
        <col style="width: 200px" />
        <col style="width: 100px" />
        <col style="width: 100px" />
      </colgroup>
      <tr class="font-bold">
        <td>序号</td>
        <td>检测项目</td>
        <td colspan="2">内容</td>
        <td>测定值</td>
        <td>检验人员</td>
        <td>确认人</td>
        <td>检测状态</td>
        <td v-if="!disabled">操作</td>
      </tr>
      <!-- 灌装条件开始 -->
      <tr v-for="(item, i) in filling_condition1.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="4">
          {{ filling_condition1.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 测定值 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <td>
          <component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component>
        </td>
        <!-- 确认人占据行数为: 4 + 开机前过滤器后水样 （二氧化氯）的length -->
        <td :rowspan="4 + before_start_water.info.length" v-if="i === 0" class="">
          <ul>
            <li class="mb-20">
              <span class="block">化验室负责人</span>
              <component :is="getImgOrBtn(3)"></component>
            </li>
            <li class="mt-10">
              <span class="block">生产部主管</span>
              <component :is="getImgOrBtn(4)"></component>
            </li>
          </ul>
        </td>
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'filling_condition1', water_microbial_detection.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>

      <tr>
        <td rowspan="2">4</td>
        <td rowspan="2">{{ filling_condition2.child_name }}</td>
        <td>≥0.5um</td>
        <td>
          <ul>
            <li>均值：{{ filling_condition2.info?.pm05?.avg }}</li>
            <li>限值：{{ filling_condition2.info?.pm05?.vals }}</li>
          </ul>
        </td>
        <td rowspan="2">
          <component
            :is="getImgOrSpan(filling_condition2.check_sign, filling_condition2.check_ret)"
          ></component>
        </td>
        <td rowspan="2">{{ getCheckRetText(filling_condition2.check_ret) }}</td>
        <td rowspan="2" v-if="!disabled">
          <el-button
            :type="disableBtnStatus(filling_condition2.check_ret) ? 'info' : 'primary'"
            link
            :disabled="disableBtnStatus(filling_condition2.check_ret)"
            @click="handleCIPExecute(filling_condition2.info, filling_condition2.child_name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <tr>
        <td>≥5um</td>
        <td>
          <ul>
            <li>均值：{{ filling_condition2.info?.pm5?.avg }}</li>
            <li>限值：{{ filling_condition2.info?.pm5?.vals }}</li>
          </ul>
        </td>
      </tr>
      <!-- 灌装条件结束 -->
      <!-- 开机前过滤器后水样 （二氧化氯）开始 -->
      <tr v-for="(item, i) in before_start_water.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="before_start_water.info.length">
          {{ before_start_water.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 测定值 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'before_start_water', before_start_water.name)"
          >
            执行检测
          </el-button>
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleNoExecute(item, 'before_start_water')"
            v-if="item.btn_type === 1"
          >
            无需执行
          </el-button>
        </td>
      </tr>
      <tr>
        <td colspan="5">1-{{ 4 + before_start_water.info.length }}项检测结果合格后进行化糖</td>
        <td>配料确认人:</td>
        <td><component :is="getImgOrBtn(5)"></component></td>
        <td>{{ fourSignaturesStatus ? "已检测" : "未检测" }}</td>
        <td class="text-gray-400" v-if="!disabled">不可操作</td>
      </tr>
      <!-- 开机前过滤器后水样 （二氧化氯）结束 -->
      <!-- 开机前战马/红牛半成品开始 -->
      <tr class="font-bold">
        <td colspan="4">半成品</td>
        <td>第一次</td>
        <td>复检</td>
        <td>检验人员</td>
        <td>检验状态</td>
        <td v-if="!disabled">操作</td>
      </tr>
      <tr v-for="(item, i) in before_start_wip.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="before_start_wip.info.length">
          {{ before_start_wip.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 复检 -->
        <td>{{ getValuesText(item.recheck_values, item.check_ret) }}</td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'before_start_wip', before_start_water.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机前战马/红牛半成品结束 -->
      <!-- 开机前灌装出口水样开始 -->
      <tr v-for="(item, i) in before_start_outwater.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="before_start_outwater.info.length">
          {{ before_start_outwater.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 复检 -->
        <td>{{ getValuesText(item.recheck_values, item.check_ret) }}</td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'before_start_outwater', before_start_outwater.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机前灌装出口水样结束 -->
      <!-- 开机时红牛/战马产品开始 -->
      <tr class="font-bold">
        <td colspan="4">成品</td>
        <td>第一次</td>
        <td>复检</td>
        <td>检验人员</td>
        <td>检验状态</td>
        <td v-if="!disabled">操作</td>
      </tr>
      <tr v-for="(item, i) in open_product.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="open_product.info.length">
          {{ open_product.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 复检 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.recheck_values)
              : getValuesText(item.recheck_values, item.check_ret)
          }}
        </td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'open_product', open_product.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机时红牛/战马产品结束 -->
      <!-- 开机后开始 -->
      <tr v-for="(item, i) in after_open.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="after_open.info.length">
          {{ after_open.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 复检 -->
        <td>{{ getValuesText(item.recheck_values, item.check_ret) }}</td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'after_open', after_open.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机后结束 -->
      <!-- 正常生产15分钟后开始 -->
      <tr v-for="(item, i) in work_15min.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="work_15min.info.length">
          {{ work_15min.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 复检 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.recheck_values)
              : getValuesText(item.recheck_values, item.check_ret)
          }}
        </td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'work_15min', work_15min.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 正常生产15分钟后结束 -->
      <!-- 正常生产20分钟后开始 -->
      <tr v-for="(item, i) in work_20min.info" :key="i">
        <td>{{ item.index }}</td>
        <td v-if="i === 0" :rowspan="work_20min.info.length">
          {{ work_20min.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 第一次 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 复检 -->
        <td>{{ getValuesText(item.recheck_values, item.check_ret) }}</td>
        <!-- 检验人员 -->
        <td><component :is="getImgOrSpan(item.check_sign, item.check_ret)"></component></td>
        <!-- 检验状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleReCheckExecute(item, 'work_20min', work_20min.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
.tr-40 {
  td {
    height: 40px;
  }
}
</style>
