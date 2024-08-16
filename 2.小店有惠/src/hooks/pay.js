export function payHooks(api, params) {
    api(params).then((res) => {
        if (res.code == 1) {
            let { jspay_info, order_id } = res.data;
            jspay_info = JSON.parse(jspay_info);
            uni.requestPayment({
                nonceStr: jspay_info.nonceStr,
                package: jspay_info.package,
                paySign: jspay_info.paySign,
                signType: jspay_info.signType,
                timeStamp: jspay_info.timeStamp,
                success: () => {
                    // 跳转支付详情
                    uni.redirectTo({
                        url: "/pages/payStatus/index?order_id=" + order_id,
                    });
                },
                fail: (err) => {
                    if (/cancel/g.test(err.errMsg)) {
                        return uni.showToast({
                            title: "您取消了支付操作",
                            icon: "none",
                        });
                    }
                    //其它提示
                    uni.showModal({
                        title: "温馨提示",
                        content: err.errMsg,
                        showCancel: true,
                    });
                },
            });

            return;
        }
        uni.showToast({
            title: res.msg,
            icon: "none",
        });
    });
}
