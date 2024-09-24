import { Directive, DirectiveBinding, VNode } from "vue";

/* 
只能数字
<el-input v-inputnum.num v-model="input"></el-input>
*/
/* 
<!-- 只能数字+小数点 -->
<el-input v-inputnum.num_point v-model="input"></el-input>
*/

/* 
 <!-- 只能输入正整数-->
<el-input v-inputnum.intp v-model="input"></el-input>
*/

/* 
 <!-- 小数后面限制2位, 限制4位小数则为 v-inputnum.num_point="4"---常用 -->
<el-input v-inputnum.num_point v-model="input"></el-input>
*/

/* 
 <!-- 只能英文 -->
<el-input v-inputnum.alp v-model="input"></el-input>
*/
type newVnode = VNode & { locking?: boolean };
export const inputnum: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode: newVnode) {
    const input: HTMLInputElement =
      (el.querySelector(".el-input__inner") as HTMLInputElement) ||
      (el.querySelector(".el-textarea__inner") as HTMLInputElement) ||
      (el as HTMLInputElement);
    input.addEventListener("compositionstart", () => {
      vnode.locking = true; //解决中文输入双向绑定失效
    });
    input.addEventListener("compositionend", () => {
      vnode.locking = false; //解决中文输入双向绑定失效
      input.dispatchEvent(new Event("input"));
    });
    //输入监听处理
    input.onkeyup = () => {
      if (vnode.locking) {
        return;
      }
      // v-inputnum.num
      if (binding.modifiers.num) {
        //只能输入数字（开头可以多个0）
        onlyNum(input);
      }
      //v-inputnum.num_point
      else if (binding.modifiers.num_point) {
        //只能输入数字+小数点（可以多个小数点）
        onlyNumPoint(input, binding.value);
      }
      //v-inputnum.float
      else if (binding.modifiers.float) {
        //  浮点数后面限制2位, 限制4位小数则为 v-inputnum.float="4"
        //  <el-input v-inputnum.float=2 v-model="input"></el-input>
        // 小数点后面第一位不能为0;
        //只能输入浮点型（只能一个小数点）
        onlyFloat(input, binding.value);
      }
      //  v-inputnum.int
      else if (binding.modifiers.int) {
        //只能输入整数（0+正整数）（开头不能多个0）
        onlyInt(input);
      }
      //v-inputnum.intp
      else if (binding.modifiers.intp) {
        //只能输入正整数
        onlyIntp(input);
      }
      //v-inputnum.alp
      else if (binding.modifiers.alp) {
        //只能输入字母
        onlyAlp(input);
      }
      //v-inputnum.num_alp
      else if (binding.modifiers.num_alp) {
        //只能输入数字+字母
        onlyNumAlp(input);
      }
      //v-inputnum.arith
      else if (binding.modifiers.arith) {
        //四则运算符+数字
        onlyArith(input);
      }
      input.dispatchEvent(new Event("input"));
    };

    //数字+小数点
    // function onlyNumPoint(input: HTMLInputElement) {
    //   input.value = input.value.replace(/[^\d.]/g, "");
    // }

    // 限制规则，只能输入小数点后三位 数字+小数点
    function onlyNumPoint(input: HTMLInputElement, val: number) {
      input.value = input.value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
      input.value = input.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是字符
      input.value = input.value.replace(/\.{2,}/g, "."); // 只保留第一个.清除多余的
      input.value = input.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      if (val === 3) {
        input.value = input.value.replace(/^(-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入三个小数
      } else if (val === 4) {
        input.value = input.value.replace(/^(-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3"); // 只能输入四个小数
      } else {
        input.value = input.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      }

      if (input.value.indexOf(".") < 0 && input.value !== "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        input.value = parseFloat(input.value).toString();
      }
    }

    //数字
    function onlyNum(input: HTMLInputElement) {
      input.value = input.value.replace(/\D+/g, "");
    }
    //整数(0+正整数)
    function onlyInt(input: HTMLInputElement) {
      let value = input.value;
      value = value.replace(/\D+/g, "");
      input.value = value ? Number(value).toString() : value; //去掉开头多个0
    }

    //正整数
    function onlyIntp(input: HTMLInputElement) {
      if (!/^[1-9][0-9]*$/.test(input.value)) {
        let value = input.value.replace(/\D+/g, "");
        if (value && value.substring(0, 1) === "0") {
          //0开头去除0
          value = value.substring(1);
        }

        input.value = value;
      }
    }

    //浮点型
    // eslint-disable-next-line no-unused-vars
    function onlyFloat(input: HTMLInputElement, n: any) {
      let value = input.value;
      value = value.replace(/[^\d.]/g, "");
      value = value.replace(/^\./g, "");
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      if (n && Number(n) > 0) {
        //限制n位
        var d = new Array(Number(n)).fill(`\\d`).join("");
        // eslint-disable-next-line no-useless-escape
        var reg = new RegExp(`^(\\-)*(\\d+)\\.(${d}).*$`, "ig");
        value = value.replace(reg, "$1$2.$3");
      }
      if (value && value.at(-1) !== ".") {
        value = parseFloat(value).toString(); //去掉开头多个0
      }
      input.value = value;
    }
    //字母
    function onlyAlp(input: HTMLInputElement) {
      input.value = input.value.replace(/[^A-Za-z]/g, "");
    }
    //数字+字母
    function onlyNumAlp(input: HTMLInputElement) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
    }

    //四则运算+-*/()数字
    function onlyArith(input: HTMLInputElement) {
      let value = input.value;
      if (value) {
        input.value = value.split("").reduce((prev, cur) => {
          // eslint-disable-next-line no-useless-escape
          if (/^[\d|\-|\+|\*|\/|\.|\(|\)]+$/.test(cur)) {
            return prev + cur;
          }
          return prev;
        }, "");
      }
    }
  },
};

// input框自动获取焦点
export const focus: Directive = {
  mounted(el: HTMLElement) {
    console.log("el", el);
    const input = el.querySelector(".el-input__inner") as HTMLInputElement;
    input.focus();
  },
};
