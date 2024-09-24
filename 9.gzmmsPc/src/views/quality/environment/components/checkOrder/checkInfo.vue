<script setup lang="ts">
/* CIP灌装间卫生检查编辑页面下方检查信息-表格组件 */
import { AxiosPromise } from "axios";
import { cipHygieneExecuteApi } from "@/api/quality/environment/cip-hygiene";
import { flyLampExecuteApi } from "@/api/quality/environment/fly-lamp";
import { onlineVerifyExecuteApi } from "@/api/quality/environment/online-verify";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import executeInspectVue from "./executeInspect.vue";

interface Props {
  disabled: boolean; //是否禁用
  /** @单据类型 1、CIP灌装间卫生检查表 2、在线检测设备验证表 3、生产灭蝇灯检查记录 */
  orderType: number;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  orderType: 1,
});

const useSetting = useSettingsStoreHook();
const emits = defineEmits(["refresh"]);

const tableData = ref<any[]>([]);
const orderId = ref(0); //单据id;
const groupId = ref(0); //检查组id
const sign = ref(""); //签字图片数据

const executeInspectRef = ref<InstanceType<typeof executeInspectVue>>();
const inspectVisible = ref(false);

const dialogOptions = {
  width: "70%",
  btnClass: "w-[100px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
  btnSize: "large",
};

function getGroupStatusClass(status: number) {
  if (status == 1) {
    return "text-red-500";
  } else if (status == 2) {
    return "text-green-500";
  } else {
    return "";
  }
}

/** 单元格点击执行检查 */
function cellExecute(row: any, disabled = false) {
  console.log("🚀 ~ cellExecute ~ row:", row);
  groupId.value = row.id;
  inspectVisible.value = true;
  nextTick(() => {
    executeInspectRef.value?.setData(row, disabled);
  });
}
const signDialogRef = ref();
async function showSignDialog(items: any[]) {
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const signRes = await signDialogRef.value.handleGenerate();
      console.log("signRes", signRes);
      let checkData = {
        oid: orderId.value,
        id: groupId.value,
        sign: signRes,
        items,
      };
      try {
        let requestMsg = "";
        if (props.orderType === 1) {
          // 1、CIP灌装间卫生检查表
          const exexuteRes = await cipHygieneExecuteApi(checkData);
          requestMsg = exexuteRes.msg;
        } else if (props.orderType === 2) {
          // 2、在线检测设备验证表
          const exexuteRes = await onlineVerifyExecuteApi(checkData);
          requestMsg = exexuteRes.msg;
        } else if (props.orderType === 3) {
          // 3、生产灭蝇灯检查记录
          const exexuteRes = await flyLampExecuteApi(checkData);
          requestMsg = exexuteRes.msg;
        } else {
          ElMessage.warning("当前单据类型有误");
          updateDialog(false, "btnLoading");
          return;
        }

        ElMessage.success(requestMsg);
        updateDialog(false, "btnLoading");
        emits("refresh");
        done();
        inspectVisible.value = false;
      } catch (error) {
        updateDialog(false, "btnLoading");
      }
    },
  });
}

function setData(data: any[], id: number) {
  tableData.value = data;
  orderId.value = id;
}

defineExpose({
  setData,
});

/** 检查信息表格columns */
const tableColumns: TableColumnList = [
  {
    label: "操作",
    align: "center",
    slot: "operation",
    hide: () => props.disabled,
  },
  {
    label: "检查内容组名",
    prop: "name",
    align: "center",
  },
  {
    label: "检查目的",
    prop: "std_explain",
    align: "center",
  },
  {
    label: "备注",
    prop: "note",
    align: "center",
  },
  {
    label: "检查项总数",
    cellRenderer: ({ row }) => {
      return row.items?.length ? row.items?.length + "项" : "0项";
    },
    align: "center",
  },
  {
    label: "检查情况",
    align: "center",
    slot: "status",
  },
  {
    label: "确认人签名",
    prop: "sign",
    align: "center",
    slot: "sign",
  },
  {
    label: "检查人",
    prop: "check_user_name",
    align: "center",
  },
  {
    label: "检查时间",
    prop: "check_date",
    align: "center",
  },
];
</script>
<template>
  <div>
    <pure-table
      ref="prueTableRef"
      row-key="id"
      stripe
      header-cell-class-name="table-gray-header"
      :data="tableData"
      :columns="tableColumns"
      class="my-4"
      height="700"
    >
      <template #select="{ row }">
        <div>
          <ul>
            <li v-if="row.normal_val">
              <span>正常值：</span>
              <span>{{ row.normal_val }}</span>
            </li>
            <li v-if="row.abnormal_val">
              <span>异常值：</span>
              <span>{{ row.abnormal_val }}</span>
            </li>
          </ul>
        </div>
      </template>
      <template #status="{ row }">
        <div class="flex items-center justify-center">
          <span :class="getGroupStatusClass(row.status)">
            {{ row.status_text }}
          </span>
          <el-button
            type="primary"
            link
            @click="cellExecute(row, true)"
            class="ml-2 underline underline-offset-2"
          >
            查看
          </el-button>
        </div>
      </template>
      <template #sign="{ row }">
        <el-image
          :src="useSetting.baseHttp + row.sign"
          style="width: 100px; height: 60px; border-radius: 6px"
          :preview-src-list="[useSetting.baseHttp + row.sign]"
          :z-index="9999"
          preview-teleported
          v-if="row.sign"
        />
        <span v-else>--</span>
      </template>

      <template #operation="{ row }">
        <el-button link type="primary" @click="cellExecute(row)">执行检查</el-button>
      </template>
    </pure-table>
    <executeInspectVue
      v-model:visible="inspectVisible"
      ref="executeInspectRef"
      @confirm="showSignDialog"
    ></executeInspectVue>
  </div>
</template>
<style lang="scss" scoped></style>
