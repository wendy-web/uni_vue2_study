import {
	mapGetters,
	mapMutations,
	mapActions
} from 'vuex';
import {
	parseTime
} from '@/utils';
import {
	setCheckCardVolume
} from '@/utils/auth.js';
import {
	CARDTITLES
} from '@/utils/configJson.js';
import {
	addpush
} from "@/api/homeApi.js"
const winMixin = {
	data() {
		return {
			parmas: null, //劵参数
			isShow: false, //显示隐藏控制
			time: "",
			prizeratetype: 3, //25 26 代表对应活动类型 25周年 26周年 
			CARDTITLES: CARDTITLES,
			expire: ""
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	methods: {
		...mapMutations({
			setCheckCardVolume: 'personal/setCheckCardVolume'
		}),
		...mapActions({
			updateUserMobile: 'login/updateUserMobile',
			getUserInfo: 'login/getUserInfo',
			getCardTopCount: 'personal/getCardTopCount'
		}),
		show(data) {
			let {
				pid,
				pull_qr,
				prizeratetype,
				expire
			} = data;
			this.expire = expire || ""
			this.parmas = {
				pid,
				pull_qr
			};
			this.time = parseTime(new Date())
			this.prizeratetype = prizeratetype;
			this.isShow = true;
			//中奖了更新顶部信息
			this.getCardTopCount();
		},
		close() {
			this.isShow = false;
			this.$emit('closeNotice');
		},
		goCardBag() {
			this.isShow = false;
			wx.requestSubscribeMessage({
				tmplIds: ['2OWPAcsIVmynILZkWX2u5uaZhU7rT6FNHnJgfwV-Eyo'],
				complete: (e) => {
					addpush({
						...e,
						expire: this.expire
					}).then(() => {})
					this.$redirectTo({
						url: '/pages/personal/myCardBag/index'
					});
				}
			})
		},
		exchangeBefore(e) {

			this.updateUserMobile(e).then(res => {
				//开始兑换
				this.exchange();
				//异步更新用户信息
				this.getUserInfo(true);

			});

		},
		exchange() {
			this.$redirectTo({
				url: '/pages/personal/storesCode/index'
			});
			this.isShow = false;
			//深copy
			let parmas = JSON.parse(JSON.stringify(this.parmas));
			//本地缓存一份
			setCheckCardVolume([parmas]);
			this.setCheckCardVolume([parmas]); //当前兑换卷
		}
	}
};


export default winMixin;