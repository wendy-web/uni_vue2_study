<template>
  <ul class="tabs">
    <i class="line"></i>
    <li
      v-for="(item, index) in tabList"
      :key="index"
      class="tab"
      :class="{ 'tab-current': index == inputValue, 'no-print': index != 0 }"
      @click="clickTab(index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  tabList: {
    type: Array,
    default: [],
    required: true,
  },
  modelValue: {
    type: Number,
    default: "",
  },
});

const inputValue = toRef(props, "modelValue");

const emit = defineEmits(["update:modelValue"]);

function clickTab(index: number) {
  emit("update:modelValue", index);
}
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  text-align: center;
  position: relative;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.tab {
  font-size: 16px;
  line-height: 33px;
  padding-bottom: 4px;
  margin-right: 40px;
  &:hover {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}

.tab-current {
  //   font-weight: 700;
  color: var(--el-color-primary);
  position: relative;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: -2px;
    border-radius: 2px;
    background-color: var(--el-color-primary);
  }
}
</style>
