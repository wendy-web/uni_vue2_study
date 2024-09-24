<script setup lang="ts">
/* 列表页-可操作按钮组件 */
import { checkAssocType, perms as checkPerms } from "@/utils/auth";
import { useQualityPerms } from "@/hooks/quality/quality-perms";

const { qualityBtnPermsMap } = useQualityPerms();

interface Props {
  /** 单据状态 */
  status: number;
  /** 身份标识数组 */
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
  /** 是否显示详情按钮-默认为true显示 */
  showDetail?: boolean;
  /** 是否显示生成报告按钮-默认为true限制 */
  showReport?: boolean;
  /** 签字复核按钮的文本-默认为签字复核 */
  recheckText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  status: 0,
  assocType: () => [],
  orderType: 0,
  showDetail: true,
  showReport: true,
  recheckText: "签字复核",
});
const emit = defineEmits(["detail", "edit", "delete", "recall", "report"]);

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

/** 点击去详情,type:1 点击详情,type2点击签字审核,type3点击反审核 */
function clickDetail(type: number) {
  emit("detail", type);
}

/** 点击编辑 */
function clickEdit() {
  emit("edit");
}

/** 点击删除 */
function clickDel() {
  emit("delete");
}

/** 点击撤回 */
function clickRecall() {
  emit("recall");
}

/** 点击生成报告 */
function clickGenerateReport() {
  emit("report");
}
</script>
<template>
  <div class="btn-wrapper">
    <!-- 如果props.showDetail为true(默认为true) -->
    <template v-if="showDetail">
      <el-button
        type="primary"
        link
        @click="clickDetail(1)"
        class="ml-[12px]"
        v-hasPerm="getBtnPerm('detail')"
      >
        详情
      </el-button>
    </template>
    <!-- 如果是待提审,已撤回,已驳回,已反审状态时, 显示编辑和删除  -->
    <template v-if="[0, 3, 4, 5].includes(status)">
      <el-button type="primary" link @click="clickEdit" v-hasPerm="getBtnPerm('edit')">
        编辑
      </el-button>
      <!-- 当前是创建人的时候--才显示删除 -->
      <template v-if="checkAssocType(assocType, 1)">
        <el-button type="primary" link @click="clickDel" v-hasPerm="getBtnPerm('del')">
          删除
        </el-button>
      </template>
    </template>
    <!-- 如果是待审核状态时,显示撤回按钮 -->
    <template v-else-if="status === 1">
      <el-button type="primary" link @click="clickRecall" v-hasPerm="getBtnPerm('recall')">
        撤回
      </el-button>
    </template>

    <!-- 当前是审批人的时候 -->
    <template v-if="checkAssocType(assocType, 2)">
      <!-- 如果是待审核状态 -->
      <template v-if="status === 1">
        <el-button type="primary" link @click="clickDetail(2)" v-if="getAuditPerm()">
          {{ recheckText }}
        </el-button>
      </template>
    </template>
    <!-- 当前身份标识为3(为已审核人)的时候 -->
    <template v-if="checkAssocType(assocType, 3)">
      <!-- 如果是已完成状态 -->
      <template v-if="status === 2">
        <el-button type="warning" link @click="clickDetail(3)" v-hasPerm="getBtnPerm('reverse')">
          反审核
        </el-button>
      </template>
    </template>
    <!-- 如果props.showReport为true(默认为true) -->
    <template v-if="showReport">
      <!-- 如果单据状态是已完成2 -->
      <template v-if="status === 2">
        <el-button
          type="success"
          link
          @click="clickGenerateReport"
          v-hasPerm="getBtnPerm('report')"
        >
          生成报告
        </el-button>
      </template>
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
