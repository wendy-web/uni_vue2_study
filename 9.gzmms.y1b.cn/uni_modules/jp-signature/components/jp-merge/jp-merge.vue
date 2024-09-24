<template>
	<view class="share">
		<canvas
		    canvas-id="shareCanvas"
		    class="canvas"
		    bindlongpress="saveImg"
		    catchtouchmove="true"
			style="position:fixed;left:500%"
			:style="{height: canvasHeight+'px',width:canvasWidth+'px'}"
		   >
		</canvas>
	</view>
</template>
<!-- 有项目需要开发的请联系 扣 - 371524845 -->
<script>
export default {
	props: {
		canvasHeight: {
			type: Number,
			default: 400,
		},
		canvasWidth: {
			type: Number,
			default: 400,
		},
		width: {
			type: Number,
			default: 80,
		},
		height: {
			type: Number,
			default: 50,
		},
		left: {
			type: Number,
			default: 300,
		},
		top: {
			type: Number,
			default: 320,
		},
		bgImage: {
			type: String,
			default: '',
		},
	},
	data(){
		return {
			ctx:null
		}
	},
	created() {
	//初始化画布
	  this.ctx = wx.createCanvasContext('shareCanvas',this)
    },
	methods:{
		//获取图片的基本信息，即将网络图片转成本地图片，
		getImageInfo(src) {
			return new Promise((resolve, reject) => {
				wx.getImageInfo({
					src,
					success: (res) => resolve(res),
					fail: (res) => reject(res)
				})
			});
		},
		exportPost(image2){
			let that  =  this
		   return new Promise(function (resolve, reject) {
			let image =  that.bgImage
			//获取系统的基本信息，为后期的画布和底图适配宽高
			 uni.getSystemInfo({
				success: function (res) {
				Promise.all([that.getImageInfo(image),that.getImageInfo(image2)]).then(res=>{
		        //获取底图和二维码图片的基本信息,通常前端导出的二维码是base64格式的，所以要转成图片格式的才可以获取图片的基本信息			
				that.ctx.drawImage(res[0].path,0 , 0,that.canvasWidth,that.canvasHeight);
				that.ctx.drawImage(res[1].path,that.left,that.top,that.width, that.height);
					  that.ctx.draw(false,function(){
						  wx.canvasToTempFilePath({
							  x: 0,
							  y: 0,
							  width:that.canvasWidth,
							  height:that.canvasHeight,
							  destWidth:that.canvasWidth*2,//这里乘以2是为了保证合成图片的清晰度
							  destHeight:that.canvasHeight*2,
							  canvasId: 'shareCanvas',
							  fileType:'jpg',//设置导出图片的后缀名
							  success: function (res) {
								  resolve(res.tempFilePath)
							  },
							  fail: function (res) {
								  reject(res)
							  },
						  })   
					  });
					})     
				}
			})
		   })
		},
	},
}
</script>
