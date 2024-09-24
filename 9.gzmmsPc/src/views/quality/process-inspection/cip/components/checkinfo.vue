<script setup lang="ts">
import { isObject } from "@pureadmin/utils";
import { fixedCIPExecuteApi } from "@/api/quality/process-inspection/cip";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import checkPopupVue from "./checkPopup.vue";
import checkPopupCIPVue from "./checkPopupCIP.vue";

const useSetting = useSettingsStoreHook();
const emit = defineEmits(["refresh"]);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const before_cip = ref(); //cip前
const cip = ref(); //cip
const before_start_water = ref(); // 开机前过滤器后水样 （二氧化氯）
const before_start_wip = ref(); //开机前红牛半成品
const before_start_outwater = ref(); //开机前灌装出口水样
const open_product = ref(); //开机时红牛产品
const after_open = ref(); //开机后
const work_15min = ref(); //正常生产15分钟后
const work_20min = ref(); //正常生产20分钟后

let check_id = ref(0); //检测信息id
let order_id = ref(0); //单据id

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

/** 点击执行检测 */
const checkPopupRef = ref();
function handleExecuteCheck(item: any, dataKey: string, check_name: string) {
  console.log("🚀 ~ handleExecuteCheck ~ item:", item);
  console.log("getRetList()",getRetList())
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
      console.log("🚀 ~ beforeSure: ~ sendData:", sendData);

      const result = await fixedCIPExecuteApi(sendData);
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
    name: "CIP",
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
        cip: {
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

      const result = await fixedCIPExecuteApi(sendData);
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
  const result = await fixedCIPExecuteApi(sendData);
  ElMessage.success(result.msg);
  emit("refresh");
}

function setData(check_info: any) {
  console.log("🚀 ~ setData ~ check_info:", check_info);
  check_id.value = check_info.id;
  order_id.value = check_info.oid;
  before_cip.value = check_info.before_cip; //cip前
  cip.value = check_info.cip; //cip
  before_start_water.value = check_info.before_start_water; // 开机前过滤器后水样 （二氧化氯）
  before_start_wip.value = check_info.before_start_wip; //开机前红牛半成品
  before_start_outwater.value = check_info.before_start_outwater; //开机前灌装出口水样
  open_product.value = check_info.open_product; //开机时红牛产品
  after_open.value = check_info.after_open; //开机后
  work_15min.value = check_info.work_15min; //正常生产15分钟后
  work_20min.value = check_info.work_20min; //正常生产20分钟后
  loadingData.value = true;
}

function getRetList() {
  let checkStatus = 2; //默认部分检测
  let before_cip_ret = before_cip.value.info.map((item: any) => {
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

  let cip_ret = Number(cip.value.check_ret);

  let allCheckRet = [
    before_cip_ret,
    before_start_water_ret,
    before_start_wip_ret,
    before_start_outwater_ret,
    open_product_ret,
    after_open_ret,
    work_15min_ret,
    work_20min_ret,
  ]
    .flat()
    .map((item) => Number(item));

  allCheckRet.push(cip_ret);
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
  <div>
    <table v-if="loadingData">
      <colgroup>
        <col style="width: 60px" />
      </colgroup>
      <tr>
        <td>序号</td>
        <td>检测项目</td>
        <td colspan="2">内容</td>
        <td>测定值</td>
        <td>检验人员</td>
        <td>检测状态</td>
        <td v-if="!disabled">操作</td>
      </tr>
      <!-- cip前开始 -->
      <tr v-for="(item, i) in before_cip.info">
        <td>{{ item.index }}</td>
        <td rowspan="2" v-if="i == 0">{{ before_cip.name }}</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- <td>{{ getValuesText(item.values, item.check_ret) }}</td> -->
        <!--测定值 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'before_cip', before_cip.name)"
          >
            执行检测
          </el-button>
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleNoExecute(item, 'before_cip')"
            v-if="item.btn_type === 1"
          >
            无需执行
          </el-button>
          <!-- </template> -->
        </td>
      </tr>
      <!-- cip前结束 -->
      <!-- cip开始 -->
      <tr>
        <td rowspan="2">{{ cip.info.pm5.index }}</td>
        <td rowspan="2">{{ cip.name }}</td>
        <td rowspan="2">{{ cip.child_name }}</td>
        <td>≥0.5um</td>
        <td>
          <ul>
            <li>均值：{{ cip.info.pm05.avg }}</li>
            <li>限值：{{ cip.info.pm05.vals }}</li>
          </ul>
        </td>
        <td rowspan="2">
          <el-image
            :src="useSetting.baseHttp + cip.check_sign"
            v-if="cip.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + cip.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(cip.check_sign, cip.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td rowspan="2">{{ getCheckRetText(cip.check_ret) }}</td>
        <td rowspan="2" v-if="!disabled">
          <el-button
            :type="disableBtnStatus(cip.check_ret) ? 'info' : 'primary'"
            link
            :disabled="disableBtnStatus(cip.check_ret)"
            @click="handleCIPExecute(cip.info, cip.child_name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <tr>
        <td>≥5um</td>
        <td>
          <ul>
            <li>均值：{{ cip.info.pm5.avg }}</li>
            <li>限值：{{ cip.info.pm5.vals }}</li>
          </ul>
        </td>
      </tr>
      <!-- cip结束 -->
      <!-- 开机前过滤器后水样 （二氧化氯）开始 -->
      <tr v-for="(item, i) in before_start_water.info">
        <td>{{ item.index }}</td>
        <td :rowspan="before_start_water.info.length" v-if="i === 0">
          {{ before_start_water.name }}
        </td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 测定值 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
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
      <!-- 开机前过滤器后水样 （二氧化氯）结束  -->
      <!-- 开机前红牛半成品开始 -->
      <tr v-for="(item, i) in before_start_wip.info">
        <td>{{ item.index }}</td>
        <td rowspan="3" v-if="i === 0">{{ before_start_wip.name }}</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 测定值 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'before_start_wip', before_start_wip.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机前红牛半成品结束 -->
      <!-- 开机前灌装出口水样 -->
      <tr v-for="(item, i) in before_start_outwater.info">
        <td>{{ item.index }}</td>
        <td>{{ before_start_outwater.name }}</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- 测定值 -->
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'before_start_outwater', before_start_outwater.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机前灌装出口水样结束 -->
      <!-- 开机时红牛产品开始 -->
      <tr v-for="(item, i) in open_product.info">
        <td>{{ item.index }}</td>
        <td :rowspan="open_product.info.length" v-if="i === 0">开机时红牛产品</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- <td>{{ getValuesText(item.values, item.check_ret) }}</td> -->
        <!-- 检测值 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'open_product', open_product.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机时红牛产品结束 -->
      <!-- 开机后开始 -->
      <tr v-for="(item, i) in after_open.info">
        <td>{{ item.index }}</td>
        <td>{{ after_open.name }}</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'after_open', after_open.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 开机后结束 -->
      <!-- 正常生产15分钟后开始 -->
      <tr v-for="(item, i) in work_15min.info">
        <td>{{ item.index }}</td>
        <td>{{ work_15min.name }}</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <!-- <td>{{ getValuesText(item.values, item.check_ret) }}</td> -->
        <!-- 测定值 -->
        <td>
          {{
            item.val_type === 1
              ? getDropdownText(item.values)
              : getValuesText(item.values, item.check_ret)
          }}
        </td>
        <!-- 检测人员 -->
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <!-- 检测状态 -->
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'work_15min', work_15min.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 正常生产15分钟后结束 -->
      <!-- 正常生产20分钟后开始 -->
      <tr v-for="(item, i) in work_20min.info">
        <td>{{ item.index }}</td>
        <td rowspan="2" v-if="i === 0">正常生产20分钟后</td>
        <td colspan="2">{{ getContentText(item.name, item.base_val) }}</td>
        <td>{{ getValuesText(item.values, item.check_ret) }}</td>
        <td>
          <el-image
            :src="useSetting.baseHttp + item.check_sign"
            v-if="item.check_sign.length > 1"
            style="width: 100px; height: 60px"
            :preview-src-list="[useSetting.baseHttp + item.check_sign]"
          ></el-image>
          <span v-else>
            {{ getValuesText(item.check_sign, item.check_ret) }}
          </span>
        </td>
        <td>{{ getCheckRetText(item.check_ret) }}</td>
        <td v-if="!disabled">
          <el-button
            :type="disableBtnStatus(item.check_ret) ? 'info' : 'primary'"
            :disabled="disableBtnStatus(item.check_ret)"
            link
            @click="handleExecuteCheck(item, 'work_20min', work_20min.name)"
          >
            执行检测
          </el-button>
        </td>
      </tr>
      <!-- 正常生产20分钟后结束 -->
    </table>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
