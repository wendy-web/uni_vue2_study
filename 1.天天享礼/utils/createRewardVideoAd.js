//激励视频广告
export default function(adUnitId, closeFun, errorFun) {
    return {
        videoAd: null,
        adUnitId: adUnitId,
        videoPlay() {
            // 用户触发广告后，显示激励视频广告
            if (this.videoAd) {
                this.videoAd.show().then(() => {}).catch((err) => {
                    this.videoAd
                        .load()
                        .then(() => {
                            this.videoAd.show();
                        })
                        .catch(err => {
                            wx.showToast({
                                title: this.videoAdErrHandle(err),
                                icon: 'none'
                            });
                        });
                })
            }
        },
        videoAdCreate() {
            // 在页面onLoad回调事件中创建激励视频广告实例
            if (wx.createRewardedVideoAd) {
                this.videoAd = wx.createRewardedVideoAd({
                    adUnitId,
                    multiton: true
                });
                this.videoAd.onError((err) => {
                    uni.showToast({
                        title: this.videoAdErrHandle(err),
                        icon: 'none'
                    });
                });
                // 监听关闭
                this.videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {
                        (typeof closeFun === "function") && closeFun(status);
                    } else {
                        // 播放中途退出，进行提示
                        wx.showToast({ title: '看完才有奖励哦~', icon: 'none' });
                    }
                });
            }
        },
        videoAdDestroy() {
            this.videoAd.destroy();
            this.videoAd = null;
        },
        videoAdErrHandle(err) {
            const errHandle = {
                1000: '后端接口调用失败',
                1001: '参数错误',
                1002: '广告单元无效',
                1003: '内部错误',
                1004: '无合适的广告',
                1005: '广告组件审核中',
                1006: '广告组件被驳回',
                1007: '广告组件被封禁',
                1008: '广告单元已关闭',
            }
            return errHandle[err.errCode] || '视频跑丢了，换种方式继续点亮吧';
        }
    };
}
