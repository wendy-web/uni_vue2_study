const dragMixin = {
	data() {
		return {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			offsetWidth: 0,
			offsetHeight: 0,
			windowWidth: 0,
			windowHeight: 0,
			isMove: true,
			edge: 10
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	mounted: function() {
		const sys = this.$getSystemInfo();

		this.windowWidth = sys.windowWidth;
		this.windowHeight = sys.windowHeight;

		if (sys.windowTop) {
			this.windowHeight += sys.windowTop;
		}
		console.log(sys)

		const query = uni.createSelectorQuery().in(this);
		query.select('#_drag_button').boundingClientRect(data => {
			this.width = data.width;
			this.height = data.height;
			this.offsetWidth = data.width / 2;
			this.offsetHeight = data.height / 2;
			this.left = this.windowWidth - this.width - this.edge;
			this.top = this.windowHeight * 0.6;
		}).exec();
	},
	onPageScroll(e) {
		this.data.scrolltop = e.scrollTop;
	},
	methods: {
		click() {
			this.$go({
				url: `/pages/webview/webview?link=${encodeURIComponent(this.config.url)}`
			});
			this.$emit('btnClick');
			//chatGPT
		},
		touchstart(e) {
			this.$emit('btnTouchstart');
		},
		touchmove(e) {
			// 单指触摸
			if (e.touches.length !== 1) {
				return false;
			}

			this.isMove = true;

			let clienX = e.touches[0].clientX - this.offsetWidth;

			let clientY = e.touches[0].clientY - this.offsetHeight;

			let edgeBottom = this.windowHeight - this.height - this.edge;

			// 上下触及边界
			if (clientY < this.edge) {
				this.top = this.edge;
			} else if (clientY > edgeBottom) {
				this.top = edgeBottom;
			} else {
				this.top = clientY
			}

			// 左右触及边界
			if (clienX < this.edge) {
				this.left = this.edge;
			} else if (clienX > this.windowWidth - this.width - this.edge) {
				this.left = this.windowWidth - this.width - this.edge;
			} else {
				this.left = clienX
			}


		},
		touchend(e) {
			if (this.isDock) {
				let edgeRigth = this.windowWidth - this.width - this.edge;

				if (this.left < this.windowWidth / 2 - this.offsetWidth) {
					this.left = this.edge;
				} else {
					this.left = edgeRigth;
				}

			}

			this.isMove = false;

			this.$emit('btnTouchend');
		},
	}
};


export default dragMixin;