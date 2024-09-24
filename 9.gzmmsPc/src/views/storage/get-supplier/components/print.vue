<script setup lang="ts">
import printJS from "print-js";

interface Props {
  visible: boolean;
  printInfo: any;
}

enum EStatus {
  "待提审" = 0,
  "待审核" = 1,
  "已完成" = 3,
  "已撤回" = 4,
  "已驳回" = 5,
  "已作废" = 6,
  "已审批" = 7,
  "待领料" = 8,
  "已发料" = 9,
  "待确认" = 10,
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  printInfo: () => ({
    wh_rec_no: "",
    ct_name: "",
    create_time: "",
    rp_uname: "",
    status: 0,
    note: "",
    tableData: [],
  }),
});
let emits = defineEmits(["update:visible"]);

let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});
const orderStatus = computed(() => {
  return EStatus[props.printInfo.status];
});

console.log("props.printInfo.tableData", props.printInfo.tableData);

const tableData = ref(props.printInfo.tableData);

const theadList = ref([
  "条码",
  "名称",
  "规格型号",
  "品牌",
  "分类",
  "单位",
  "批次/日期",
  "出库仓库",
  "使用地点",
  "申请数量",
  "已领数量",
  "发料状态",
  "备注",
]);

const drawerConfirm = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在启动打印服务",
  });
  /*
      设置了 .no-print 类名的元素,在打印时不显示
      设置表格td元素的字体大小为12px
    */
  const style = `@media print {.no-print {display: none !important;td{font-size:12px !important;}}}`;

  // 解决打印对话框关闭后执行的回调函数触发问题
  // let focuser = setInterval(() => window.dispatchEvent(new Event("focus")), 500);

  setTimeout(() => {
    printJS({
      printable: "print-area",
      type: "html",
      targetStyles: ["*"],
      style: style,
      honorColor: false,
      font_size: "", //解决td{font-size:12px无效问题
      onPrintDialogClose: function () {
        // 在浏览器打印对话框关闭后执行的回调函数。
        // clearInterval(focuser);
        console.log("我关闭了");
      },
    });
    loading.close();
  }, 100);
};

watchEffect(() => {
  if (props.visible) {
    tableData.value = props.printInfo.tableData;
  }
});
</script>

<template>
  <el-drawer v-model="visibleDialog" title="打印表格内容" size="60%">
    <div class="print-area" id="print-area">
      <div class="print-header">
        <div class="header-left">
          <div class="mb-[20px]">
            <div class="header-left-bottom text-primary">
              <span>领料出库单号：</span>
              <span>{{ printInfo.wh_rec_no }}</span>
            </div>
            <div class="header-left-bottom text-primary">
              <span>制单人：</span>
              <span>{{ printInfo.ct_name }}</span>
            </div>
            <div class="header-left-bottom text-primary">
              <span>创建时间：</span>
              <span>{{ printInfo.create_time }}</span>
            </div>
          </div>
          <div class="header-left-bottom text-primary">
            <span>领料申请人：</span>
            <span>{{ printInfo.rp_uname }}</span>
          </div>
        </div>
        <div class="header-right">
          <span class="code-status">{{ orderStatus }}</span>
          <barcode :value="printInfo.wh_rec_no" v-if="printInfo.wh_rec_no"></barcode>
        </div>
      </div>
      <!-- 出库单详情 -->
      <div>
        <div class="table-container">
          <table cellspacing="0" cellpadding="0" border="0">
            <thead>
              <tr>
                <td v-for="(item, index) in theadList">{{ item }}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" style="page-break-inside: avoid">
                <td>{{ item.barcode }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.spec }}</td>
                <td>{{ item.brand }}</td>
                <td>{{ item.class_name }}</td>
                <td>{{ item.measure_name }}</td>
                <td>{{ item.ph_no }}</td>
                <td>{{ item.warehouse_name }}</td>
                <td>{{ item.use_places }}</td>
                <td>{{ item.rec_num }}</td>
                <td>{{ item.received_num }}</td>
                <td>
                  <span v-if="item.issuance_status == 1">部分发料</span>
                  <span v-else-if="item.issuance_status == 2">全部发料</span>
                  <span v-else>待发料</span>
                </td>
                <td :style="[index == 13 ? 'page-break-after:always' : '']">
                  {{ item.note }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-[20px]">
            <div>
              <span class="text-sm">备注：</span>
              <span class="text-primary">{{ printInfo.note || "无" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-start">
        <el-button @click="drawerConfirm" size="large" type="primary" class="w-[100px]">
          确认打印
        </el-button>
        <el-button
          type="primary"
          plain
          size="large"
          class="w-[100px]"
          @click="visibleDialog = false"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.print-area {
  .print-header {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left-top {
      margin-bottom: 10px;
    }
    .header-left-bottom {
      display: inline-block;
      margin-right: 20px;
    }
    .header-right {
      display: flex;
      align-items: center;
      .code-status {
        font-weight: bold;
        display: inline-block;
        margin-right: 20px;
      }
      .code-img {
        height: 80px;
      }
    }
  }
}
</style>
