<script setup lang="ts">
import { isFunction } from "@pureadmin/utils";
import { computed, ref } from "vue";
import type { ButtonProps, DialogOptions, EventType } from "./index";
import { closeDialog, dialogStore } from "./index";

const fullscreen = ref(false);

const footerButtons = computed(() => {
  return (options: DialogOptions) => {
    if (options?.footerButtons?.length && options?.footerButtons?.length > 0) {
      return options.footerButtons;
    } else {
      let btnArr: Array<ButtonProps> = [];

      let confirmObj = {
        label: options.confirmText ? options.confirmText : "确定",
        type: "primary",
        bg: true,
        class: options.btnClass,
        loading: options.btnLoading,
        size: options.btnSize,
        btnClick: ({ dialog: { options, index } }) => {
          const done = () => closeDialog(options, index, { command: "sure" });
          if (options?.beforeSure && isFunction(options?.beforeSure)) {
            options.beforeSure(done, { options, index });
          } else {
            done();
          }
        },
      } as ButtonProps;

      let cancelObj = {
        label: "取消",
        bg: true,
        class: options.btnClass,
        size: options.btnSize,
        btnClick: ({ dialog: { options, index } }) => {
          const done = () => closeDialog(options, index, { command: "cancel" });
          if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
            options.beforeCancel(done, { options, index });
          } else {
            done();
          }
        },
      } as ButtonProps;

      if (options.showCancel) {
        btnArr.push(cancelObj);
      }
      if (options.showConfirm) {
        btnArr.push(confirmObj);
      }
      return btnArr;

      // if (options.showCancel) {
      //   return [
      //     {
      //       label: "取消",
      //       bg: true,
      //       class: options.btnClass,
      //       btnClick: ({ dialog: { options, index } }) => {
      //         const done = () => closeDialog(options, index, { command: "cancel" });
      //         if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
      //           options.beforeCancel(done, { options, index });
      //         } else {
      //           done();
      //         }
      //       },
      //     },
      //     {
      //       label: options.confirmText ? options.confirmText : "确定",
      //       type: "primary",
      //       bg: true,
      //       class: options.btnClass,
      //       loading: options.btnLoading,
      //       btnClick: ({ dialog: { options, index } }) => {
      //         const done = () => closeDialog(options, index, { command: "sure" });
      //         if (options?.beforeSure && isFunction(options?.beforeSure)) {
      //           options.beforeSure(done, { options, index });
      //         } else {
      //           done();
      //         }
      //       },
      //     },
      //   ] as Array<ButtonProps>;
      // } else {
      //   return [
      //     {
      //       label: options.confirmText ? options.confirmText : "确定",
      //       type: "primary",
      //       bg: true,
      //       class: options.btnClass,
      //       loading: options.btnLoading,
      //       btnClick: ({ dialog: { options, index } }) => {
      //         const done = () => closeDialog(options, index, { command: "sure" });
      //         if (options?.beforeSure && isFunction(options?.beforeSure)) {
      //           options.beforeSure(done, { options, index });
      //         } else {
      //           done();
      //         }
      //       },
      //     },
      //   ] as Array<ButtonProps>;
      // }
    }
  };
});

const fullscreenClass = computed(() => {
  return ["el-icon", "el-dialog__close", "-translate-x-2", "cursor-pointer", "hover:!text-[red]"];
});

function eventsCallBack(
  event: EventType,
  options: DialogOptions,
  index: number,
  isClickFullScreen = false,
) {
  if (!isClickFullScreen) fullscreen.value = options?.fullscreen ?? false;
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]!({ options, index });
  }
}

function handleClose(options: DialogOptions, index: number, args = { command: "close" }) {
  closeDialog(options, index, args);
  eventsCallBack("close", options, index);
}
</script>

<template>
  <div>
    <el-dialog
      v-for="(options, index) in dialogStore"
      :key="index"
      v-bind="options"
      v-model="options.visible"
      class="pure-dialog"
      :fullscreen="fullscreen ? true : options?.fullscreen ? true : false"
      @closed="handleClose(options, index)"
      @opened="eventsCallBack('open', options, index)"
      @open-auto-focus="eventsCallBack('openAutoFocus', options, index)"
      @close-auto-focus="eventsCallBack('closeAutoFocus', options, index)"
    >
      <!-- header -->
      <template
        v-if="options?.fullscreenIcon || options?.headerRenderer"
        #header="{ close, titleId, titleClass }"
      >
        <div v-if="options?.fullscreenIcon" class="flex items-center justify-between">
          <span :id="titleId" :class="titleClass">{{ options?.title }}</span>
          <i
            v-if="!options?.fullscreen"
            :class="fullscreenClass"
            @click="
              () => {
                fullscreen = !fullscreen;
                eventsCallBack('fullscreenCallBack', { ...options, fullscreen }, index, true);
              }
            "
          >
            <SvgIcon
              class="pure-dialog-svg"
              :name="
                options?.fullscreen
                  ? 'exit-fullscreen'
                  : fullscreen
                    ? 'exit-fullscreen'
                    : 'fullscreen'
              "
            ></SvgIcon>
          </i>
        </div>
        <component
          :is="options?.headerRenderer && options?.headerRenderer({ close, titleId, titleClass })"
          v-else
        />
      </template>
      <component
        v-bind="options?.props"
        :is="options.contentRenderer && options.contentRenderer({ options, index })"
        @close="(args: any) => handleClose(options, index, args)"
      />
      <!-- footer -->
      <template v-if="!options?.hideFooter" #footer>
        <template v-if="options?.footerRenderer">
          <component :is="options?.footerRenderer({ options, index })" />
        </template>
        <span v-else>
          <el-button
            v-for="(btn, key) in footerButtons(options)"
            :key="key"
            v-bind="btn"
            @click="
              btn.btnClick({
                dialog: { options, index },
                button: { btn, index: key },
              })
            "
          >
            {{ btn?.label }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
