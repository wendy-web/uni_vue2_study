<script lang="ts">
export default {
  name: "PureTableBarVue",
};
</script>
<script setup lang="ts">
import Sortable from "sortablejs";
import DragIcon from "./svg/drag.svg?component";
import ExpandIcon from "./svg/expand.svg?component";
import RefreshIcon from "./svg/refresh.svg?component";
import SettingIcon from "./svg/settings.svg?component";
import CollapseIcon from "./svg/collapse.svg?component";
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";

import { delay, getKeyList, cloneDeep } from "@pureadmin/utils";
const props = defineProps({
  /** 头部右边的标题 */
  title: {
    type: String,
    default: "",
  },
  /** 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可 */
  tableRef: {
    type: Object as PropType<any>,
  },
  /** 需要展示的列 */
  columns: {
    type: Array as PropType<TableColumnList>,
    default: () => [],
  },
  /** 不展示的字段列表 */
  filterList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["refresh"]);

const buttonRef = ref();
const size =
  ref<EpPropMergeType<StringConstructor, "large" | "default" | "small", unknown>>("default");
const isExpandAll = ref(true);
const loading = ref(false);
const checkAll = ref(true);
const isIndeterminate = ref(false);

const checkDiv = ref<HTMLElement | null>(null);

let initColumnList = getKeyList(cloneDeep(props?.columns), "label");

const checkColumnArr = ref(initColumnList);

const checkedColumns = ref(initColumnList);

const dynamicColumns = ref(cloneDeep(props?.columns));

/** 根据filterList(不展示的字段列表)来过滤勾选项,和动态列 */
function checkFilter() {
  if (props.filterList.length > 0) {
    let arr: string[] = [];
    dynamicColumns.value.forEach((element: any) => {
      if (props.filterList.includes(element.prop)) {
        element.hide = true;
        arr.push(element.label);
      }
    });
    checkedColumns.value = checkedColumns.value.filter((item: string) => {
      return !arr.includes(item);
    });
  }
}

onMounted(() => {
  checkFilter();
});

const getDropdownItemStyle = computed(() => {
  return (s: any) => {
    return {
      background: s === size.value ? s : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    };
  };
});

const iconClass = computed(() => {
  return [
    "text-black",
    "dark:text-white",
    "duration-100",
    "hover:!text-primary",
    "cursor-pointer",
    "outline-none",
  ];
});

const topClass = computed(() => {
  return [
    "flex",
    "justify-between",
    "pt-[3px]",
    "px-[11px]",
    "border-b-[1px]",
    "border-solid",
    "border-[#dcdfe6]",
    "dark:border-[#303030]",
  ];
});

function onReFresh() {
  loading.value = true;
  emit("refresh");
  delay(500).then(() => (loading.value = false));
}

function onExpand() {
  isExpandAll.value = !isExpandAll.value;
  toggleRowExpansionAll((props.tableRef as any).data, isExpandAll.value);
}
function toggleRowExpansionAll(data: any, isExpansion: any) {
  data.forEach((item: any) => {
    (props.tableRef as any).toggleRowExpansion(item, isExpansion);
    if (item.children !== undefined && item.children !== null) {
      toggleRowExpansionAll(item.children, isExpansion);
    }
  });
}
function handleCheckAllChange(val: any) {
  checkedColumns.value = val ? initColumnList : [];

  isIndeterminate.value = false;
  dynamicColumns.value.map((column: any) => (val ? (column.hide = false) : (column.hide = true)));
}
function handleCheckedColumnsChange(value: any[]) {
  const checkedCount = value.length;
  checkAll.value = checkedCount === initColumnList.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < initColumnList.length;
}

function handleCheckColumnListChange(val: any, label: string) {
  dynamicColumns.value.filter((item: any) => item.label === label)[0].hide = !val;
}
function onReset() {
  checkAll.value = true;
  isIndeterminate.value = false;
  dynamicColumns.value = cloneDeep(props?.columns);
  checkColumnArr.value = [];
  nextTick(() => {
    checkColumnArr.value = [...initColumnList];
    checkedColumns.value = [...initColumnList];
    checkFilter();
  });
}
/** 列展示拖拽排序 */
const rowDrop = (event: { preventDefault: () => void }) => {
  event.preventDefault();
  nextTick(() => {
    // 下面这种方式 刷新路由后, 可能会导致无法拖拽
    // const wrapper: HTMLElement | null = document.querySelector(".el-checkbox-group>div");
    // 使用以下ref方式解决
    const wrapper: HTMLElement | null = checkDiv.value!.querySelector(".el-checkbox-group>div");

    Sortable.create(wrapper as HTMLElement, {
      animation: 300,
      handle: ".drag-btn",
      onEnd: ({ newIndex, oldIndex, item }) => {
        const targetThElem = item;
        const wrapperElem = targetThElem.parentNode as HTMLElement;
        const oldColumn = dynamicColumns.value[oldIndex as number];
        const newColumn = dynamicColumns.value[newIndex as number];
        if (oldColumn?.fixed || newColumn?.fixed) {
          // 当前列存在fixed属性 则不可拖拽
          const oldThElem = wrapperElem.children[oldIndex as number] as HTMLElement;
          if (newIndex! > oldIndex!) {
            wrapperElem.insertBefore(targetThElem, oldThElem);
          } else {
            wrapperElem.insertBefore(
              targetThElem,
              oldThElem ? oldThElem.nextElementSibling : oldThElem,
            );
          }
          return;
        }
        const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0];
        dynamicColumns.value.splice(newIndex, 0, currentRow);
      },
    });
  });
};

