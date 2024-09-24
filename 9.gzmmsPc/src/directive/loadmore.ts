import { debounce } from "@pureadmin/utils";
import { DirectiveBinding } from "vue";

type TypeHTMLElement = HTMLElement & { _hanlde: any; _selectDom: any };

export const loadMore = {
  beforeMount(el: TypeHTMLElement, binding: DirectiveBinding) {
    console.log("elelelel", el);
    // 获取滚动容器dom

    const scrollWrap = document.querySelector(
      ".single-select-loadmore .el-select-dropdown__wrap",
    ) as TypeHTMLElement;

    // 把监听的句柄防抖一下
    const handle: any = debounce((e) => {
      let scrollDistance = scrollWrap.scrollHeight - scrollWrap.scrollTop;
      // 比如此处预留6个像素的位置用于触底
      if (scrollWrap.clientHeight + 6 > scrollDistance) {
        binding.value(); // 触底通知一下，外界
      }
    }, 170);
    //
    scrollWrap?.addEventListener("scroll", handle);

    // 将获取到的dom和函数挂载到el-select上，实例销毁时好处理
    el._selectDom = scrollWrap;
    el._hanlde = handle;

    // 绑定监听滚动事件
    scrollWrap?.addEventListener("scroll", handle);
  },
  beforeUnmount(el: TypeHTMLElement) {
    // 解绑
    if (el._hanlde) {
      el._selectDom.removeEventListener("scroll", el._hanlde);
      // 清空
      delete el._selectDom;
      delete el._hanlde;
    }
  },
};
