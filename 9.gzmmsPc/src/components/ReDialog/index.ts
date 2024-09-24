import { ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { withInstall } from "@pureadmin/utils";
import reDialog from "./index.vue";
import type {
  ArgsType,
  ButtonProps,
  DialogOptions,
  DialogProps,
  EventType,
} from "./type";

const dialogStore = ref<Array<DialogOptions>>([]);

/** 打开弹框 */
function addDialog(options: DialogOptions) {
  options.showCancel = options.showCancel ?? true;
  options.showConfirm = options.showConfirm ?? true;
  const open = () =>
    dialogStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
}

/** 关闭弹框 */
function closeDialog(options: DialogOptions, index: number, args?: any) {
  dialogStore.value[index].visible = false;
  options.closeCallBack && options.closeCallBack({ options, index, args });
  useTimeoutFn(() => {
    dialogStore.value.splice(index, 1);
  }, 200);
}

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
function updateDialog(value: any, key = "title", index = 0) {
  dialogStore.value[index][key as keyof DialogOptions] = value;
}

/** 关闭所有弹框 */
function closeAllDialog() {
  dialogStore.value = [];
}


const ReDialog = withInstall(reDialog);

export type { EventType, ArgsType, DialogProps, ButtonProps, DialogOptions };
export {
  ReDialog,
  dialogStore,
  addDialog,
  closeDialog,
  updateDialog,
  closeAllDialog,
};
