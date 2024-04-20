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


//激励视频广告
export function RewardedVideoAd(adUnitId, onClose, onError) {

    return {
        videoAd: null,
        adUnitId: adUnitId,
        init() {
            if (wx.createRewardedVideoAd) {
                this.videoAd = wx.createRewardedVideoAd({
                    adUnitId: this.adUnitId
                });
                this.videoAd.onLoad(() => {});
                this.videoAd.onError((err) => {
                    if (this.videoAd) {
                        this.videoAd.destroy(); //销毁实列
                    }
                    if (onError) onError(err);
                });
                this.videoAd.onClose((res) => {
                    let complete = res && res.isEnded;
                    if (onClose) onClose(complete);
                });
            }
        },
        show() {
            this.videoAd.show().catch(() => {
                // 失败重试
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch(err => {
                        console.log('激励视频 广告显示失败');
                    });
            });
        }
    };

}
export function escape2Html(str) {
    var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
        return arrEntities[t]
    })
}
export function checkRichText(str) {
    let result = str.replace(/<(?!img|a|\/a).*?>/gi, '').length
    return result > 0
}
export function formatAmount(num) {
    if (num) {
        //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
        num = num.toString().replace(/\$|\,/g, '');
        //如果num不是数字，则将num置0，并返回
        if ('' == num || isNaN(num)) {
            return 'Not a Number ! ';
        }
        //如果num是负数，则获取她的符号
        var sign = num.indexOf("-") > 0 ? '-' : '';
        //如果存在小数点，则获取数字的小数部分
        var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
        cents = cents.length > 1 ? cents : ''; //注意：这里如果是使用change方法不断的调用，小数是输入不了的
        //获取数字的整数数部分
        num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
        //如果没有小数点，整数部分不能以0开头
        if ('' == cents) {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
        /*
		也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
		字符串长度为0/1/2/3时都不用添加
		字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
	   */
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        }
        //将数据（符号、整数部分、小数部分）整体组合返回
        return (sign + num + cents);
    }
}
export function reduceFun(arg1, arg2, num) {
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    var r1 = 0,
        r2 = 0,
        m
    try { r1 = arg1.toString().split('.')[1].length; } catch (e) {}
    try { r2 = arg2.toString().split(".")[1].length; } catch (e) {}
    m = Math.pow(10, Math.max(r1, r2));
    if (num || num === 0) {
        return ((arg1 * m - arg2 * m) / m).toFixed(num)
    }
    return (arg1 * m - arg2 * m) / m
}
