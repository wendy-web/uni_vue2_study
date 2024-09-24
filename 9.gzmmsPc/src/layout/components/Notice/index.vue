<script setup lang="ts">
// import { useNotice } from "@/views/dashboard/hooks";
import { useNoticeStore } from "@/store/modules/notice";
import { storeToRefs } from "pinia";
import type { DropdownInstance } from "element-plus";
import type { INewsList } from "@/api/workbench/types";

const store = useNoticeStore();
const { noticeList, noticeNum } = storeToRefs(store);
const { handleOneRead, restNotice } = store;

const dropdownRef = ref<DropdownInstance>();
const noticeLoading = ref(false);

const noticeNoMore = computed(() => noticeList.value.length >= noticeNum.value);

const noticeDisabled = computed(() => noticeLoading.value || noticeNoMore.value);

const notices = computed(() => (noticeNum.value > 0 ? noticeNum.value : ""));

const load = async () => {
  noticeLoading.value = true;
  await store.getNotice();
  noticeLoading.value = false;
};

const handleClickItem = (item: INewsList) => {
  dropdownRef.value?.handleClose();
  handleOneRead(item);
};

const dropdownChange = (val: boolean) => {
  console.log("val", val);
  if (val) restNotice();
};
</script>

<template>
  <el-dropdown
    trigger="click"
    placement="bottom-end"
    ref="dropdownRef"
    @visible-change="dropdownChange"
  >
    <span class="dropdown-badge navbar-bg-hover select-none">
      <el-badge :value="notices" :max="99">
        <span class="header-notice-icon">
          <i-ep-bell />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-empty
          v-if="noticeNum == 0"
          description="暂无消息"
          :image-size="100"
          class="w-[300px]"
        />
        <span v-else>
          <el-scrollbar max-height="330px">
            <ul
              class="noticeList-container"
              v-infinite-scroll="load"
              :infinite-scroll-disabled="noticeDisabled"
              :infinite-scroll-immediate="false"
              v-if="noticeList.length > 0"
            >
              <li
                class="new-item"
                v-for="(item, index) in noticeList"
                :key="index"
                @click="handleClickItem(item)"
              >
                <!-- <div class="new-item-left"> -->
                <!-- <i class="dot"></i> -->
                <span class="new-item-hint">通知：</span>
                <span class="new-item-msg">{{ item.msg_content }}</span>
                <!-- </div> -->
                <!-- <span class="new-item-time">2023-09-10</span> -->
              </li>
              <p v-if="noticeLoading" class="new-list-hint">加载中...</p>
              <p v-if="noticeNoMore" class="new-list-hint">- 没有更多了 -</p>
            </ul>
          </el-scrollbar>
        </span>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}
.noticeList-container {
  width: 300px;
  padding: 10px 20px 0;
  box-sizing: border-box;
  .new-item {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    font-size: 14px;
    height: 50px;
    border-top: 1px solid #e5e5e5;
    cursor: pointer;
    position: relative;
    &:hover {
      &::before {
        content: "";
        display: block;
        position: absolute;
        left: -10px;
        width: 110%;
        height: 100%;
        background-color: #e5e5e5;
        z-index: -1;
      }
    }
    .new-item-msg {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    &-hint {
      flex-shrink: 0;
    }
    // &:first-of-type {
    //   border-top: none;
    // }
    &:last-of-type {
      border-bottom: 1px solid #e5e5e5;
    }
    &-time {
      color: var(--el-color-info);
    }
  }
  .new-list-hint {
    text-align: center;
    font-size: 14px;
    color: var(--el-color-info);
    height: 40px;
    line-height: 40px;
    // margin-top: 10px;
  }
}
</style>
