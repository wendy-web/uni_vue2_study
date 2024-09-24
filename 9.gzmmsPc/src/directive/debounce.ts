import { Directive, DirectiveBinding, VNode } from "vue";

/**
 * 按钮防抖
 */
export const deBounce: Directive = {
  mounted(el: HTMLButtonElement, binding: DirectiveBinding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        // el.classList.add("is-disabled");
        setTimeout(() => {
          el.disabled = false;
          // el.classList.remove("is-disabled");
        }, binding.value || 1000);
      }
    });
  },
};
