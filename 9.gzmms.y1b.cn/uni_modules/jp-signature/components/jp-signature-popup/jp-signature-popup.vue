<template>
	<div class="signature">
		<div class="inputs" v-if="!popup">
			<div class="label" :class="required?'labelqr':''">{{label}}</div>
			<div>
				<div v-if="value" class="images">
					<image @tap="toImg"  class="images" mode="aspectFit" :src="value"></image>
					<view v-if="!readonly" @click="toDeleteImg" class="icons">
						<view class="Deletes">×</view>
					</view>
				</div>
				<div v-if="!value && !readonly" class="explain" @click="toPop">
					{{placeholder?placeholder:'点击签名'}}
				</div>
			</div>
		</div>
		<view class="bottomPopup" v-if="showPopup" @touchmove.stop.prevent="moveHandle">
				<transition name="slide-up" appear>
					<view class="popup-content">
						<view class="popup">
							<div class="hader" v-if="!isHeight">
								<div @click="toclear">取消</div>
								<div class="text">{{label}}</div>
								<div @click="isEmpty">确定</div>
							</div>
							<div :class="isHeight?'wgSignatureq':'wgSignature'">
								<div v-if="isHeight" key="999" style="width: 750rpx ;height: 100vh;">
									<jp-signature  :beforeDelay="200" landscape disableScroll ref="signatureRef" :openSmooth="openSmooth" :penSize="6" :bounding-box="boundingBox"></jp-signature>
								</div>
								<div v-else key="888" style="width: 750rpx ;height: 35vh;">
									<jp-signature :beforeDelay="200" disableScroll ref="signatureRef" :openSmooth="openSmooth" :bounding-box="boundingBox"  :penSize="3"></jp-signature>
								</div>
								  <div v-if="!isHeight" class="appBut" >
									  <div class="buts" @click="undo" >撤销</div>
									  <div class="buts" @click="deleteImg" >清除</div>
									  <div class="buts" style="background-color: #55aaff;color: #fff;" @click="Tomagnify" >全屏</div>
								  </div>
								  <div v-else class="appBut" style="height: 80px;">
									  <div class="butx" @click="undo" >撤销</div>
									  <div class="butx" @click="deleteImg">清除</div>
									  <div class="butx" style="background-color: #55aaff;color: #fff;" @click="Tomagnify" >小屏</div>
									  <div class="butx" @click="toclear">取消</div>
									  <div class="butx" style="background-color: #E59C36;color: #fff;"  @click="isEmpty">完成</div>
								  </div>
							</div>
						</view>
					</view>
				</transition>
			</view>
		
	</div>
