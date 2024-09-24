<script setup lang="tsx">
import type { TabPaneName } from "element-plus";
import { submitImgConfigApi } from "@/api/quality/standard-config/picture";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import PictureUpload from "./PictureUpload.vue";
import MultipleImg from "./multipleImg.vue";
import SelectVersion from "./selectVersion.vue";
import SingleImg from "./singleImg.vue";
import VersionTab from "./versionTab.vue";

const useSetting = useSettingsStoreHook();

type Props = {
  /** tabs的类型--纸皮/标签标识 */
  tabsType: number;
  singleImg?: string;
  topImg?: string;
  bottomImg?: string;
  canImg?: string;
  childMap?: any; // 版本号、sku参数
  versionList?: any; // 版本下拉选项
  versionConfig?: any; // 版本配置
};

const props = defineProps<Props>();
const emit = defineEmits(["refresh", "changeActive","initConfig"]);

// const model = defineModel({ required: true, default: "ND1-1" });
/** 用于记录父组件传递过来的纸皮图片 */
const leatheroidImg = ref("");
/** 用于记录父组件传递过来的顶盖图片 */
const topcapImg = ref("");
/** 用于记录父组件传递过来的底盖图片 */
const bottomcapImg = ref("");
/** 用于记录父组件传递过来的罐身图片 */
const canbodyImg = ref("");

const leatheroidImgUrl = computed(() => {
  let file_url = leatheroidImg.value;
  return file_url ? useSetting.baseHttp + file_url : "";
});

const topcapImgUrl = computed(() => {
  let file_url = topcapImg.value;
  return file_url ? useSetting.baseHttp + file_url : "";
});

const bottomcapImgUrl = computed(() => {
  let file_url = bottomcapImg.value;
  return file_url ? useSetting.baseHttp + file_url : "";
});

const canbodyImgUrl = computed(() => {
  let file_url = canbodyImg.value;
  return file_url ? useSetting.baseHttp + file_url : "";
});

/** tabname切换事件 */
function tabChange(name: TabPaneName) {
  // model.value = name as string;
  props.childMap.sku = name as string;
  emit("initConfig");
}

function setImg() {
  let fileUrl = leatheroidImg.value;
  addDialog({
    width: "40%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: "上传图片",
    // contentRenderer: () =>
    //   h(PictureUpload, {
    //     editSrc: leatheroidImgUrl.value,
    //     onFileChange: (val: { name: string; src: string }) => {
    //       console.log("val", val);
    //       fileUrl = val.src;
    //       console.log("🚀 ~ setImg ~ fileUrl:", fileUrl);
    //     },
    //   }),

    contentRenderer: () => (
      <div class="max-h-[600px] overflow-y-auto">
        <ul>
          <li>
            <SelectVersion
              versionList={props.versionList}
              versionId={props.childMap.version_id}
              onVersionChange={(val: number) => {
                props.childMap.version_id = val;
              }}
            ></SelectVersion>
          </li>
          <li>
            <PictureUpload
              editSrc={topcapImgUrl.value}
              onFileChange={(val: { name: string; src: string }) => {
                fileUrl = val.src;
              }}
            ></PictureUpload>
          </li>
        </ul>
      </div>
    ),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      if (!props.childMap.version_id ) {
        ElMessage.warning("请选择版本");
        return;
      }
      if (!fileUrl) {
        ElMessage.warning("请上传图片");
        return;
      }
      // console.log('🚀 ~ beforeSure ~ props.childMap.version_id:', props.childMap.version_id)
      // console.log('🚀 ~ beforeSure ~ fileUrl:', fileUrl)
      updateDialog(true, "btnLoading");
      let data = {
        type: props.tabsType,
        class_type: props.childMap.sku,
        can_body_img: fileUrl,
        version_id: props.childMap.version_id,
      };
      // console.log("🚀 ~ beforeSure: ~ data:", data)
      // return
      const result = await submitImgConfigApi(data);
      updateDialog(false, "btnLoading");
      ElMessage.success(result.msg);
      // emit("refresh");
      // 初始化版本配置，刷新数据
      emit("initConfig");
      done();
    },
  });
}
function setLabelImg() {
  let top_cover_img = topcapImg.value; //顶盖图片地址
  let bottom_cover_img = bottomcapImg.value; //底盖图片地址
  let can_body_img = canbodyImg.value; //罐身图片地址
  addDialog({
    width: "40%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: "上传图片",
    top: "10vh",
    contentRenderer: () => (
      <div class="max-h-[600px] overflow-y-auto">
        <ul>
          <li>
            <SelectVersion
              versionList={props.versionList}
              versionId={props.childMap.version_id}
              onVersionChange={(val: number) => {
                props.childMap.version_id = val;
              }}
            ></SelectVersion>
          </li>
          <li>
            <span class="font-bold">上传顶盖图片↓↓↓</span>
            <PictureUpload
              editSrc={topcapImgUrl.value}
              onFileChange={(val: { name: string; src: string }) => {
                top_cover_img = val.src;
              }}
            ></PictureUpload>
          </li>
          <li>
            <span class="font-bold">上传底盖图片↓↓↓</span>
            <PictureUpload
              editSrc={bottomcapImgUrl.value}
              onFileChange={(val: { name: string; src: string }) => {
                bottom_cover_img = val.src;
              }}
            ></PictureUpload>
          </li>
          <li>
            <span class="font-bold">上传罐身图片↓↓↓</span>
            <PictureUpload
              editSrc={canbodyImgUrl.value}
              onFileChange={(val: { name: string; src: string }) => {
                can_body_img = val.src;
              }}
            ></PictureUpload>
          </li>
        </ul>
      </div>
    ),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      if (!props.childMap.version_id ) {
        ElMessage.warning("请选择版本");
        return;
      }
      if (!top_cover_img && !bottom_cover_img && !can_body_img) {
        ElMessage.warning("请上传图片");
        return;
      }
      updateDialog(true, "btnLoading");
      let data = {
        type: props.tabsType,
        class_type: props.childMap.sku,
        can_body_img: can_body_img ? can_body_img : undefined,
        top_cover_img: top_cover_img ? top_cover_img : undefined,
        bottom_cover_img: bottom_cover_img ? bottom_cover_img : undefined,
        version_id: props.childMap.version_id,
      };
      // console.log("🚀 ~ beforeSure: ~ data:", data)
      // return
      const result = await submitImgConfigApi(data);
      updateDialog(false, "btnLoading");
      ElMessage.success(result.msg);
      // emit("refresh");
      // 初始化版本配置，刷新数据
      emit("initConfig");
      done();
    },
  });
}

