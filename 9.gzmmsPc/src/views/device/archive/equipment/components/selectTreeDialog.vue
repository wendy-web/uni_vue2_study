<script setup lang="ts">
import Tree from "./tree.vue";

interface Props {
  treeData: any[];
  idList: number[];
  idName: string;
}

const props = withDefaults(defineProps<Props>(), {
  treeData: () => [],
  idList: () => [],
  idName: "",
});
const emit = defineEmits(["confirm"]);

const treeRef = ref<InstanceType<typeof Tree>>();
const dialogVisible = defineModel("dialogVisible", { required: true, default: false });

const id_list = ref<number[]>(props.idList);
const id_name = ref(props.idName);

const treeId = computed(()=>{
  return id_list.value.at(-1) || 0;
})

function onTreeSelect(idList: number[], name: string) {
  id_list.value = idList;
  id_name.value = name;
}

function confirm() {
  treeRef.value!.onTreeReset();
  emit("confirm", id_list.value, id_name.value);
}

function cancel() {
  treeRef.value!.onTreeReset();
  dialogVisible.value = false;
}

watch(
  () => props.idName,
  (newVal) => {
    id_name.value = newVal;
    id_list.value = props.idList;
  },
  { immediate: true },
);
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择资产类型"
    top="10vh"
    draggable
    :closeOnClickModal="false"
  >
    <Tree adaptive :treeData="treeData" @treeSelect="onTreeSelect" :current-tree-id="treeId" ref="treeRef"></Tree>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
