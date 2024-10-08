<script setup lang="ts">
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from "@element-plus/icons-vue";
import path from "path-browserify";
import {
  ComponentInternalInstance,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { constantRoutes } from "@/router/index";
// import { generateTitle } from '@/utils/i18n';
import { usePermissionStore } from "@/store/modules/permission";
import { TagView, useTagsViewStore } from "@/store/modules/tagsView";
import ScrollPane from "./ScrollPane.vue";

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const router = useRouter();
const route = useRoute();

const visible = ref(false);
const selectedTag = ref({});
const scrollPaneRef = ref();
const left = ref(0);
const top = ref(0);
const affixTags = ref<TagView[]>([]);

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    //初始化立即执行
    immediate: true,
  },
);

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});

function filterAffixTags(routes: any[], basePath = "/") {
  let tags: TagView[] = [];

  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

function initTags() {
  // const tags = filterAffixTags(permissionStore.routes);
  const tags = filterAffixTags(constantRoutes);
  affixTags.value = tags;
  for (const tag of tags) {
    // Must have tag name
    if ((tag as TagView).name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

function addTags() {
  if (route.name) {
    tagsViewStore.addView(route);
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    for (const r of tagsViewStore.visitedViews) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route);
        }
      }
    }
  });
}

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

function isFirstView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath === tagsViewStore.visitedViews[1].fullPath ||
      (selectedTag.value as TagView).fullPath === "/index"
    );
  } catch (err) {
    return false;
  }
}

function isLastView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  // console.log("view", view);
  const { fullPath, query } = view;

  nextTick(() => {
    router.replace({
      path: "/redirect" + fullPath,
      query: query,
    });
  });
}

function toLastView(visitedViews: TagView[], view?: any) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === "Dashboard") {
      // if (view.name === "Workbench") {
      // to reload home page
      router.replace({ path: "/redirect" + view.fullPath });
    } else {
      router.push("/");
    }
  }
}

function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view).then((res: any) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view);
    }
  });
}

function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res: any) => {
    if (!res.visitedViews.find((item: any) => item.fullPath === route.fullPath)) {
      toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res: any) => {
    if (!res.visitedViews.find((item: any) => item.fullPath === route.fullPath)) {
      toLastView(res.visitedViews);
    }
  });
}

function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllViews().then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;
  const offsetLeft = proxy?.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = proxy?.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft + 15; // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
}

function closeMenu() {
  visible.value = false;
}

function handleScroll() {
  closeMenu();
}

onMounted(() => {
  initTags();
});
</script>

<template>
  <div class="tags-container flex items-center shadow-lg">
    <scroll-pane ref="scrollPaneRef" class="tags-list" @scroll="handleScroll">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <!-- {{ tag.meta?.title }} -->
        {{ tag.title }}

        <span
          v-if="!isAffix(tag)"
          class="tags-item-remove"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <svg-icon icon-class="close" />
        </span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="tags-item-menu">
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        关闭
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  .tags-list {
    .tags-item {
      display: inline-block;
      cursor: pointer;
      border: 1px solid #d8dce5;
      padding: 3px 8px;
      font-size: 13px;
      margin: 2px 0 0 5px;
      border-radius: 2px;
      &:first-of-type {
        margin-left: 20px;
      }

      &:last-of-type {
        margin-right: 20px;
      }

      &:hover {
        color: var(--el-color-primary);
      }

      &.active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
        &::before {
          display: inline-block;
          content: "";
          background: #fff;
          border: 1px solid var(--el-color-primary);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }

      &-remove {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        line-height: 14px;
        text-align: center;
        &:hover {
          color: #fff;
          background-color: #ccc;
        }
      }
    }
  }

  .tags-item-menu {
    // background: #fff;
    background: var(--el-bg-color-overlay);
    z-index: 99;
    position: absolute;
    border-radius: 4px;
    font-size: 12px;
    // box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    box-shadow: var(--el-box-shadow-light);
    li {
      padding: 8px 16px;
      cursor: pointer;
      &:hover {
        // background: #eee;
        background: var(--el-fill-color-light);
      }
    }
  }
}
</style>
