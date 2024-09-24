<template>
  <el-drawer v-model="drawer" direction="rtl" :size="drawerWidth">
    <template #header>
      <div>
        <h4 style="color: #333">
          {{ toolType === 0 ? "执行停机及CIP检测详情" : "执行停机及CIP检测" }}
        </h4>
        <div style="margin-top: 10px">
          <el-button @click="drawer = false">返回</el-button>
          <template v-if="toolType === 1 && form.check_ret != '1'">
            <el-button type="danger" @click="handleDelete" v-hasPerm="['pi:stop:del']">
              删除
            </el-button>
          </template>
          <el-button type="primary" @click="handleReport" v-hasPerm="['pi:stop:report']">
            生成报告
          </el-button>
        </div>
      </div>
    </template>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
      <el-collapse v-model="activeNames" style="border: none">
        <el-collapse-item name="baseInfo">
          <template #title>
            <h4 class="from-title">
              <div class="from-title-text">基础信息</div>
            </h4>
          </template>
          <el-row :gutter="5">
            <el-col :span="6" :offset="0">
              <el-form-item label="单据编号" prop="order_no">
                <el-input disabled v-model="form.order_no"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="车间" prop="workshop_name">
                <el-input disabled v-model="form.workshop_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="线别" prop="line_name">
                <el-input disabled v-model="form.line_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="检测日期" prop="check_date">
                <el-input disabled v-model="form.check_date"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6" :offset="0">
              <el-form-item label="CIP项目" prop="pro_name">
                <el-input disabled v-model="form.pro_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="检测状态" prop="check_ret">
                <el-select v-model="form.check_ret" clearable filterable disabled>
                  <el-option label="未检测" :value="0"></el-option>
                  <el-option label="部分检测" :value="2"></el-option>
                  <el-option label="已检测" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="checkInfo">
          <template #title>
            <h4 class="from-title">
              <div class="from-title-text">检验信息</div>
            </h4>
          </template>
          <table class="shops-table">
            <tr>
              <th>序号</th>
              <th>检测项目</th>
              <th colspan="2">内容</th>
              <th>测定值</th>
              <th>检测人员</th>
              <th>检测状态</th>
              <th>操作</th>
            </tr>
            <tr>
              <td>{{ before_cip.info[0].index }}</td>
              <td>{{ before_cip.name }}</td>
              <td colspan="2">
                <span>{{ before_cip.info[0].name }}</span>
                <!-- <span v-if="before_cip.info[0].val_type == '2'">
                  {{ before_cip.info[0].base_val.strval }}
                </span> -->
              </td>
              <td style="text-align: left">
                {{ getValuesText(before_cip.info[0]) }}
              </td>
              <td>
                <el-image
                  :src="before_cip.info[0].check_sign"
                  fit="fill"
                  :lazy="true"
                  :preview-src-list="[before_cip.info[0].check_sign]"
                  :preview-teleported="true"
                  :z-index="10000"
                ></el-image>
              </td>
              <td>
                <span style="color: #909399" v-if="before_cip.info[0].check_ret == 2">
                  无需检测
                </span>
                <span style="color: #409eff" v-else-if="before_cip.info[0].check_ret == 1">
                  已检测
                </span>
                <span style="color: #f56c6c" v-else>未检测</span>
              </td>
              <td style="text-align: left">
                <el-button
                  v-if="toolType === 1"
                  type="primary"
                  link
                  :disabled="before_cip.info[0].check_ret != 0"
                  @click="handleCheck(before_cip.info[0], 'before_cip')"
                >
                  执行检测
                </el-button>
              </td>
            </tr>
            <tr>
              <td :rowspan="2">{{ cip.info.pm05.index }}</td>
              <td :rowspan="2">{{ cip.name }}</td>
              <td :rowspan="2">{{ cip.child_name }}</td>
              <td>≥0.5um</td>
              <td style="text-align: left">
                <span>均值：</span>
                {{ getValuesCipText(cip.info.pm05, "avg") }}
                <span style="margin-left: 10px">限值：</span>
                {{ getValuesCipText(cip.info.pm05, "vals") }}
              </td>
              <td :rowspan="2">
                <el-image
                  :src="cip.check_sign"
                  fit="fill"
                  :lazy="true"
                  :preview-src-list="[cip.check_sign]"
                  :preview-teleported="true"
                  :z-index="10000"
                ></el-image>
              </td>
              <td :rowspan="2">
                <span style="color: #909399" v-if="cip.check_ret == 2">无需检测</span>
                <span style="color: #409eff" v-else-if="cip.check_ret == 1">已检测</span>
                <span style="color: #f56c6c" v-else>未检测</span>
              </td>
              <td :rowspan="2" style="text-align: left">
                <el-button
                  v-if="toolType === 1"
                  type="primary"
                  link
                  :disabled="cip.check_ret != 0"
                  @click="handleCheck(cip, 'cip')"
                >
                  执行检测
                </el-button>
              </td>
            </tr>
            <tr>
              <td>≥5um</td>
              <td style="text-align: left">
                <span>均值：</span>
                {{ getValuesCipText(cip.info.pm5, "avg") }}
                <span style="margin-left: 10px">限值：</span>
                {{ getValuesCipText(cip.info.pm5, "vals") }}
              </td>
            </tr>
            <tr v-for="(item, index) in before_start_water.info" :key="item.key">
              <td>{{ item.index }}</td>
              <td :rowspan="before_start_water.info.length" v-if="index === 0">
                {{ before_start_water.name }}
              </td>
              <td :colspan="2">
                {{ item.name }}
                <span v-if="item.val_type == '2'">
                  {{ item.base_val.strval }}
                </span>
              </td>
              <td style="text-align: left">
                {{ getValuesText(item) }}
              </td>
              <td>
                <el-image
                  :src="item.check_sign"
                  fit="fill"
                  :lazy="true"
                  :preview-src-list="[item.check_sign]"
                  :preview-teleported="true"
                  :z-index="10000"
                ></el-image>
              </td>
              <td>
                <span style="color: #909399" v-if="item.check_ret == 2">无需检测</span>
                <span style="color: #409eff" v-else-if="item.check_ret == 1">已检测</span>
                <span style="color: #f56c6c" v-else>未检测</span>
              </td>
              <td style="text-align: left">
                <el-button
                  type="primary"
                  link
                  :disabled="item.check_ret != 0"
                  @click="handleCheck(item, 'before_start_water')"
                  v-if="toolType === 1"
                >
                  执行检测
                </el-button>
                <el-button
                  type="primary"
                  link
                  v-if="item.btn_type === 1 && toolType === 1"
                  :disabled="item.check_ret != 0"
                  @click="handleNoCheck(item, 'before_start_water')"
                >
                  无需执行
                </el-button>
              </td>
            </tr>
            <tr>
              <td>{{ before_start_outwater.info[0].index }}</td>
              <td>{{ before_start_outwater.name }}</td>
              <td :colspan="2">
                {{ before_start_outwater.info[0].name }}
              </td>
              <td style="text-align: left">
                {{ getValuesText(before_start_outwater.info[0]) }}
              </td>
              <td>
                <el-image
                  :src="before_start_outwater.info[0].check_sign"
                  fit="fill"
                  :lazy="true"
                  :preview-src-list="[before_start_outwater.info[0].check_sign]"
                  :preview-teleported="true"
                  :z-index="10000"
                ></el-image>
              </td>
              <td>
                <span style="color: #909399" v-if="before_start_outwater.info[0].check_ret == 2">
                  无需检测
                </span>
                <span
                  style="color: #409eff"
                  v-else-if="before_start_outwater.info[0].check_ret == 1"
                >
                  已检测
                </span>
                <span style="color: #f56c6c" v-else>未检测</span>
              </td>
              <td style="text-align: left">
                <el-button
                  type="primary"
                  link
                  :disabled="before_start_outwater.info[0].check_ret != 0"
                  @click="handleCheck(before_start_outwater.info[0], 'before_start_outwater')"
                  v-if="toolType === 1"
                >
                  执行检测
                </el-button>
              </td>
            </tr>
            <tr>
              <td>{{ after_open.info[0].index }}</td>
              <td>{{ after_open.name }}</td>
              <td :colspan="2">
                {{ after_open.info[0].name }}
              </td>
              <td style="text-align: left">
                {{ getValuesText(after_open.info[0]) }}
              </td>
              <td>
                <el-image
                  :src="after_open.info[0].check_sign"
                  fit="fill"
                  :lazy="true"
                  :preview-src-list="[after_open.info[0].check_sign]"
                  :preview-teleported="true"
                  :z-index="10000"
                ></el-image>
              </td>
              <td>
                <span style="color: #909399" v-if="after_open.info[0].check_ret == 2">
                  无需检测
                </span>
                <span style="color: #409eff" v-else-if="after_open.info[0].check_ret == 1">
                  已检测
                </span>
                <span style="color: #f56c6c" v-else>未检测</span>
              </td>
              <td style="text-align: left">
                <el-button
                  type="primary"
                  link
                  :disabled="after_open.info[0].check_ret != 0"
                  @click="handleCheck(after_open.info[0], 'after_open')"
                  v-if="toolType === 1"
                >
                  执行检测
                </el-button>
              </td>
            </tr>
          </table>
        </el-collapse-item>
        <el-collapse-item name="annex">
          <template #title>
            <h4 class="from-title">
              <div class="from-title-text">附件信息</div>
            </h4>
          </template>
          <el-row :gutter="5">
            <el-col :span="24" :offset="0">
              <el-form-item label="" label-width="0" prop="">
                <FileTable
                  :file-list="form.files"
                  :disabled="toolType === 0"
                  @add="fileAdd"
                  @del="filedel"
                ></FileTable>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6" :offset="0">
              <el-form-item label="制单人">
                <el-input disabled v-model="form.ct_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="创建时间">
                <el-input disabled v-model="form.create_time"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-drawer>
  <execute ref="executeRef" @checkComplete="refreshInfo" />
