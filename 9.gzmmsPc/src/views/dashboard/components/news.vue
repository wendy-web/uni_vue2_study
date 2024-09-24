<script setup lang="ts">
import { getPlanNoticeApi, getWorkMsgApi, setReadMsgApi } from "@/api/workbench";
import type { INewsList, IPlanQuery } from "@/api/workbench/types";
import { useNoticeStore } from "@/store/modules/notice";
import { formartDate } from "@/utils/validate";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  isWarningInfo: {
    type: Boolean,
    default: false,
  },
});


/** 分页查询参数 */
const pageQuery = reactive({
  page: 1,
  size: 25
});
/** 总条数 */
const total = ref(1);

/** 消息列表 */
const newsList = ref([] as INewsList[]);
/** 消息列表加载状态 */
const newsLoading = ref(false);

const listRef = ref<HTMLDivElement>();

/** 刷新状态 */
const refreshLoading = ref(false);

/** 消息列表是否没有更多 */
const newsNoMore = computed(() => newsList.value.length >= total.value);
/** 消息列表是否禁用加载 */
const newsDisabled = computed(() => newsLoading.value || newsNoMore.value);
/** 是否显示没有更多了 */
const showNoMore = computed(() => newsList.value.length >= 20 && newsNoMore.value);

let scrollTop = 0;

const newsHeight = computed(() => {
  return props.isWarningInfo ? "h-[calc(100%-200px)]" : "h-full";
});

const listHeight = computed(()=>{
  return props.isWarningInfo ? "h-[calc(100vh-98px-85px-140px-200px)]" : "h-[calc(100vh-98px-85px-140px)]";
})


/** 未读条数 */
// const unread_num = ref(0);

const { clearNoticeNum, handleOneRead } = useNoticeStore();
const { noticeNum } = storeToRefs(useNoticeStore());

const getData = async () => {
  const result = await getWorkMsgApi(toRaw(pageQuery));
  const res = result.data;
  total.value = res.total;
  // unread_num.value = res.unread_num;
  noticeNum.value = res.unread_num;
  newsList.value = newsList.value.concat(res.list);
  // Array.of(1, 2, 3, 4, 5, 6, 7).forEach((v) => {
  //   newsList.value = newsList.value.concat(res.list);
  // });
  refreshLoading.value = false;
  // console.log("newsList.value", newsList.value);
};
// 提醒计划
const planNumObj = ref({} as IPlanQuery);
const main_notice_num = computed(() => planNumObj.value.main_notice_num);
const point_notice_num = computed(() => planNumObj.value.point_notice_num);
const getDataPlan = async () => {
  const result = await getPlanNoticeApi();
  const res = result.data;
  planNumObj.value = res;
};

/** 滚动触底时触发的事件 */
const load = async () => {
  newsLoading.value = true;
  pageQuery.page += 1;
  await getData();
  newsLoading.value = false;
  // setTimeout(() => {
  //   // console.log("到底执行");
  //   newsList.value += 5;
  //   newsLoading.value = false;
  // }, 1000);
};

/** 点击一键已读触发的事件 */
const handleAllRead = async () => {
  if (!noticeNum.value) {
    ElMessage.warning({ message: "暂无未读消息", offset: 260 });
    return;
  }
  const result = await setReadMsgApi({ id: undefined });
  ElMessage.success({ message: result.msg, offset: 260 });
  newsList.value.forEach((element) => {
    if (!element.is_read) {
      element.is_read = 1;
    }
  });
  // unread_num.value = 0;
  clearNoticeNum();
};

// /** 点击消息触发的事件 */
// const handleOneRead = async (item: INewsList) => {
//   let id = item.id;
//   await setReadMsgApi({ id });
//   if (!item.is_read) {
//     item.is_read = 1;
//     unread_num.value = unread_num.value - 1;
//     reduceNoticeNum();
//   }
//   handleToTarget(item);
// };

const handleScroll = (event: Event) => {
  // console.log("event.target.scrollTop", (event.target as HTMLDivElement).scrollTop);
  scrollTop = (event.target as HTMLDivElement).scrollTop;
};

const handleRefresh = () => {
  refreshLoading.value = true;
  scrollTop = 0;
  pageQuery.page = 1;
  newsList.value = [];
  getData();
};

const goToPlan = (typePath:string) => {
  if(typePath == 'maintain') {
    if(!main_notice_num.value) return;
  } else {
    if(!point_notice_num.value) return;
  }
  router.push({
    path: `/device/${typePath}/plan`,
    query: {
      is_advent: 1
    }
  });
}
defineExpose({
  handleRefresh,
});

onMounted(() => {
  getDataPlan();
  getData();
});

