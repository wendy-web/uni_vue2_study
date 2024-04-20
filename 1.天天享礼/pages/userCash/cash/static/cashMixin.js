import { getProfit } from '@/api/modules/cash.js';
import { mapGetters } from "vuex";
const shareMixin = {
    data() {
        return {
            remainTime: 0,
            timeData: null,
            isShowStatus1: false,
            isShowStatus3: false,
            isShowStatus5: false,
            isShowStatusAni: false,
            isShowGetMoney: false
        }
    },
    computed: {
        ...mapGetters(['enterPageStatus', 'enterArr']),
    },
    watch: {
        'enterArr.over_time': {
            handler: async function(newValue) {
                if (!newValue) return;
                const cur_date = new Date().getTime();
                const over_time = new Date(newValue.replace(new RegExp(/-/gm), '/')).getTime(); // 开始时间戳
                this.remainTime = over_time - cur_date;
            },
            deep: true,
            immediate: true
        },
        // 进入状态的监听
        enterPageStatus: {
            handler: function(newValue) {
                switch (newValue) {
                    case 1:
                        this.$emit('closeElseDia');
                        this.isShowStatus1 = true;
                        this.isShowStatusAni = true;
                        setTimeout(() => {
                            this.isShowStatusAni = false;
                            setTimeout(() => this.isShowStatus1 = false, 1000);
                        }, 7500);
                        break;
                    case 2:
                        break;
                    case 3:
                        this.$emit('closeElseDia');
                        this.isShowStatus3 = true;
                        break;
                    case 4:
                        break;
                    case 5:
                        this.$emit('closeElseDia');
                        this.isShowStatus5 = true;
                        break;
                    case 6:
                        break;
                }
            },
            immediate: false
        }
    },
    onLoad() {},
    methods: {
        initData() {

        },
        closeHandle(isCloseClick = false) {
            this.isShowStatus1 = false
            this.isShowStatus3 = false;
            this.isShowStatus5 = false;
            this.$emit('close', isCloseClick);
        },
        async getProfitHandle(isCloseClick = false) {
            // status: 1放弃翻倍；2 去翻倍
            const res = await getProfit({ cz_type: 2 });
            if (res.code != 1) this.$toast(res.msg);
            this.closeHandle(isCloseClick);
        },
        // 翻倍事件
        async getProfitMoneyHandle() {
            const res = await getProfit({ cz_type: 1 });
            if (res.code != 1) this.$toast(res.msg);
            this.isShowGetMoney = true;
        },
        goToWithdrawHandle() {
            this.$go('/pages/userCard/withdraw/index');
            this.closeHandle();
        },
        // 倒计时结束
        countFinished() {},
        onChangeHandle(event) {
            // return;
            let {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            } = event.detail;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            days = days < 10 ? '0' + days : days;
            milliseconds = Math.floor(milliseconds / 10);
            this.timeData = {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            }
        }
    },
}
export default shareMixin;
