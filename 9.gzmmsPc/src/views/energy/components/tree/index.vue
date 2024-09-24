<script setup lang="ts">
import type { ComponentInternalInstance } from "vue";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  _children?: Tree[];
}

type HighlightMapType = { [key: string]: { highlight: boolean; id: number } };

const props = defineProps({
  adaptive: {
    type: Boolean,
    default: false,
  },
  treeLoading: Boolean,
  treeData: Array,
});
const emit = defineEmits(["tree-select"]);

const defaultProps = {
  children: "_children",
  label: "name",
};

const treeRef = ref();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const searchValue = ref(""); //搜索内容
const isExpand = ref(true); //是否展开
const highlightMap = ref({} as HighlightMapType); //高亮对象

const textRedClass = computed(() => {
  return (label: string) => {
    return searchValue.value.trim().length && label.includes(searchValue.value)
      ? "text-red-500"
      : "";
  };
});

const darkPrimary = computed(() => {
  return (id: number) => {
    return highlightMap.value[id]?.highlight ? "dark:text-primary" : "";
  };
});

const stylePrimary = computed(() => {
  return (id: number) => {
    return {
      color: highlightMap.value[id]?.highlight ? "var(--el-color-primary)" : "",
      background: highlightMap.value[id]?.highlight
        ? "var(--el-color-primary-light-7)"
        : "transparent",
    };
  };
});

function toggleRowExpansionAll(status: boolean) {
  isExpand.value = status;

  const nodes = (proxy?.$refs["treeRef"] as any).store._getAllNodes();
  // console.log("nodes", nodes);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};

const nodeClick = (data: any) => {
  const nodeId = data.$treeNodeId;
  // highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
  //   ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
  //       highlight: false,
  //     })
  //   : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
  //       highlight: true,
  //     });
  highlightMap.value[nodeId] = Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
    highlight: true,
  });

  Object.values(highlightMap.value).forEach((v: any) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  if (!highlightMap.value[nodeId].highlight) {
    emit("tree-select", [], "");
    return;
  }
  let arr: number[] = [];
  arr.push(data.id);

  const idList = getNodeId(data, arr);
  console.log("🚀 ~ nodeClick ~ idList:", idList);

  emit("tree-select", idList, data.name);
};

function getNodeId(data: any, arr: number[]) {
  if (!data) return arr;
  /** level 是节点的层级:1是顶级  _level是数据的层级: 0的顶级 */
  if (data._level <= 0 || data.level <= 1) {
    return arr;
  } else {
    let tree = proxy?.$refs["treeRef"] as any;
    let parentNode = tree.getNode(data).parent;
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

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  console.log("执行onTreeReset");
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

defineExpose({
  onTreeReset,
});
watch(searchValue, (val) => {
  treeRef.value!.filter(val);
});
</script>
<template>
  <!-- <div
    class="h-full bg-white min-h-[calc(100%-200px)]"
    :style="{ minHeight: adaptive ? `calc(100vh - 141px)` : '80%' }"
  > -->
  <!-- <div class="h-full bg-white" :class="[adaptive ? 'tree-min-h' : '']"> -->
  <div class="bg-white tree-wrapper" :class="[adaptive ? 'pop-up' : '']">
    <div class="flex items-center justify-between py-2 px-2">
      <el-input
        v-model="searchValue"
        size="small"
        placeholder="请输入采集表名"
        clearable
        style="width: 80%"
        @clear="onTreeReset"
      >
        <template #suffix>
          <i-ep-search></i-ep-search>
        </template>
      </el-input>
      <el-dropdown :hide-on-click="false">
        <!-- <i-ep-MoreFilled></i-ep-MoreFilled> -->
        <SvgIcon iconClass="moreFilled" size="20"></SvgIcon>
        >
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                link
                type="primary"
                @click="toggleRowExpansionAll(isExpand ? false : true)"
              >
                {{ isExpand ? "折叠全部" : "展开全部" }}
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider class="!mt-0" />
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      size="small"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      class="tree-max-h"
    >
      <template #default="{ node, data }">
        <span
          class="pl-1 pr-1 rounded flex items-center select-none hover:text-primary"
          :class="[textRedClass(node.label), darkPrimary(node.id)]"
          :style="stylePrimary(node.id)"
        >
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>
<style lang="scss" scoped>
/* 滚动条样式 */
::-webkit-scrollbar {
  /*整体样式*/
  width: 6px;
  height: 9px;
}
.tree-wrapper {
  height: calc(100vh - 140px);
  &.pop-up {
    height: calc(100vh - 500px);
  }
}

.tree-max-h {
  max-height: 90%;
  overflow-y: auto;
}
</style>
