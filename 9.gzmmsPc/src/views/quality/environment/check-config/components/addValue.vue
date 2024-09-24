<script setup lang="ts">
import { ElInput } from "element-plus";

interface Props {
  btnTitle?: string;
  list?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  btnTitle: "添加正常值",
  list: () => [] as string[],
});
const emit = defineEmits(["change"]);

const inputValue = ref("");
const dynamicTags = ref<string[]>(props.list);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

/** 回车确定和失去焦点的时候 */
const handleInputConfirm = () => {
  if (inputValue.value) {
    if (dynamicTags.value.includes(inputValue.value)) {
      return;
    }
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
  emit("change", dynamicTags.value);
};
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  emit("change", dynamicTags.value);
};

function resetTag() {
  dynamicTags.value = [];
}

defineExpose({
  resetTag,
});

watch(
  () => props.list,
  (newValue) => {
    dynamicTags.value = newValue;
  },
);
</script>
<template>
  <div>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="mb-2"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else @click="showInput" class="mb-2">+ {{btnTitle}}</el-button>
    <div class="flex flex-wrap">
      <el-tag
        v-for="tag in dynamicTags"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        size="large"
        class="mr-2 mb-2"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
