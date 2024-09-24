<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";

const [modelValue] = defineModel({ required: true, default: undefined });
const dateRef = ref();
const emit = defineEmits(["change", "blur"]);
const locale = ref(zhCn);

nextTick(() => {
  dateRef.value?.focus();
});
const change = (val: string) => {
  emit("change", val);
};
const blur = () => {
  emit("blur");
};
</script>
<template>
  <div>
    <el-config-provider :locale="locale">
      <el-date-picker
        style="width: 100%"
        v-model="modelValue"
        type="date"
        placeholder="请选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :clearable="false"
        ref="dateRef"
        @change="change"
        @blur="blur"
      />
    </el-config-provider>
  </div>
</template>
<style lang="scss" scoped></style>
