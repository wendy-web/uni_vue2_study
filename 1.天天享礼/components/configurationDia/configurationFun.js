import { popover, popoverRember } from '@/api/modules/configuration.js';
import { getDiaType } from '@/utils/auth.js';
import goDetailsFun from '@/utils/goDetailsFun.js';
import { parseTime } from '@/utils/index.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
const serviceCredits = {
    mixins: [goDetailsFun],
    data() {
        return {
            isShowConfig: false,
            currentPage: '', // 当前页面的路径
            currentPageNum: 6, // 当前页面的类型page，用于接口获取事件
            pageObj: [{
                    route: 'pages/tabBar/shopMall/index',
                    pageNum: 1,
                    text: '首页'
                },
                {
                    route: 'pages/tabBar/discounts/index',
                    pageNum: 2,
                    text: '惠生活'
                },
                {
                    route: 'pages/tabBar/task/index',
                    pageNum: 3,
                    text: '福利中心'
                },
                {
                    route: 'pages/tabBar/user/index',
                    pageNum: 4,
                    text: '我的'
                },
                {
                    route: 'pages/tabAbout/paySuccess/index',
                    pageNum: 5,
                    text: '支付成功'
                },
                {
                    route: 'pages/userModule/productList/index',
                    pageNum: 6,
                    text: '领券中心'
                },
                {
                    route: 'pages/userModule/allowance/redPacket/index',
                    pageNum: 7,
                    text: '外卖红包'
                },
                {
                    route: 'pages/userModule/allowance/recharge/index',
                    pageNum: 8,
                    text: '大牌直充'
                },
                {
                    route: '',
                    pageNum: 9,
                    text: '扫拉环码异常'
                },
                {
                    route: 'pages/userModule/allowance/specialList/index',
                    pageNum: 10,
                    text: '聚合页'
                },
                {
                    route: '',
                    pageNum: 11,
                    text: '新人扫码未中奖'
                }
            ],
            showList: [],
            config: '',
            diaTimer: null,
            showTimer: null,
            remainTime: 0,
            awardId: 0,
            currentId: 0,
            recommendId: 0,
            isNextPopover: false
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'gift', 'diaList', 'isAutoLogin', 'lightArr'])
    },
    watch: {
        diaList: {
            handler(newValue, oldValue) {
                console.log('监听弹窗diaList', newValue);
                if (newValue.length && newValue[0] == "config") {
                    this.isShowConfig = true;
                    this.delCurrentDiaList('config');
                    this.openMiniTypeHandle(); // 半屏时直接跳出
                }
            },
            immediate: true
        },
        // 高亮icon的展示完 当前页面的再次加载
        lightArr(newValue, oldValue) {
            if ((newValue != oldValue) && !newValue && !this.showList.length) {
                this.psite = null;
                this.configurationInit();
            }
        },
        isShowConfig(newValue, oldValue) {
            // console.log('isShowConfig : 弹窗的监听newValue::', newValue, oldValue);
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
        // this.configurationInit();
        if (options.awardId) {
            this.awardId = options.awardId;
        }
        if (options.recommendId) {
            this.recommendId = options.recommendId;
        }
    },
    onShow() {
        // 首页抽奖的弹窗
        if ((this.awardId || this.recommendId) && this.currentPageNum == 1) return;
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
            setLightArr: "user/setLightArr"
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
        async configurationInit(isBesidesPage = true) {
            // this.psite / this.lsite - 不需要登陆的状态也可访问
            if (!this.isAutoLogin && !this.psite && !this.lsite) return;
            // 显示页面1 - 首页 2 - 惠生活 3 - 福利中心 4 - 我的 5 - 支付成功
            // people_type 1 是新用户 2 是老用户
            // this.gift
            let pageNum = this.currentPageNum;
            if (pageNum == 1 && isBesidesPage) {
                if (this.$refs.cashBackDiaRef) this.$refs.cashBackDiaRef.init(); // 领红包的监听 - 结束后访问当前
                return;
            }
            // codeErrorId - 从彬纷有礼的扫码异常进入； losingNew： 新人未中奖
            this.codeErrorId && (pageNum = 9);
            this.losingNew && (pageNum = 11);
            const params = {
                page: pageNum,
                people_type: this.gift || 2,
            }
            this.psite && (params.psite = this.psite); // 悬浮
            this.lsite && (params.lsite = this.lsite); // 高亮
            const res = await popover(params);
            if (res.code != 1) return;
            const { list, people_type, lightArr } = res.data;
            lightArr && this.setLightArr(lightArr);
            // 扫码异常/新人未中奖 - 进行的
            if ((this.codeErrorId || this.losingNew) && !list.length) {
                this.codeErrorId = null;
                this.losingNew = null;
                this.configurationInit();
            }
            if (this.lsite) this.lsite = null;
            // 访问一次次后进行清除
            if (this.psite && !list.length) {
                this.psite = null;
                if (!lightArr) this.configurationInit();
            }
            this.showList = list;
            const diaType = getDiaType();
            // 高亮的显示 - icon图标
            if (lightArr) this.setDiaList('iconFind');
            if (people_type == 1) {
                diaType && this.showDia();
                return;
            }
            this.showDia();
        },
        showDia() {
            console.log('this.diaList', this.diaList)
            if (!this.showList.length) return;
            this.config = this.showList[0];
            let {
                second,
                popover_start,
                popover_over,
                is_advertisement,
                id
            } = this.config;
            this.currentId = id;
            const currentDate = new Date();
            if (!popover_start) {
                const secondTime = second * 1000;
                this.showTimer = setTimeout(() => {
                    this.remainTime = 60 * 1000;
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
                    this.$refs.configurationDia.resetTime();
                    // 展示倒计时的弹窗
                    if (is_advertisement) {
                        this.interstitialAd.show().catch((err) => {
                            // console.log(err);
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
        requestPopoverRember(item, isAuto = false) {
            // 弹窗添加参数is_popover 不扣取牛金豆的事项
            const id = (item && item.id) || this.currentId;
            if (this.codeErrorId && this.config.image && !isAuto) {
                // 配置半屏 埋点
                this.$wxReportEvent("scantc");
            }
            this.textDetailsFun_mixins({
                ...item,
                configDia: true,
                is_popover: 1,
                isCodeErrorShow: this.codeErrorId && isAuto, // 扫码异常展示推券的事件区分
            });
            this.closeShowConfig(id || this.currentId, false);
        },
        async closeShowConfig(id, nextDia = true, isCloseClick = false) {
            const currentId = id || this.currentId;
            this.getUserInfo();
            this.closeConfigHandle();
            // return;
            // 记录已点击的事件
            await popoverRember({ id: currentId });
            if ((this.showList.length > 1 && nextDia) || this.codeErrorId || this.losingNew || this.psite) {
                if (this.codeErrorId && isCloseClick && this.config.image) {
                    this.$wxReportEvent("closetc");
                }
                this.codeErrorId = null;
                this.losingNew = null;
                this.psite = null;
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
