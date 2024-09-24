<script setup lang="ts">
// 定义版本信息的类型
interface Props {
  versionInfo: any[];
}
const props = defineProps<Props>();

const emit = defineEmits(["versionChange"]);
// 默认选中的版本号
const tabIndex = ref("1");

// 点击tab切换版本号，更新数据
function tabClick({ index, props }: any) {
  let { label, name } = props;
  tabIndex.value = name;
  emit("versionChange", name);
}
watch(
  () => [props.versionInfo],
  (newValue) => {
    if (newValue[0]) {
      // 初始化默认选中的版本号
      tabIndex.value = newValue[0][0]?.id;
      // 获取数据
      // console.log("🚀 ~ tabClick ~ tabIndex.value:", tabIndex.value);
    }
  },
);
</script>
<template>
  <div>
    <el-tabs v-if="versionInfo&&versionInfo.length" @tab-click="tabClick" v-model="tabIndex">
      <template v-for="(item, index) of versionInfo" :key="item.id">
        <el-tab-pane :label="item.name" :name="item.id">
          <template #label>
            <span>
              {{ item.name }}
            </span>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <div v-else class="color-gray">该类型还未设置版本号,请您先设置图片</div>
  </div>
</template>
<style lang="scss" scoped></style>
