<script setup lang="ts">
/* 新建/编辑/详情页面的-顶部按钮组件 */
import { checkAssocType, perms as checkPerms } from "@/utils/auth";
import { useQualityPerms } from "@/hooks/quality/quality-perms";

const { qualityBtnPermsMap } = useQualityPerms();
interface Props {
  /** 页面类型-新建/编辑/详情 */
  pageType: number;
  /** 单据状态 */
  status: number;
  /** 身份标识数组*/
  assocType: number[];
   /**
   * @explain 用来判断是哪个单据的,
   * @单据类型 1、内涂模检验 2、空罐卷封检验 3、标签标识 4、空罐进货检验  5、顶盖/底盖检验
   *  6、热缩膜检验 7、纸皮进货检验 8、战马空罐质量检告 9、原材料使用通知单 10、香精入厂检测记录
   *  11、液体糖检验 12、成品糖酸检验 13、理化及微生物检验 14、成品卷封检验 15、成品标签标识报告
   *  16、成品二维码确认单 17、pH成分分析报告 18、红牛成品检验 19、战马成品检验 20、成品发货通知单
   *  21、定量测定原始记录 22、产品定量检验报告 23、成品检验报告
   *  24、半成品检验 25、样品检验报告 26、工序控制检验  27、外箱二维码信息检测 28、CIP微生物检验
   *  29、水处理微生物检验 30、天平校准记录 31、标准样罐入库记录 
   *  32、空罐照相设备验证 33、灌装封口机清洗记录 34、灌装间空气沉降检测 35、称配料空气沉降检测 36、化验室空气沉降检测
   *  37、洁净间悬浮粒子检测 38、手部涂抹实验检验 39、生产部指膜实验 40、配料洁净间浮游菌检测 41、化验室空气浮游菌检测
   * */
  orderType?: number;
  /** 签字提交按钮的文本 */
  submitText?: string;
  /** 签字复核按钮的文本 */
  recheckText?: string;
  /** 是否显示生成报告按钮-默认为true限制 */
  showReport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageType: 0,
  status: 0,
  assocType: () => [],
  orderType: 0,
  submitText: "签字提交",
  recheckText: "签字复核",
  showReport: true,
});
const emit = defineEmits([
  "cancel",
  "save",
  "submit",
  "recheck",
  "recall",
  "reverse",
  "delete",
  "report",
]);

/** 根据传入的key-获取按钮权限标识 */
function getBtnPerm(key: string) {
  let btnPermsValue = qualityBtnPermsMap.get(props.orderType);
  // console.log("🚀 ~ getBtnPerm ~ btnPermsValue:", btnPermsValue);
  let permList = btnPermsValue?.[key] || [];
  // console.log("🚀 ~ getBtnPerm ~ permList:", permList);
  return permList;
}

/** 判断是否拥有审批或者驳回权限 */
function getAuditPerm() {
  let approveRes = checkPerms(getBtnPerm("approve"));
  // console.log("🚀 ~ getAuditPerm ~ approveRes:", approveRes);
  let RejectRes = checkPerms(getBtnPerm("reject"));
  // console.log("🚀 ~ getAuditPerm ~ RejectRes:", RejectRes);
  return approveRes || RejectRes;
}

/** 点击返回按钮 */
function handleCancel() {
  emit("cancel");
}
/** 点击保存按钮 */
function handleSave() {
  emit("save");
}
/** 点击签字提交按钮 */
function handleSubmit() {
  emit("submit");
}
/** 点击签字复核按钮 */
function handleRecheck() {
  emit("recheck");
}
/** 点击撤回按钮 */
function handleRecall() {
  emit("recall");
}
/** 点击反审按钮 */
function handleReverse() {
  emit("reverse");
}
/** 点击删除按钮 */
function handleDel() {
  emit("delete");
}
/** 点击生成报告按钮 */
function handleReport() {
  emit("report");
}
</script>
<template>
  <el-affix :offset="90" class="!w-full">
    <el-card shadow="always" :body-style="{ padding: '10px' }" class="w-full">
      <el-button type="" @click="handleCancel">返回</el-button>
      <!-- 如果是新建或者编辑,pageType为1或者2,都可以保存和签字提交 -->
      <template v-if="[1, 2].includes(pageType)">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSubmit">{{ submitText }}</el-button>
      </template>

      <!-- 如果是编辑页面则可以删除该单据 -->
      <template v-else-if="pageType === 2">
        <!-- 当前是创建人的时候 -->
        <template v-if="checkAssocType(assocType, 1)">
          <el-button type="primary" @click="handleDel" v-hasPerm="getBtnPerm('del')">
            删除
          </el-button>
        </template>
      </template>

      <!-- 如果是详情页面 -->
      <template v-else-if="pageType === 3">
        <!-- 如果是待审核状态时,显示撤回按钮 -->
        <template v-if="status === 1">
          <el-button type="primary" @click="handleRecall" v-hasPerm="getBtnPerm('recall')">
            撤回
          </el-button>
          <!-- 当前是审批人的时候 -->
          <template v-if="checkAssocType(assocType, 2)">
            <el-button type="primary" @click="handleRecheck" v-if="getAuditPerm()">
              {{ recheckText }}
            </el-button>
          </template>
        </template>

        <!-- 如果是待提审,已撤回,已驳回状态时, 显示删除  -->
        <template v-else-if="status === 0 || status === 3 || status === 4">
          <!-- 当前是创建人的时候 -->
          <template v-if="checkAssocType(assocType, 1)">
            <el-button type="primary" @click="handleDel" v-hasPerm="getBtnPerm('del')">
              删除
            </el-button>
          </template>
        </template>

        <!-- 如果是已完成状态 -->
        <template v-else-if="status === 2">
          <template v-if="checkAssocType(assocType, 3)">
            <el-button
              type="warning"
              plain
              @click="handleReverse"
              v-hasPerm="getBtnPerm('reverse')"
            >
              反审核
            </el-button>
          </template>
          <!-- 如果props.showReport为true(默认为true) -->
          <template v-if="showReport">
            <el-button type="primary" @click="handleReport" v-hasPerm="getBtnPerm('report')">
              生成报告
            </el-button>
          </template>
        </template>
      </template>
    </el-card>
  </el-affix>
</template>
<style lang="scss" scoped></style>
