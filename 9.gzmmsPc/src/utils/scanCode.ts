import { Ref } from "vue";

// /**
//  *
//  * @param code 扫描的code
//  * @returns 检测是否是纯英文字母和是否有特殊字符
//  */
// function checkCode(code: string) {
//   // let specialRes = /[^a-zA-Z0-9]/.test(code);  //检测是否包含除了英文字母和数字以外的
//   // let specialRes = /[@$;',/\\]/.test(code); //检测包含自定义特殊字符
//   let specialRes = /[@$;',]/.test(code); //检测包含自定义特殊字符
//   let letterRes = /^[a-zA-Z]+$/.test(code); // 检测是否全是英文字母
//   if (specialRes || letterRes) {
//     return true;
//   } else {
//     return false;
//   }
// }

function checkCode(code: string) {
  // let regex = /https:\/\/gzmms.y1b\.cn\/scan\?c=/;
  // if (regex.test(code)) {
  //   return false;
  // } else {
  //   return true;
  // }
  return false;
}

/**
 *
 * @param refCode 接收扫码code值的ref变量
 * @param callback 处理事件的回调函数
 */
export function scanCode(refCode: Ref, callback: () => void) {
  let str = ""; //保存扫描的code
  let keyupLastTime = NaN; //上次时间戳
  let max_time = 160;

  document.onkeydown = (e) => {
    let gap = 0;
    if (keyupLastTime) {
      // 如果上次时间戳存在, 则需要获取当前时间戳 减去 上次时间戳,如果超过30则gap设为0,清空code
      gap = new Date().getTime() - keyupLastTime;
      // console.log("gap", gap);
      if (gap > max_time) {
        gap = 0;
        str = "";
      }
    }
    // 获取当前时间戳
    keyupLastTime = new Date().getTime();
    // console.log("🚀 ~ keyupLastTime:", keyupLastTime)
    // console.log("🚀 ~ gap:", gap)
    // console.log("🚀 ~ e.key:", e.key)

    if (e.key != "Process" && gap < max_time) {
      // if (e.key.trim().length == 1) {
      if (e.key.length == 1) {
        // 输入单个字母或者数字
        str += e.key;
        // console.log("🚀 ~ str:", str)
      } else if (e.key.trim() == "Enter") {
        // console.log("🚀 ~ str:", str)
        if (str.length < 5) return;
        //扫描单号 带有英文字母时, 会有shift使用正则删除
        let code_txt = str.replace(/Shift/gi, "");
        let testRes = checkCode(str);
        console.log("🚀 ~ testRes:", testRes);
        if (testRes) return;
        console.log("🚀 ~ code_txt:", code_txt);
        refCode.value = code_txt;
        callback();
        str = "";
      }

      // else {
      //   console.log("e.key", e.key);
      //   //  console.log("str", str);
      //   if (e.key == "Enter") {
      //     console.log("str", str);
      //     if (str.length < 2) return;
      //     //扫描单号 带有英文字母时, 会有shift使用正则删除
      //     let code_txt = str.replace(/Shift/gi, "");
      //     // console.log("code_txt", code_txt);
      //     refCode.value = code_txt;
      //     callback();
      //     str = "";
      //   }
      // }
    }
  };
}
// console.log("🚀 ~ gap:", gap)
// console.log("🚀 ~ gap:", gap)
// console.log("🚀 ~ gap:", gap)
// console.log("🚀 ~ gap:", gap)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ keyupLastTime:", keyupLastTime)
// console.log("🚀 ~ e.key:", e.key)
// console.log("🚀 ~ e.key:", e.key)
// console.log("🚀 ~ e.key:", e.key)

/**
 *
 * @param refCode 接收扫码code值的ref变量
 * @param callback 处理事件的回调函数
 */

// export function scanCode(refCode: Ref, callback: () => void) {
//   // 监听按键
//   let code = "";
//   let lastTime = NaN; // 最新时间
//   let nextTime = NaN; // 最新时间
//   let lastCode = ""; // 上次按键
//   let nextCode = ""; // 最新按键

//   document.onkeydown = (e) => {
//     nextCode = e.key;
//     // 如果触发了回车事件(扫码结束时间)
//     if (nextCode === "Enter") {
//       if (code.length < 5) return; // 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有效
//       console.log("code", code);
//       //扫描单号 带有英文字母时, 会有shift使用正则删除
//       let code_txt = code.replace(/Shift/gi, "");
//       console.log("code_txt", code_txt);
//       refCode.value = code_txt; // 获取到扫码枪输入的内容，做别的操作
//       callback();
//       code = "";
//       lastCode = "";
//       lastTime = NaN;
//       return;
//     }
//     nextTime = new Date().getTime(); // 记录最新时间
//     if (!lastTime && !lastCode) {
//       // 如果上次时间和上次按键为空
//       code += e.key; // 执行叠加操作
//     }
//     // 如果有上次时间及上次按键
//     if (lastCode && lastTime && nextTime - lastTime > 30) {
//       // 当扫码前有keypress事件时,防止首字缺失
//       code = e.key;
//     } else if (lastCode && lastTime) {
//       code += e.key;
//     }
//     lastCode = nextCode;
//     lastTime = nextTime;
//   };
// }

export function clearScanCode() {
  document.onkeydown = null;
}
