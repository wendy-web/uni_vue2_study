<template>
	<!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
	<canvas type="2d" class="echarts" :canvas-id="canvasId" :id="canvasId" @touchstart="touchStart"
		@touchmove="touchMove" @touchend="touchEnd" />
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN || MP-TOUTIAO -->
	<canvas class="echarts" :canvas-id="canvasId" :id="canvasId" @touchstart="touchStart" @touchmove="touchMove"
		@touchend="touchEnd" />
	<!-- #endif -->

</template>
<script>
	
	/**
	 * echartsForUniApp echart兼容uni-app
	 * @description echart兼容uni-app
	 * @property {Object} option 图表数据
	 * @property {String} canvasId 画布id
	 * @example <echarts ref="echarts" :option="option" canvasId="echarts"></echarts>
	 */
	import WxCanvas from './wx-canvas.js';
	import * as echarts from './echarts.min.js';	
	
	var chartList = {}
	export default {
		props: {
			canvasId: {
				type: String,
				default: 'echarts'
			},
			option: {
				type: Object,
				default: () => {
					return {}
				}
			},
			mapInit: {
				type: Function,
				default: () => {
					return null
				}
			},
		},
		watch: {
			option(newValue, oldValue) {
				if(newValue.series){
					this.initChart(newValue)
				}
			}
		},
		data() {
			return {
				ctx:null
			}
		},
		
		mounted() {
			// Disable prograssive because drawImage doesn't support DOM as parameter
			// See https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
			echarts.registerPreprocessor(option => {
				if (option && option.series) {
					if (option.series.length > 0) {
						option.series.forEach(series => {
							series.progressive = 0;
						});
					} else if (typeof option.series === 'object') {
						option.series.progressive = 0;
					}
				}
			});

		},

		methods: {
			getCanvasAttr2d() {
				return new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this)
					query
						.select('#' + this.canvasId)
						.fields({
							node: true,
							size: true
						})
						.exec(res => {
							const canvasNode = res[0].node
							this.canvasNode = canvasNode
							const canvasDpr = uni.getSystemInfoSync().pixelRatio
							const canvasWidth = res[0].width
							const canvasHeight = res[0].height
							this.ctx = canvasNode.getContext('2d')
							const canvas = new WxCanvas(this.ctx, this.canvasId, true, canvasNode)
							echarts.setCanvasCreator(() => {
								return canvas
							})
							resolve({
								canvas,
								canvasWidth,
								canvasHeight,
								canvasDpr
							})
						})
				});
			},
			getCanvasAttr() {
				return new Promise((resolve, reject) => {
					this.ctx = uni.createCanvasContext(this.canvasId, this);
					var canvas = new WxCanvas(this.ctx, this.canvasId, false);
					echarts.setCanvasCreator(() => {
						return canvas;
					});
					const canvasDpr = 1
					var query = uni.createSelectorQuery().in(this)
						// #ifndef MP-ALIPAY
						.in(this)
					// #endif
					query.select('#' + this.canvasId).boundingClientRect(res => {
						const canvasWidth = res.width
						const canvasHeight = res.height
						resolve({
							canvas,
							canvasWidth,
							canvasHeight,
							canvasDpr
						})
					}).exec();
				});
			},
			// #ifdef H5
			//H5绘制图表
			initChart(option) {
				this.ctx = uni.createCanvasContext(this.canvasId, this);
				chartList[this.canvasId] = echarts.init(document.getElementById(this.canvasId));
				chartList[this.canvasId].setOption(option?option:this.option);
			},
			//H5生成图片
			canvasToTempFilePath(opt) {
				const base64 = chartList[this.canvasId].getDataURL()
				opt.success && opt.success({tempFilePath:base64})
			},
			// #endif
			// #ifndef H5
			//绘制图表
			async initChart(option) {
				// #ifdef MP-WEIXIN || MP-TOUTIAO 
				const canvasAttr = await this.getCanvasAttr2d();
				// #endif
				// #ifndef MP-WEIXIN || MP-TOUTIAO
				const canvasAttr = await this.getCanvasAttr();
				// #endif
				const {
					canvas,
					canvasWidth,
					canvasHeight,
					canvasDpr
				} = canvasAttr
				
				chartList[this.canvasId] = echarts.init(canvas, null, {
					width: canvasWidth,
					height: canvasHeight,
					devicePixelRatio: canvasDpr // new
				});
				canvas.setChart(chartList[this.canvasId]);
				//如果是地图 特殊處理
				if(this.mapInit){
					this.mapInit(echarts)
				}
				//如果是地图 特殊處理
				chartList[this.canvasId].setOption(option?option:this.option);
			},
			//生成图片
			canvasToTempFilePath(opt) {
				// #ifdef MP-WEIXIN || MP-TOUTIAO
				var query = uni.createSelectorQuery().in(this)
				// #ifndef MP-ALIPAY
					.in(this)
				// #endif
				query.select('#' + this.canvasId).fields({ node: true, size: true }).exec(res => {
					const canvasNode = res[0].node
					opt.canvas = canvasNode
					uni.canvasToTempFilePath(opt, this)
				})
				// #endif
				// #ifndef MP-WEIXIN || MP-TOUTIAO
				if (!opt.canvasId) {
					opt.canvasId = this.canvasId;
				}
				this.ctx.draw(true, () => {
					uni.canvasToTempFilePath(opt, this);
				});
				// #endif
			},
			// #endif
			
			touchStart(e) {
				if (chartList[this.canvasId] && e.touches.length > 0) {
					var touch = e.touches[0];
					var handler = chartList[this.canvasId].getZr().handler;
					handler.dispatch('mousedown', {
						zrX: touch.x,
						zrY: touch.y
					});
					handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					});
					handler.processGesture(wrapTouch(e), 'start');
				}
			},
			touchMove(e) {
				if (chartList[this.canvasId] && e.touches.length > 0) {
					var touch = e.touches[0];
					var handler = chartList[this.canvasId].getZr().handler;
					handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					});
					handler.processGesture(wrapTouch(e), 'change');
				}
			},

			touchEnd(e) {
				if (chartList[this.canvasId]) {
					const touch = e.changedTouches ? e.changedTouches[0] : {};
					var handler = chartList[this.canvasId].getZr().handler;
					handler.dispatch('mouseup', {
						zrX: touch.x,
						zrY: touch.y
					});
					handler.dispatch('click', {
						zrX: touch.x,
						zrY: touch.y
					});
					handler.processGesture(wrapTouch(e), 'end');
				}
			}
		}
	}

	function wrapTouch(event) {
		for (let i = 0; i < event.touches.length; ++i) {
			const touch = event.touches[i];
			touch.offsetX = touch.x;
			touch.offsetY = touch.y;
		}
		return event;
	}
</script>
<style lang="scss" scoped>
	.echarts {
		width: 100%;
		height: 100%;
	}
</style>
