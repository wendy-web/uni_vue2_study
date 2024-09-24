<script setup lang="ts">
/* 树形选择组件 */
export interface Props {
  placeHint?: string;
  list: any[];
}
const props = withDefaults(defineProps<Props>(), {
  placeHint: "请选择",
  list: () => [],
});
const emit = defineEmits(["nodeChange"]);

const treeSelectRef = ref();

const defaultProps = {
  children: "_children",
  label: "name",
  value: "id",
};

// const nodeIdList = ref<number[]>([]);

const model = defineModel({ required: true, default: undefined });

const nodeChange = (val: number) => {
  let currentNode = treeSelectRef.value?.getCurrentNode();
  let nodenName = currentNode?.name;
  let arr: number[] = [];
  arr.push(currentNode.id);
  const idList = getNodeId(currentNode, arr);
  emit("nodeChange", nodenName, idList);
};

function getNodeId(data: any, arr: number[]) {
  if (!data) return arr;
  /** level 是节点的层级:1是顶级  _level是数据的层级: 0的顶级 */
  if (data._level <= 0 || data.level <= 1) {
    return arr;
  } else {
    let tree = treeSelectRef.value;
    let parentNode = tree.getNode(data)?.parent;
    let parentData = parentNode?.data;

    if (parentData) {
      arr.push(parentData.id);
      getNodeId(parentNode, arr);
      return arr;
    } else {
      return arr;
    }
  }
}
</script>
<template>
  <el-tree-select
    ref="treeSelectRef"
    v-model="model"
    :data="list"
    :props="defaultProps"
    :render-after-expand="false"
    style="width: 100%"
    node-key="id"
    @change="nodeChange"
  />
</template>
<style lang="scss" scoped></style>