</template>

<script setup lang="tsx">
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import {
  del,
  delFile,
  getInfo,
  makeReportApi,
  saveFile,
  updateChecKRet,
} from "@/api/quality/process-inspection/stop/index";
import { Details } from "@/api/quality/process-inspection/stop/types";
import { useCommonHooks } from "@/hooks/quality";
import { useDrawerWidth } from "@/hooks/useDrawerWidth";
import { useSettingsStoreHook } from "@/store/modules/settings";
import FileTable from "./FileTable/index.vue";
import execute from "./execute.vue";
import { getValuesCipText, getValuesText } from "./utils";

const { startDownloadUrl } = useCommonHooks();

const drawer = ref(false);
const { drawerWidth } = useDrawerWidth();
const activeNames = ref(["baseInfo", "checkInfo", "annex"]);
const toolType = ref(1);
const form = ref<Details>({} as any);
const formRef = ref();

const before_cip = computed(() => {
  return form.value.check_info.before_cip;
});

const cip = computed(() => {
  return form.value.check_info.cip;
});

const before_start_water = computed(() => {
  return form.value.check_info.before_start_water;
});

const before_start_outwater = computed(() => {
  return form.value.check_info.before_start_outwater;
});

const after_open = computed(() => {
  return form.value.check_info.after_open;
});

