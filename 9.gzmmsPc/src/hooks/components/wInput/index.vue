<script setup lang="ts">
const [modelValue] = defineModel({ required: true, default: undefined });
const props = defineProps({
  field: {
    type: String,
    default: "",
    require: true,
  },
});
const inputRef = ref();

const emit = defineEmits(["update:modelValue"]);

const max_len = computed(() => {
  if (props.field.toLocaleLowerCase() === "note") {
    return 30;
  } else {
    return -1;
  }
});
const isIncludeNum = computed(() => {
  return props.field.toLocaleLowerCase().includes("num");
});

nextTick(() => {
  inputRef.value?.focus();
});
</script>
<template>
  <el-input
    v-model.number="modelValue"
    placeholder="请输入数量"
    ref="inputRef"
    v-if="isIncludeNum"
  ></el-input>
  <el-input
    v-model="modelValue"
    placeholder="请输入内容"
    :maxlength="max_len"
    ref="inputRef"
    v-else
  ></el-input>
</template>
<style lang="scss" scoped></style>