// 版本号改变: 红牛普通型
function versionChange(val: number) {
  props.childMap.version_id = val;
  // 切换了版本配置，刷新数据
  emit("refresh");
}

// watch(
//   () => props.singleImg,
//   (newValue) => {
//     leatheroidImg.value = newValue || "";
//   },
// );

watch(
  () => [props.singleImg, props.topImg, props.bottomImg, props.canImg],
  (newValue) => {
    leatheroidImg.value = newValue[0] || "";
    topcapImg.value = newValue[1] || "";
    bottomcapImg.value = newValue[2] || "";
    canbodyImg.value = newValue[3] || "";
  },
);
</script>
<template>
  <el-tabs v-model="childMap.sku" @tab-change="tabChange" class="pl-10 h-full">
    <el-tab-pane label="红牛-普通型" name="ND1-1">
      <VersionTab :versionInfo="versionConfig" @version-change="versionChange"></VersionTab>
      <SingleImg
        :versionList="versionList"
        :img-url="leatheroidImgUrl"
        @set-img="setImg"
        v-if="tabsType === 0"
      ></SingleImg>
      <MultipleImg
        @set-img="setLabelImg"
        :topImg="topcapImgUrl"
        :bottom-img="bottomcapImgUrl"
        :canbody-img="canbodyImgUrl"
        v-else
      ></MultipleImg>
    </el-tab-pane>
    <el-tab-pane label="红牛-强化型" name="ND1-2">
      <VersionTab :versionInfo="versionConfig" @version-change="versionChange"></VersionTab>
      <SingleImg :img-url="leatheroidImgUrl" @set-img="setImg" v-if="tabsType === 0"></SingleImg>
      <MultipleImg
        @set-img="setLabelImg"
        :topImg="topcapImgUrl"
        :bottom-img="bottomcapImgUrl"
        :canbody-img="canbodyImgUrl"
        v-else
      ></MultipleImg>
    </el-tab-pane>
    <el-tab-pane label="战马-罐装" name="ND2-1">
      <VersionTab :versionInfo="versionConfig" @version-change="versionChange"></VersionTab>
      <SingleImg :img-url="leatheroidImgUrl" @set-img="setImg" v-if="tabsType === 0"></SingleImg>
      <MultipleImg
        @set-img="setLabelImg"
        :topImg="topcapImgUrl"
        :bottom-img="bottomcapImgUrl"
        :canbody-img="canbodyImgUrl"
        v-else
      ></MultipleImg>
    </el-tab-pane>
  </el-tabs>
</template>
<style lang="scss" scoped></style>