const checkRet = computed(() => {
  if (!form.value.check_info) return 0;

  let list = [
    before_cip.value.info[0].check_ret,
    cip.value.check_ret,
    ...before_start_water.value.info.map((item) => item.check_ret),
    before_start_outwater.value.info[0].check_ret,
    after_open.value.info[0].check_ret,
  ];

  let size = list.filter((item) => item !== "").length;

  if (size >= list.length - 1) {
    return 1;
  }

  if (size < list.length) {
    return 2;
  }

  return 0;
});

// const beforeCipValid = (rule: any, value: any, callback: any) => {
//   if (before_cip.value.info[0].values === "") {
//     return callback(new Error("请选择检测值"));
//   }
//   callback();
// };

const rules = reactive<any>({
  workshop_name: { required: true, message: "请选择", trigger: "blur" },
  line_name: { required: true, message: "请选择", trigger: "blur" },
  check_date: { required: true, message: "请选择", trigger: "blur" },
  pro_name: { required: true, message: "请选择", trigger: "blur" },
  //   beforeCip: { required: true, validator: beforeCipValid, trigger: "blur" },
});

const emit = defineEmits(["refresh"]);
//info ID
let _id: any;
const show = async (id: any, type: number) => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  _id = id;
  await refreshInfo();
  toolType.value = type;
  drawer.value = true;
};

const refreshInfo = async () => {
  const { data } = await getInfo(_id);
  form.value = data;
};

const handleNoCheck = async (item: any, type: string) => {
  let params: any = {
    id: form.value.check_info.id,
    oid: form.value.check_info.oid,
    check_ret: checkRet.value,
    data: {
      [type]: {
        values: "",
        check_ret: 2,
        check_sign: "",
        index: item.index,
      },
    },
  };
  await updateChecKRet(params);
  /**本地更新 */
  refreshInfo();
};

const executeRef = ref();
const handleCheck = async (data: any, type: string) => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: any) => {
    if (valid) {
      console.log("check_ret", checkRet.value);
      let params = {
        id: form.value.check_info.id,
        oid: form.value.check_info.oid,
        check_ret: checkRet.value,
      };
      executeRef.value.show(
        JSON.parse(JSON.stringify(data)),
        params,
        form.value.check_info[type].name,
        type,
      );
    }
  });
};
const handleDelete = () => {
  ElMessageBox.confirm(`确认要删除单据编号为：【${form.value.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let result = await del(form.value.id);
    ElMessage.success(result.msg);
    drawer.value = false;
    emit("refresh");
  });
};

const fileAdd = async (params: any) => {
  let { data } = await saveFile({
    oid: form.value.check_info.oid,
    ...params,
  });
  params.id = data;
};

const filedel = async (ids: any[]) => {
  await delFile(ids);
};

const useSetting = useSettingsStoreHook();

async function handleReport() {
  let data: any = {
    id: _id,
  };
  startDownloadUrl(makeReportApi, data);
}
defineExpose({
  show,
});
</script>
<style scoped>
.from-title {
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  width: 100%;
  height: 35px;
}
.from-title-text {
  margin: 0;
  height: 35px;
  padding: 0 30px;
  line-height: 35px;
  border-radius: 5px 5px 0 0;
  background-color: rgb(215, 217, 218);
}
:deep(.el-collapse-item__header) {
  border-bottom: none;
  margin-bottom: 15px;
}
:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.shops-table {
  border-spacing: 0;
  border-top: 1px solid #d8d8d8;
  border-left: 1px solid #d8d8d8;
}
.shops-table th {
  background-color: #e9e5e5;
}
.shops-table th,
.shops-table td {
  box-sizing: border-box;
  height: 30px;
  padding: 8px 16px;
  font-size: 12px;
  color: #333;
  text-align: center;
  border-right: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
}
</style>