onActivated(() => {
  // getData();
  if (listRef.value) {
    listRef.value.scrollTop = scrollTop;
  }
});
onDeactivated(() => {
  // pageQuery.page = 1;
  // newsList.value = [];
});
</script>

<template>
  <el-card class="news" :class="newsHeight">
    <div class="news-header">
      <div class="news-header-title">
        <i class="line"></i>
        <span class="line-text">提醒计划</span>
      </div>
    </div>
    <div class="backlog-header-list">
      <div class="backlog-header-item warning" @click="goToPlan('maintain')">
        <span>保养计划</span>
        <span class="backlog-num">{{ main_notice_num }}</span>
      </div>
      <div class="backlog-header-item primary" @click="goToPlan('inspection')">
        <span>点巡检计划</span>
        <span class="backlog-num">{{ point_notice_num }}</span>
      </div>
    </div>

    <div class="news-header">
      <div class="news-header-title">
        <i class="line"></i>
        <span class="line-text">我的消息</span>
      </div>
      <div class="news-header-unread" v-if="noticeNum > 0">
        <i class="dot"></i>
        <span>未读</span>
        <span>{{ noticeNum }}</span>
      </div>
      <div class="news-header-operation">
        <!-- <i-ep-message></i-ep-message>
            <span>一键已读</span> -->
        <el-button type="primary" plain text class="readBtn" @click="handleAllRead">
          <template #icon>
            <!-- <i-ep-message></i-ep-message> -->
            <svg-icon icon-class="yidu" color="#409EFF" />
          </template>
          一键已读
        </el-button>
      </div>
    </div>
    <ul
      class="news-list"
      :class="listHeight"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="newsDisabled"
      v-if="newsList.length > 0"
      @scroll="handleScroll"
      ref="listRef"
    >
      <li
        class="new-item"
        v-for="(item, index) in newsList"
        :key="index"
        @click="handleOneRead(item)"
      >
        <div class="new-item-left">
          <i class="dot" v-if="!item.is_read"></i>
          <!-- <span>{{ index + 1 }}</span> -->
          <span class="new-item-msg">
            {{ item.msg_content }}
          </span>
        </div>
        <span class="new-item-time">{{ formartDate(item.create_time) }}</span>
      </li>
      <p v-if="newsLoading" class="new-list-hint">加载中...</p>
      <p v-if="showNoMore" class="new-list-hint">- 没有更多了 -</p>
    </ul>
    <div v-else v-loading="refreshLoading">
      <el-empty :image-size="200" description="暂无消息" v-if="!refreshLoading" />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
/* 蓝色线的样式 */
.line {
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: var(--el-color-primary);
  vertical-align: middle;
  margin-right: 4px;
}
/* 蓝色线右侧文本样式 */
.line-text {
  font-weight: bold;
}
/* 右侧消息样式 */
.news {
  flex: 1;
  max-width: 440px;
  // height: 100%;
  /* 右侧消息的红点 */
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--el-color-danger);
    margin-right: 4px;
    flex-shrink: 0;
  }
  /* 右侧消息的头部内容样式 */
  .news-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #a8abb2;
    /* 未读样式 */
    &-unread {
      text-align: center;
      color: var(--el-color-danger);
    }
    /* 一键已读的样式 */
    &-operation {
      .readBtn {
        font-size: 16px;
      }
    }
  }
  /* 右侧消息列表 */
  .news-list {
    // height: calc(100vh - 98px - 85px - 140px);
    // height: calc(100vh - 98px - 85px - 200px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      /*整体样式*/
      width: 6px;
      height: 9px;
    }
    .new-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      height: 50px;
      border-top: 1px solid #e5e5e5;
      cursor: pointer;
      &:first-child {
        border-top: none;
      }
      &-time {
        color: var(--el-color-info);
        flex-shrink: 0;
      }
      &-left {
        display: flex;
        align-items: center;
        .new-item-msg {
          margin-right: 8px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
    .new-list-hint {
      text-align: center;
      font-size: 14px;
      color: var(--el-color-info);
    }
  }
}
/* 左侧待办头部内容 */
.backlog-header {
  padding-bottom: 10px;
  border-bottom: 0.6px solid #e5e5e5;
  position: relative;
  .refreshBtn {
    position: absolute;
    right: 0;
    top: 0;
  }
  &-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  &-list {
    display: flex;
    align-items: center;
    margin: 20px auto;
  }
  &-item {
    width: 100px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    border-radius: 4px;
    color: #fff;
    background: var(--el-color-primary);

    .backlog-num {
      font-weight: bold;
      font-size: 26px;
    }
  }
}
</style>