const isFixedColumn = (label: string) => {
  return dynamicColumns.value.filter((item: any) => item.label === label)[0].fixed ? true : false;
};

defineExpose({
  dynamicColumns: dynamicColumns.value,
});
</script>
<template>
  <div>
    <div class="flex items-start justify-between w-full h-[44px]">
      <slot name="buttons"></slot>
      <div class="flex items-center justify-around ml-[auto]">
        <p class="font-bold truncate mr-[10px]" v-if="props.title">{{ props.title }}</p>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <RefreshIcon
            :class="['w-[16px]', iconClass, loading ? 'animate-spin' : '']"
            @click="onReFresh"
          ></RefreshIcon>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip effect="dark" content="密度" placement="top">
          <el-dropdown trigger="click">
            <template #dropdown>
              <el-dropdown-menu class="translation">
                <el-dropdown-item @click="size = 'large'">宽松</el-dropdown-item>
                <el-dropdown-item @click="size = 'default'">默认</el-dropdown-item>
                <el-dropdown-item @click="size = 'small'">紧凑</el-dropdown-item>
              </el-dropdown-menu>
            </template>

            <CollapseIcon :class="['w-[16px]', iconClass]" />
          </el-dropdown>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-popover placement="bottom-start" width="160" trigger="click">
          <template #reference>
            <SettingIcon
              :class="['w-[16px]', iconClass]"
              @mouseover="buttonRef = $event.currentTarget"
            ></SettingIcon>
          </template>
          <div :class="[topClass]">
            <el-checkbox
              v-model="checkAll"
              label="列展示"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            ></el-checkbox>
            <el-button type="primary" link @click="onReset">重置</el-button>
          </div>
          <div class="pt-[6px] pl-[11px]" ref="checkDiv">
            <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
              <el-space direction="vertical" alignment="flex-start" :size="0">
                <div class="flex items-center" v-for="item in checkColumnArr">
                  <DragIcon
                    :class="[
                      'drag-btn w-[16px] mr-2',
                      isFixedColumn(item) ? '!cursor-no-drop' : '!cursor-grab',
                    ]"
                    @mouseenter="rowDrop"
                  ></DragIcon>
                  <el-checkbox
                    :key="item"
                    :label="item"
                    @change="handleCheckColumnListChange($event, item)"
                  >
                    <span
                      :title="item"
                      class="inline-block w-[120px] truncate hover:text-text_color_primary"
                    >
                      {{ item }}
                    </span>
                  </el-checkbox>
                </div>
              </el-space>
            </el-checkbox-group>
          </div>
        </el-popover>
      </div>
      <el-tooltip
        content="列设置"
        placement="top"
        effect="dark"
        trigger="hover"
        :virtual-ref="buttonRef"
        virtual-triggering
      ></el-tooltip>
    </div>
    <slot v-bind="{ size, dynamicColumns }"></slot>
  </div>
</template>
<style lang="scss" scoped></style>
