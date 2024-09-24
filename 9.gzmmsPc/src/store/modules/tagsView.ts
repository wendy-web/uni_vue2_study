import { defineStore } from "pinia";
import { ref } from "vue";
import { RouteLocationNormalized } from "vue-router";

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}

type EditPageDataType = {
  fullPath: string;
  first: boolean;
};

// setup
export const useTagsViewStore = defineStore("tagsView", () => {
  // state
  const visitedViews = ref<TagView[]>([]);
  const cachedViews = ref<string[]>([]);
  const editPageData = ref<EditPageDataType[]>([]);

  /** addView时(进入某个路由页面时)执行 */
  function addEditPage(view: TagView) {
    let pageList = ["add", "edit"];

    let query = view.query || {};
    let path = view.path || "";
    let fullPath = view.fullPath || "";

    const lastSegment = path.split("/").pop() || "";

    // console.log("lastSegment", lastSegment);
    if (!pageList.includes(lastSegment)) return;
    let len = Object.keys(query).length;
    if (!len) return;
    // 如果query存在参数则查看是否第一次进入该页面
    // 否则查看editPageData之前是否进入过了该页面,如果进入了找出来,删除再添加到首位
    let fullPathIndex = editPageData.value.findIndex((el) => el.fullPath === fullPath);
    // console.log("🚀 ~ addEditPage ~ fullPathIndex:", fullPathIndex);
    if (fullPathIndex === -1) {
      editPageData.value.unshift({
        fullPath,
        first: true,
      });
    } else {
      // 如果不是第一次进入,则先设置first为false;然后将其移动到首位
      editPageData.value[fullPathIndex].first = false;
      editPageData.value.unshift(...editPageData.value.splice(fullPathIndex, 1));
    }
    // 查看是否拥有相同页面,不同参数的元素,如果有则删除掉,同时设置首位的first为true
    let otherIndex = editPageData.value.findIndex((el, i) => {
      return i > 0 && el.fullPath.includes(path);
    });
    // console.log("🚀 ~ otherIndex ~ otherIndex:", otherIndex);
    if (otherIndex !== -1) {
      editPageData.value.splice(otherIndex, 1);
      editPageData.value[0].first = true;
    }
  }

    /** delView时(删除某个路由页面时)执行*/
  function delEditPage(path: string) {
    editPageData.value = editPageData.value.filter((el) => !el.fullPath.includes(path));
  }

  /** delOtherViews,delLeftViews,delRightViews时执行 */
  function delOtherEditPage(path: string) {
    editPageData.value = editPageData.value.filter((el) => el.fullPath.includes(path));
  }

  // actions
  function addVisitedView(view: TagView) {
    // console.log("addVisitedView")
    if (visitedViews.value.some((v) => v.path === view.path)) return;
    if (view.meta && view.meta.affix) {
      visitedViews.value.unshift(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        }),
      );
    } else {
      visitedViews.value.push(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        }),
      );
    }
  }

  function addCachedView(view: TagView) {
    // console.log("addCachedView",view)
    const viewName = view.name as string;
    if (cachedViews.value.includes(viewName)) return;
    if (view.meta?.keepAlive) {
      cachedViews.value.push(viewName);
    }
    // console.log("visitedViews.value",visitedViews.value)
    // console.log("cachedViews.value",cachedViews.value)
  }

  function delVisitedView(view: TagView) {
    return new Promise((resolve) => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1);
          break;
        }
      }
      resolve([...visitedViews.value]);
    });
  }

  function delCachedView(view: TagView) {
    const viewName = view.name as string;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName);
      index > -1 && cachedViews.value.splice(index, 1);
      resolve([...cachedViews.value]);
    });
  }

  function delOtherVisitedViews(view: TagView) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.meta?.affix || v.path === view.path;
      });
      resolve([...visitedViews.value]);
    });
  }

  function delOtherCachedViews(view: TagView) {
    const viewName = view.name as string;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName);
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        cachedViews.value = [];
      }
      resolve([...cachedViews.value]);
    });
  }

  function updateVisitedView(view: TagView) {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }

  function addView(view: TagView) {
    addVisitedView(view);
    addCachedView(view);
    addEditPage(view);
  }

  function delView(view: TagView) {
    return new Promise((resolve) => {
      delVisitedView(view);
      delCachedView(view);
      delEditPage(view.path || "");
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delOtherViews(view: TagView) {
    return new Promise((resolve) => {
      delOtherVisitedViews(view);
      delOtherCachedViews(view);
      delOtherEditPage(view.path || "");
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delLeftViews(view: TagView) {
    console.log("🚀 ~ delLeftViews ~ view:", view);
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path);
      if (currIndex === -1) {
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        // affix:true 固定tag，例如“首页”
        if (index >= currIndex || (item.meta && item.meta.affix)) {
          return true;
        }

        const cacheIndex = cachedViews.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });

      delOtherEditPage(view.path || "");
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }
  function delRightViews(view: TagView) {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path);
      if (currIndex === -1) {
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        // affix:true 固定tag，例如“首页”
        if (index <= currIndex || (item.meta && item.meta.affix)) {
          return true;
        }

        const cacheIndex = cachedViews.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });
      delOtherEditPage(view.path || "");
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }

  function delAllViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag.meta?.affix);
      visitedViews.value = affixTags;
      cachedViews.value = [];
      editPageData.value = [];
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delAllVisitedViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag.meta?.affix);
      visitedViews.value = affixTags;
      resolve([...visitedViews.value]);
    });
  }

  function delAllCachedViews() {
    return new Promise((resolve) => {
      cachedViews.value = [];
      resolve([...cachedViews.value]);
    });
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOtherVisitedViews,
    delOtherCachedViews,
    updateVisitedView,
    addView,
    delView,
    delOtherViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    editPageData,
    addEditPage,
    delEditPage,
  };
});
