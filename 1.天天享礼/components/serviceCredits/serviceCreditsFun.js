import { taskNum } from '@/api/modules/task.js';
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import { mapActions, mapGetters } from 'vuex';
const serviceCredits = {
    data() {
        return {
            exchangeFailedShow: false,
            serviceCreditsShow: false,
            _RewardedVideoAd: null, // 激励视频
            adunit: 'adunit-bc00b5948e4bbd52'
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    onLoad() {
        /*初始化激励视频*/
        this.initRewardedVideoAd();
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        //播放视频拿奖励
        initRewardedVideoAd() {
            this._RewardedVideoAd = createRewardVideoAd(
                this.adunit,
                (status) => {
                    this.$refs.serviceCredits.finishAdPlay();
                }
            );
            this._RewardedVideoAd.videoAdCreate();
        },
        showAdPlayHandle() {
            this._RewardedVideoAd.videoPlay(); // 视频的播放
        },
        // 去赚取牛金豆
        goTaskHandle() {
            taskNum().then(res => {
                this.exchangeFailedShow = false;
                if (res.code == 1) {
                    const {
                        total_times,
                        reward_times,
                        video_times
                    } = res.data;
                    if (total_times > 0) {
                        this.serviceCreditsShow = true;
                        // 次数大于0； 打开赚取牛金豆的弹窗
                        if (video_times == 0) {
                            this.$refs.serviceCredits.setSwiperNum(1);
                        };
                        return;
                    }
                }
                // 跳转到福利中心
                this.$reLaunch('/pages/tabBar/task/index');
            });
        },
        // 关闭赚取牛金豆 并更新用户信息
        closeHandle() {
            this.getUserInfo();
            this.serviceCreditsShow = false;
        },
    },
    onUnload() {
        this._RewardedVideoAd.videoAdDestroy();
    },
}
export default serviceCredits;