</template>
<!-- 有项目需要开发的请联系 扣 - 371524845 -->
<script>
	/**
	 * 手写签名组件
	 * 用于手写签名（弹框签名支持小屏和全屏）
	 *
	 *********参数********
	 * label        选项名称
	 * value        初始值String（支持bas64，url 等图片显示）
	 * required     是否显示必填
	 * placeholder  默认值
	 * readonly     是否只读
	 *
	 * *********回调********
	 * @input(e)   点击确认   e生成的图片数据(bas64)
	 *
	 *********方法********
	 * isEmpty()     生成图片
	 * deleteImg()   删除图片
	 */
	export default {
		props: {
			popup: {
				type: [Boolean, String],
				default: false,
			},
			label: {
				type: String,
				default: '手写签名',
			},
			value: {
				type: String,
				default: '',
			},
			required: {
				type: [Boolean, String],
				default: false,
			},
			placeholder: {
				type: String,
				default: '点击签名',
			},
			readonly: {
				type: [Boolean, String],
				default: false,
			},
			openSmooth: {
				type: [Boolean, String],
				default: true,
			},
			boundingBox: {
				type: [Boolean, String],
				default: true,
			},
		},
		data() {
			return {
				showPopup: false,
				isHeight: false,
				height1: uni.getSystemInfoSync().windowWidth / 2,
				width: uni.getSystemInfoSync().windowWidth, //实时屏幕宽度
				height: uni.getSystemInfoSync().windowHeight, //实时屏幕高度
				showPicker: false
			}
		},
		methods: {
			moveHandle(){
				
			},
			toImg(){
				this.$emit('toImg',this.value)
			},
			undo() {
				this.$refs.signatureRef.undo()
			},
			toPop() {
				this.showPopup = true
			},
			toDeleteImg() {
				// #ifndef VUE3
				this.$emit('input','')
				// #endif
				// #ifdef VUE3
				this.$emit('update:value','')
				// #endif
			},
			toclear() {
				this.isHeight = false
				this.showPopup = false
			},
			close() {
				this.isHeight = false
				this.showPopup = false
				this.$refs.signatureRef.clear()
			},
			deleteImg() {
				this.$refs.signatureRef.clear()
			},
			toDataURL(url) {
				// #ifndef VUE3
				this.$emit('input',url)
				// #endif
				// #ifdef VUE3
				this.$emit('update:value',url)
				// #endif
				this.showPicker = false
			},
			Tomagnify() {
				this.isHeight = !this.isHeight
				this.$refs.signatureRef.clear()
			},
			isEmpty() {
				this.$refs.signatureRef.canvasToTempFilePath({
					quality: 0.8,
					success: (res) => {
						if (this.required) {
							if (!res.isEmpty) {
								// #ifndef VUE3
								this.$emit('input', res.tempFilePath)
								// #endif
								// #ifdef VUE3
								this.$emit('update:value',res.tempFilePath)
								// #endif
								this.$emit('change', res.tempFilePath)
								this.isHeight = false
								this.showPopup = false
							} else {
								uni.showToast({
									title: '请先签名',
									icon: 'none'
								});
							}
						} else {
							// #ifndef VUE3
							this.$emit('input', res.tempFilePath)
							// #endif
							// #ifdef VUE3
							this.$emit('update:value',res.tempFilePath)
							// #endif
							this.$emit('change', res.tempFilePath)
							this.isHeight = false
							this.showPopup = false
						}

					}
				})
			},
		},
		beforeCreate() {},
		created() {}
	}
</script>

<style scoped lang="scss">
	.wgSignatureq{
		
	}
	.appBut{
		display: flex;justify-content: flex-start;align-items: center;text-align: center;height: 50px;line-height: 35px;
	 .buts{
		 color: #333;flex: 1;margin: 0 15px;background-color: #ccc;border-radius: 5px;height: 35px;
	  }
	  .butx{
		  color: #333;flex: 1;margin: 0 5px;background-color: #ccc;border-radius: 5px;height: 35px;
		  transform: rotate(90deg);
	  }
	}
	
	.bottomPopup {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.5);

		.popup-content {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			// top: 0;
			background-color: #ffffff;
		}

		.slide-up-enter-active,
		.slide-up-leave-active {
			transition: all .3s ease;
		}

		.slide-up-enter,
		.slide-up-leave-to {
			transform: translateY(100%);
		}
	}

	.signature {
		.inputs {
			background-color: #fff;
			padding: 10px 16px;

			.label {
				line-height: 35px;
				position: relative;
			}

			.labelqr:before {
				content: "*";
				color: #f00;
			}

			.explain {
				width: 100%;
				background-color: #f1f1f1;
				text-align: center;
				line-height: 40px;
				border: 1px dotted #ccc;
				color: #999;
			}

			.Deletes {
				border: 1px solid #f00;
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				color: #f00;
				text-align: center;
				font-size: 30rpx;
				line-height: 30rpx;
			}
		}

		.images {
			width: 300rpx;
			height: 150rpx;
			position: relative;

			.icons {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}

	.popup {
		background-color: #fff;
	}

	.hader {
		display: flex;
		justify-content: center;
		text-align: center;
		height: 45px;
		border-bottom: 1px solid #f5f5f5;
		align-items: center;

		div {
			text-align: center;
			width: 80px;
			color: #E59C36;
		}

		.text {
			color: #333;
			flex: 1;
		}
	}
  
  
</style>