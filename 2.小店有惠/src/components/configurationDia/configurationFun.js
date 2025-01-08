import { popover, popoverRember } from '@/api/modules/configuration.js';
// import { getDiaType } from '@/utils/auth.js';
import goDetailsFun from '@/utils/goDetailsFun.js';
import { parseTime } from '@/utils/index.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
const serviceCredits = {
    mixins: [goDetailsFun],
    data() {
        return {
            isShowConfig: false,
            currentPage: '', // 当前页面的路径
            currentPageNum: 4, // 当前页面的类型page，用于接口获取事件
            pageObj: [{
                    route: 'pages/home/index',
                    pageNum: 1,
                    text: '首页'
                },
                {
                    route: 'pages/mine/index',
                    pageNum: 2,
                    text: '个人中心'
                },
                {
                    route: 'pages/mineModule/myCredit/index',
                    pageNum: 3,
                    text: '赚积分'
                },
                {
                    route: 'pages/card/index',
                    pageNum: 4,
                    text: '赚前中心'
                }
            ],
            showList: [],
            config: '',
            diaTimer: null,
            showTimer: null,
            remainTime: 0,
            currentId: 0,
            recommendId: 0,
            isNextPopover: false
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'gift', 'diaList', 'isAutoLogin'])
    },
    watch: {
        diaList: {
            handler(newValue, oldValue) {
                if (newValue.length && newValue[0] == "config") {
                    this.isShowConfig = true;
                    this.delCurrentDiaList('config');
                    this.openMiniTypeHandle(); // 半屏时直接跳出
                }
            },
            immediate: true
        },
        isShowConfig(newValue, oldValue) {
            // if (!newValue && oldValue) {
            //     this.delCurrentDiaList('config');
            // }
        }
    },
    onLoad(options) {
        const pageList = getCurrentPages();
        const currentPageObj = pageList[pageList.length - 1];
        this.currentPage = currentPageObj.route;
        this.currentPageNum = this.pageObj.find(res => res.route == this.currentPage).pageNum;
        this.configurationInit();
    },
    onShow() {
        this.configurationInit(); // 混入弹窗的方法调用
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        ...mapMutations({
            setGiftInfo: 'user/setGiftInfo',
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        // 扫码异常执行的事件
        openMiniTypeHandle() {
            // 直接打开半屏推券的呈现
            if (this.config.open_mini_type == 2 && this.config.type == 10) {
                this.requestPopoverRember(this.config, true);
            }
        },
        showConfigHandle() {
            if (this.diaList.length) return this.setDiaList('config');
            this.isShowConfig = true;
            this.openMiniTypeHandle(); // 半屏时直接跳出
        },
        closeConfigHandle() {
            this.isShowConfig = false;
            this.delCurrentDiaList();
        },
        // 关闭新人的弹窗
        getHandle() {
            (![1, 4].includes(this.currentPageNum)) && this.showDia(); // 混合模式展示弹窗
        },
        async configurationInit() {
            if (!this.isAutoLogin) return;
            // people_type 1 是新用户 2 是老用户
            // this.gift
            const params = {
                page: this.currentPageNum,
                people_type: this.gift || 2,
            }
            const res = await popover(params);
            if (res.code != 1) return;
            const { list, people_type } = res.data;
            this.showList = list;
            this.showDia();
        },
        showDia() {
            if (!this.showList.length) return;
            this.config = this.showList[0];
            let {
                second,
                popover_start,
                popover_over,
                is_advertisement,
                id,
                headImgArr,
                show_type
            } = this.config;
            this.currentId = id;
            const currentDate = new Date();
            if (!popover_start) {
                const secondTime = second * 1000;
                this.showTimer = setTimeout(() => {
                    this.remainTime = 60 * 1000;
                    if ((show_type == 1) && headImgArr) this.remainTime = 60 * 1000 * 5;
                    this.$refs.configurationDia.resetTime();
                    if (is_advertisement) {
                        this.interstitialAd.show().catch((err) => {
                            this.requestPopoverRember()
                        });
                    } else {
                        this.showConfigHandle();
                    }
                }, secondTime);
                return;
            }
            let cur_date = parseTime(currentDate, "{y}/{m}/{d}");
            popover_start = cur_date + ' ' + popover_start;
            popover_over = cur_date + ' ' + popover_over;
            const timestamp = currentDate.getTime(); // 当前时间戳
            const popover_startStamp = new Date(popover_start).getTime(); // 开始时间戳
            const popover_overStamp = new Date(popover_over).getTime(); // 结束时间戳
            // 还没到指定弹窗的时间
            if (timestamp < popover_startStamp) {
                this.diaTimer = setInterval(() => {
                    this.isTimerShow(popover_startStamp, popover_overStamp, is_advertisement);
                }, 1000);
                return;
            }
            this.isTimerShow(popover_startStamp, popover_overStamp, is_advertisement);
        },
        isTimerShow(popover_startStamp, popover_overStamp, is_advertisement) {
            const currentDate = new Date();
            const timestamp = currentDate.getTime(); // 当前时间戳
            if (timestamp >= popover_startStamp) {
                // 弹窗的时间段内
                const secondTime = this.config.second * 1000;
                this.showTimer = setTimeout(() => {
                    this.remainTime = 60 * 1000;
                    if (this.config.headImgArr && (this.config.show_type == 1)) this.remainTime = 60 * 1000 * 5;
                    this.$refs.configurationDia.resetTime();
                    // 展示倒计时的弹窗
                    if (is_advertisement) {
                        this.interstitialAd.show().catch((err) => {
                            this.requestPopoverRember()
                        });
                    } else {
                        this.showConfigHandle();
                    }

                }, secondTime);
                if (this.diaTimer) {
                    clearInterval(this.diaTimer);
                    this.diaTimer = null;
                }
                return;
            }
        },
        requestPopoverRember(item) {
            const id = (item && item.id) || this.currentId;
            this.closeShowConfig(id || this.currentId, false);
            this.configurationDiaHandle(item);
        },
        async closeShowConfig(id, nextDia = true, isCloseClick = false) {
            const currentId = id || this.currentId;
            this.getUserInfo();
            this.closeConfigHandle();
            // return;
            // 记录已点击的事件
            await popoverRember({ id: currentId });
            if (this.showList.length > 1 && nextDia) {
                setTimeout(() => this.configurationInit(), 3000);
            }
        },
    },
    onUnload() {
        clearInterval(this.diaTimer);
        this.diaTimer = null;
    },
    onHide() {
        clearInterval(this.diaTimer);
        this.diaTimer = null;
        clearTimeout(this.showTimer);
        this.showTimer = null;
    }
}
export default serviceCredits;
