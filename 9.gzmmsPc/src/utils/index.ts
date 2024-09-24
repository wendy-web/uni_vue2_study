/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

export function mix(color1: string, color2: string, weight: number) {
  weight = Math.max(Math.min(Number(weight), 1), 0);
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  const rStr = ("0" + (r || 0).toString(16)).slice(-2);
  const gStr = ("0" + (g || 0).toString(16)).slice(-2);
  const bStr = ("0" + (b || 0).toString(16)).slice(-2);
  return "#" + rStr + gStr + bStr;
}

/** 限制规则，只能输入小数点后几位以及开头可以输入负号 数字+小数点,第二个val可不传,默认是四位,可以2位或者3位 */
export function onlyMinusNumPoint(input: any, val: number = 4) {
  // 清除除了数字和"."之外的字符
  input = input.replace(/[^-\d.]/g, "");
  // 保留第一个出现的点，清除多余的
  input = input.replace(/\.{2,}/g, ".");

  // 如果输入以负号开始，保留负号；否则清除中间或末尾的负号
  if (!input.startsWith("-")) {
    input = input.replace(/-/g, ""); // 移除所有负号
  }

  // 根据参数限制小数点后的位数
  if (val === 3) {
    input = input.replace(/^(\-)*(\d+)\.(\d{1,3})(.*)$/, "$1$2.$3");
  } else if (val === 4) {
    input = input.replace(/^(\-)*(\d+)\.(\d{1,4})(.*)$/, "$1$2.$3");
  } else if (val === 2) {
    input = input.replace(/^(\-)*(\d+)\.(\d{1,2})(.*)$/, "$1$2.$3");
  }

  return input;
}

/** 限制规则，只能输入小数点后几位 数字+小数点,val不传是两位,可以3位或者4位 */
export function onlyNumPoint(input: any, val?: number) {
  input = input.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
  input = input.replace(/^\./g, ""); // 验证第一个字符是数字而不是字符
  input = input.replace(/\.{2,}/g, "."); // 只保留第一个.清除多余的
  input = input.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  if (val === 3) {
    input = input.replace(/^(-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入三个小数
  } else if (val === 4) {
    input = input.replace(/^(-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3"); // 只能输入四个小数
  } else {
    input = input.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
  }

  if (input.indexOf(".") < 0 && input !== "") {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    input = parseFloat(input).toString();
  }
  return input;
}

/** 只能输入正整数 */
export function onlyIntp(input: any) {
  if (!/^[1-9][0-9]*$/.test(input)) {
    let value = input.replace(/\D+/g, "");
    if (value && value.substring(0, 1) === "0") {
      //0开头去除0
      value = value.substring(1);
    }

    input = value;
  }
  return input;
}

/** 数字+字母 */
export function onlyNumAlp(input: any) {
  input = input.replace(/[^A-Za-z0-9]/g, "");
  return input;
}

/** 整数(0+正整数) */
export function onlyInt(input: any) {
  let value = input;
  value = value.replace(/\D+/g, "");
  input = value ? Number(value).toString() : value; //去掉开头多个0
  return input;
}

export function flitterData(arr: any, key: any) {
  let spanOneArr: any = [];
  let concatOne = 0;
  arr.forEach((item: any, index: number) => {
    if (index === 0) {
      spanOneArr.push(1);
    } else {
      //name 修改
      if (item[key] === arr[index - 1][key]) {
        //第一列需合并相同内容的判断条件

        spanOneArr[concatOne] += 1;
        spanOneArr.push(0);
      } else {
        spanOneArr.push(1);
        concatOne = index;
      }
    }
  });
  return {
    one: spanOneArr,
  };
}

/** 去除字符串中的短横线 */
export function removeDashes(str: string) {
  // 正则表达式，匹配所有的短横线
  const regex = /-/g;
  // 使用replace方法替换所有匹配到的短横线为空字符串
  return str.replace(regex, "");
}

/** 判断是否是true或者undefined, 是则true, 否则false */
export function isTrueOrUnDef(val: boolean | undefined) {
  if (val === undefined || val === true) {
    return true;
  } else {
    return false;
  }
}

/** 判断是否是true或者undefined, 是则返回text-blue-500类名,否则text-orange-500类名 */
export function getBlueOrOrange(val: boolean | undefined) {
  return isTrueOrUnDef(val) ? "text-blue-500" : "text-orange-500";
}
