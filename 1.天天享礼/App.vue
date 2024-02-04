<script>
import { doBind, userPosition } from "@/api/modules/index.js";
import { bfAppid, getAutoLogin, getToken } from '@/utils/auth.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
	computed: {
		...mapGetters([
			'userInfo',
			'gift',
			'diaList',
			'isMiniProgram',
			'isAutoLogin',
			'token',
			'iconFindLightIndex',
			'setAlreadyShowLight'
		])
	},
	methods: {
		...mapActions({
			wxlogin: 'user/wxlogin',
			setConnected: 'app/setConnected',
			profitInfoRequest: 'user/profitInfoRequest'
		}),
		...mapMutations({
			setDiaList: "user/setDiaList",
			delCurrentDiaList: "user/delCurrentDiaList",
			setMiniProgram: "user/setMiniProgram",
			setAutoLogin: 'user/setAutoLogin',
			setIconFindLightIndex: "user/setIconFindLightIndex",
			setLightArr: "user/setLightArr",
			setAlreadyShowLight: "user/setAlreadyShowLight",
		}),
		// 关闭icon的高亮区域
		setIconFindHandle() {
			// 关闭天天过来时高亮展示的样式
			if(this.iconFindLightIndex >= 0) {
				this.setIconFindLightIndex(-1);
				this.delCurrentDiaList('iconFind');
				this.setLightArr(null);
			};
		},
		// 设置展示高亮的存储
		setShowLightHandle() {
			if(!this.isAlreadyShowLight) this.setAlreadyShowLight();
		},
	},
	watch: {
		isAutoLogin: {
			handler:async function (newValue, oldValue) {
				if(!newValue) return;
				this.profitInfoRequest();
			},
			deep: true,
			immediate: true
		}
	},
	onLaunch: function(event) {
		const updateManager = uni.getUpdateManager();
		updateManager.onUpdateReady(function() {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		})
		/**
		 * 初次加载判断网络情况
		 * 无网络状态下根据实际情况进行调整
		 */
		uni.getNetworkType({
			success: (res) => {
				const networkType = res.networkType;
				if (networkType === 'none') {
					this.setConnected(false);
					uni.showToast({
						title: '当前无网络',
						icon: 'loading',
						duration: 2000
					});
					return
				}
				this.setConnected(true);
			}
		});
		/**
		 * 监听网络状态变化
		 * 可根据业务需求进行调整
		 */
		uni.onNetworkStatusChange((res) => {
			if (!res.isConnected) {
				this.setConnected(false);
				uni.showToast({
					title: '网络已断开',
					icon: 'loading',
					duration: 2000
				});
			} else {
				this.setConnected(true);
				uni.hideToast();
			}
		});
		const tokenStorage = getToken();
		const autoLoginStorage = getAutoLogin();
		if(tokenStorage) {
			(autoLoginStorage === '') && this.setAutoLogin(true);
		} else{
			this.setAutoLogin(false)
		}
		if(!autoLoginStorage) {
			const sourceData = uni.getLaunchOptionsSync();
			const { scene, referrerInfo } = sourceData;
			if (!referrerInfo || !referrerInfo.appId) return;
			if (referrerInfo.appId == bfAppid()) {
				this.setAutoLogin(true);
			}
		}
	},
	onShow: function(event) {
		if (!this.isMiniProgram || (this.isMiniProgram && event.query.mlocid)) {
			const { mlocid, plocid } = event.query;
			if(!event.query.key) {
				userPosition({ mlocid, plocid});
			}
		}
		// 彬纷
		if(this.isMiniProgram) this.setMiniProgram(0);
		// 推广位接口的访问
		if(event.query.team_uid) {
			doBind({team_uid : event.query.team_uid});
		}
	},
	onHide: function() {
		this.setIconFindHandle();
		this.setShowLightHandle();
	}
}
</script>
