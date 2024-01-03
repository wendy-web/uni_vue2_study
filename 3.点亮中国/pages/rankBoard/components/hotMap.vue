<template>

	<view class="wrap">
		<mpvue-echarts :option="option" canvas-id="mychart-area" :mapInit="mapInit" />
	</view>

</template>
<script>
	import {getCoordinates,getAllGeo} from '@/api/modules/home.js'
	import mpvueEcharts from './echarts-uniapp/echarts-uniapp.vue';
	import option from './options.js'
    let CHINAJSON;
	export default {
		data() {
			return {
               option:{}
			}
		},
		components: {
			mpvueEcharts
		},
		mounted() {
			
			// this.initData()
		},
		methods: {
			 initData(){
				let https = [getAllGeo()]
				
				if(!CHINAJSON) https.push(getCoordinates())
				
				Promise.all(https).then(res=>{
					let list = res[0].data.list
					    list.push({name:"南海诸岛",value:0})
					option.series[0].data = list
					option.visualMap.max = res[0].data.max||1
					
					if(res[1]){
						CHINAJSON = res[1].data
					}
					this.option = option
				})
		
			},
			mapInit(echarts) {
				echarts.registerMap('china', CHINAJSON);
			}
		}
	}
</script>


<style  lang="scss">
	.wrap {
		width: 100%;
		height: 430px;
	}
</style>
