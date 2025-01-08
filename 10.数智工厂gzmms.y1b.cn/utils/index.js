import log from '@/utils/log.js';
//微信扫一扫封装
export function wxScan() {
    uni.showLoading()
    return new Promise((resolve, reject) => {
        wx.scanCode({
            scanType: ['barCode', 'qrCode']
        }).then(res => {
            uni.hideLoading()
            let result = res.result || '';
            if (result) {
                result = result.toString(); //转成字符串防止replace报错
                // result = result.replace("http://txcmms.y1b.cn/","")
                resolve(result)
            } else {
                uni.showToast({
                    title: '识别结果为空，请重试',
                    icon: 'none'
                })
            }
        }).catch(err => {
            uni.hideLoading()
            console.log('扫码失败：', err);
            reject(err)
            if (err.errMsg.indexOf("cancel") > -1) return;
            uni.showToast({
                icon: 'none',
                title: '识别失败，请重试~'
            })
        })
    })
}
//转化url地址
export function parseQuery(url = '') {
    let o = {};
    let queryString = url.split('?')[1];
    if (queryString) {
        queryString
            .split('&')
            .forEach(item => {
                let [key, val] = item.split('=');
                val = val ? decodeURI(val) : true;
                //转码无值赋值true
                if (o.hasOwnProperty(key)) {
                    //已有属性转为数组
                    o[key] = [].concat(o[key], val);
                } else {
                    o[key] = val;
                }
            });
    }
    return o;
}

// 缓存时间是否在有效期
export function VALID_CACHE(cacheMaxAge, lastModified) {
    return lastModified + cacheMaxAge * 1000 >= Date.now();
}


/*时间转化*/
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                // support "1548221490638"
                time = parseInt(time);
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/');
            }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        return value.toString().padStart(2, '0');
    });
    return time_str;
}


export function compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push('0');
    }
    while (v2.length < len) {
        v2.push('0');
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }

    return 0;
}




/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}


export function getViewPort() {
    let res = uni.getSystemInfoSync()
    log.addFilterMsg('systeminfo')
    log.info(res)
        //导航栏高度
    let custom = wx.getMenuButtonBoundingClientRect() //胶囊按钮位置信息
    let navBarHeight = (custom.top - res.statusBarHeight) * 2 + custom.height //计算得出导航栏高度

    return {
        navHeight: res.statusBarHeight + navBarHeight,
        windowHeight: res.windowHeight
    }
}


// 驼峰转短横线
export function getKebabCase(str) {
    let newStr = str.replace(/([A-Z])/g, (match, p1, offset, string) => {
        // 一个捕获组捕获全部，所以match等于p1
        return '-' + p1.toLowerCase();
    });
    return newStr
}

// 短横线转驼峰
export function getCamelCase(str) {
    let newStr = str.replace(/(\-([a-z]))/g, (match, p1, p2, offset, string) => {
        // 这里有两个捕获组，第一个捕获组捕获全部并包含了第二个捕获组，所以match等于p1
        return p2.toUpperCase();
    });
    return newStr
}


/** 数组深克隆  */
export function deepCloneArray(arr) {
    return arr.map(item => {
        if (Array.isArray(item)) {
            return deepCloneArray(item);
        } else if (typeof item === 'object' && item !== null) {
            return deepCloneObject(item);
        }
        return item;
    });
}

/** 对象深克隆  */
export function deepCloneObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        acc[key] = Array.isArray(value) ? deepCloneArray(value) : (typeof value === 'object' && value !== null ?
            deepCloneObject(value) : value);
        return acc;
    }, {});
}
