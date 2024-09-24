<script setup lang="ts">
import path from "path-browserify";
import { ref } from "vue";
import { isExternal } from "@/utils/validate";
import SvgIcon from "@/components/SvgIcon/index.vue";
import AppLink from "./Link.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    required: false,
  },
  basePath: {
    type: String,
    required: true,
  },
});

const onlyOneChild = ref();

/**
 * 判断当前路由是否只有一个子路由
 *
 * 1：如果只有一个子路由： 返回 true
 * 2：如果无子路由 ：返回 true
 *
 * @param children 子路由数组
 * @param parent 当前路由
 */
function hasOneShowingChild(children = [] as any, parent: any) {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item: any) => {
    // 如果hide为true则返回 false
    if (item.hide) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      // 临时设置(如果只有一个子显示，则使用)
      onlyOneChild.value = item;
      return true;
    }
  });

  // 1：如果只有一个子路由, 返回 true
  /* 注释一下代码,解决 如果只有一个子路由的时候,只显示子菜单,不显示父菜单 */
  // if (showingChildren.length === 1) {
  //   return true;
  // }

  // 2：如果无子路由, 复制当前路由信息作为其子路由，满足只拥有一个子路由的条件，所以返回 true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, page_path: "", noShowingChildren: true };
    return true;
  }

  return false;
}

/**
 * 解析路径
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (routePath === null) {
    routePath = "";
  }
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (!routePath && !props.basePath) {
    // 当都是空的时候,直接返回空字符串,不执行下面的代码,避免报错
    return "";
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  return path.resolve(props.basePath, routePath); // 相对路径 → 绝对路径
}
</script>
<template>
  <div v-if="!item.hide">
    <!-- 只包含一个子路由节点的路由，显示其【唯一子路由】 -->
    <template
      v-if="
        hasOneShowingChild(item._children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <app-link v-if="onlyOneChild" :to="resolvePath(onlyOneChild.page_path ?? '')">
        <el-menu-item
          :index="resolvePath(onlyOneChild.page_path ?? '')"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <!-- <svg-icon v-if="onlyOneChild.icon" :icon-class="onlyOneChild.icon" /> -->
          <span class="dit"></span>
          <template #title>
            {{ onlyOneChild.auth_title }}
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <!-- 包含多个子路由  -->
    <!-- <el-sub-menu v-else :index="resolvePath(item.page_path)" popper-append-to-body> -->
    <el-sub-menu v-else :index="resolvePath(item.page_path ?? '')" teleported>
      <template #title>
        <svg-icon v-if="item.icon" :icon-class="item.icon" />
        <span v-if="item.auth_title">{{ item.auth_title }}</span>
      </template>

      <sidebar-item
        v-for="child in item._children"
        :key="child.id"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(child.page_path ?? '')"
      />
    </el-sub-menu>
  </div>
</template>
<style lang="scss" scoped>
.dit {
  flex-shrink: 0;
  display: block;
  width: 5px;
  height: 5px;
  background-color: #707070;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
