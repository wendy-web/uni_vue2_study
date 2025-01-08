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

//缓存时间是否在有效期
export function VALID_CACHE(cacheMaxAge, lastModified) {
    return lastModified + cacheMaxAge * 1000 >= Date.now();
}

//判断用户Session 是否过期
export function xhCheckSession(isNoSession) {

    return new Promise((resolve, reject) => {

        if (isNoSession) return reject();

        if (!store.getters.token) return reject();

        uni.checkSession({
            success: res => {
                resolve();
            },
            fail: res => {
                reject();
            }
        });

    });

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

export function getTimeInterval(timestamp1, timestamp2) {
    // 将时间戳转换为毫秒值
    const time1 = timestamp1;
    const time2 = timestamp2;
    // 计算时间差（以毫秒为单位）
    const differenceInMilliseconds = Math.abs(time2 - time1);
    // 将毫秒转换为更易读的时间单位
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    // 构建返回的时间间隔字符串
    let result = '';
    if (days > 0) {
        result += `${days} 天 `;
    }
    if (hours % 24 > 0) {
        result += `${hours % 24} 小时 `;
    }
    if (minutes % 60 > 0) {
        result += `${minutes % 60} 分钟 `;
    }
    if (seconds % 60 > 0) {
        result += `${seconds % 60} 秒`;
    }
    return result;
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

export function wrapTouch(event) {
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touch.offsetX = touch.x;
        touch.offsetY = touch.y;
    }
    return event;
}


/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait = 1500, immediate = true) {
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


export function escape2Html(str) {
    var arrEntities = {
        lt: '<',
        gt: '>',
        nbsp: ' ',
        amp: '&',
        quot: '"'
    }
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
        return arrEntities[t]
    })
}
export function checkRichText(str) {
    let result = str.replace(/<(?!img|a|\/a).*?>/gi, '').length
    return result > 0
}

export function getViewPort() {
    let res = uni.getSystemInfoSync();

    //导航栏高度
    let custom = wx.getMenuButtonBoundingClientRect() //胶囊按钮位置信息
    let navBarHeight = (custom.top - res.statusBarHeight) * 2 + custom.height //计算得出导航栏高度

    return {
        navHeight: res.statusBarHeight + navBarHeight,
        windowHeight: res.windowHeight,
        screenWidth: res.screenWidth || 375
    }
}

// 格式化距离
export function formatDistance(distance) {
    if (distance < 1000) {
        return distance.toFixed(0) + 'm';
    }
    return (distance / 1000).toFixed(1) + 'km';
}

// 验证手机号码
export function isPhoneReg(num) {
    const num_reg = /^1[3456789]\d{9}$/;
    if (!num_reg.test(num)) {
        return false;
    }
    return true;
}
// 校验姓名
export function checkName(name) {
    const reg = /^(?!.*?[\u3000-\u303F\u4DC0-\u4DFF\u2800-\u28FF\u3200-\u32FF\u3300-\u33FF\u2700-\u27BF\u2600-\u26FF\uFE10-\uFE1F\uFE30-\uFE4F])[\u4e00-\u9fbb\u2E80-\uFE4F.·]+$/;

    if (!reg.test(name)) {
        return false;
    }

    return true;
}
//判断是否为空对象
export function hasNoEmptyObject(o) {
    if (typeof o === 'object' && Object.keys(o).length > 0) {
        return true
    }
    return false

}
export function logPagePerformance() {
    const performance = wx.getPerformance();
    const observer = performance.createObserver((entryList) => {
        const entries = entryList.getEntries();
        const result = {}
        entries.forEach(entry => {
            result[entry.name] = entry
        });
    });
    observer.observe({ entryTypes: ['navigation', 'render', 'script'] });
}
