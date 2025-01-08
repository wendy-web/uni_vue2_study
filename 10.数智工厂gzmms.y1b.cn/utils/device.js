import { uploadUrl, watermarkUploadUrl } from "@/api/http/xhHttp.js";

/**
 * @param {Object} data
 * @explain 根据规则类型返回计划执行时间
 */
export function getRulePlanTime(data) {
    let { executive_rule_type, plan_start_time, plan_end_time } = data;
    return executive_rule_type === 1 ? `${plan_start_time}至${plan_end_time}` : `${plan_start_time}`;
}

/** 点巡检循环周期列表 */
const inspecCycleOptions = [{
        label: "每天",
        value: 0,
    },
    {
        label: "每月",
        value: 1,
    },
    {
        label: "每季",
        value: 2,
    },
    {
        label: "每年",
        value: 3,
    },
];

/** 根据点巡检循环周期类型获取名称 */
export function getInspecCycleName(cycle_type) {
    const findRes = inspecCycleOptions.find((item) => item.value === cycle_type);
    return findRes ? findRes.label : "";
}

// const deviceRegex = /^https:\/\/gzmms\.y1b\.cn\/bjqr\?c=([^&]+)/;
const deviceRegex = /^https:\/\/gzmms\.y1b\.cn\/bjqr\?c=/;
/**
 * 设备扫码封装
 */
export function deviceScan() {
    uni.showLoading()
    return new Promise((resolve, reject) => {
        uni.scanCode({
            scanType: ['barCode', 'qrCode'],
            success: (res) => {
                uni.hideLoading()
                let result = res.result || '';
                if (result) {
                    result = result.toString(); //转成字符串防止replace报错
                    let newStr = result.replace(deviceRegex, '');
                    resolve(newStr)
                } else {
                    uni.showToast({
                        title: '识别结果为空，请重试',
                        icon: 'none'
                    })
                }
            },
            fail: (err) => {
                uni.hideLoading()
                console.log('扫码失败：', err);
                reject(err)
                if (err.errMsg.indexOf("cancel") > -1) return;
                uni.showToast({
                    icon: 'none',
                    title: '识别失败，请重试~'
                })
            }
        })
    })
}


/** 限制规则，只能输入小数点后三位 数字+小数点 */
export function onlyNumPoint(input, val = 2) {
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



export function uploadFilePromise(url, isNeedWatermark = false, location = {}) {
    let token = uni.getStorageSync("token");
    return new Promise((resolve, reject) => {
        const formData = {}
        if (location.latitude && location.longitude) {
            formData.longitude = location.longitude,
                formData.latitude = location.latitude;
        }

        let a = uni.uploadFile({
            url: isNeedWatermark ? watermarkUploadUrl : uploadUrl,
            filePath: url,
            name: "key",
            header: {
                authorization: token,
            },
            formData,
            success: (res) => {
                let result = JSON.parse(res.data);
                resolve(result.data.src);
            },
        });
    });
}