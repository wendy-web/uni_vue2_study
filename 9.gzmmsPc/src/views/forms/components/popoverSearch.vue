<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  title: string;
  value?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "confirm", "clear"]);
const popoverRef = ref();

const statusValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const keyValue = ref(props.value);
const inputRef = ref<HTMLInputElement | null>();

const onConfirm = () => {
  popoverRef.value?.hide();
  if (!keyValue.value) return;
  emit("confirm", keyValue.value);
};

const onClear = () => {
  popoverRef.value?.hide();
  keyValue.value = "";
  emit("clear");
};

const onShow = () => {
  keyValue.value = props.value;
  inputRef.value?.focus();
};

// watch(
//   () => props.modelValue,
//   (newVal) => {
//     if (newVal) {
//       keyValue.value = "";
//       statusValue.value = false;
//     }
//   },
// );
</script>
<template>
  <div @click.stop class="inline-block" :class="value ? ' text-blue-400' : ''">
    <span>{{ title }}</span>
    <el-popover
      placement="bottom-start"
      :width="200"
      ref="popoverRef"
      trigger="click"
      @show="onShow"
      :show-after="300"
    >
      <template #reference>
        <div class="inline-block pl-2 cursor-pointer">
          <i-ep-search />
        </div>
      </template>
      <div>
        <el-input v-model="keyValue" placeholder="请输入" ref="inputRef"></el-input>
        <div class="mt-2">
          <el-button type="primary" size="default" @click="onConfirm">确定</el-button>
          <el-button type="default" size="default" @click="onClear">重置</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped></style>
