export default {
	options: {
		grid: {
			top: "20",
			left: "45",
			right:"20",
			bottom:"20",
			containLabel:true
			// 其他属性配置
		},
		tooltip: {
			trigger: "axis",
		},
		
		xAxis: {
			axisLine: {
				lineStyle: {
					color: "#ef2b20",
				},
			},
			type: "category",
			data: [],
			axisLabel: {
				// rotate:45,
				interval: 0
			},
			axisPointer:{
				show:true
			}
		},
		yAxis: {
			show: true,
			type: "value",
			axisLine: {
				show: true, // 显示 y 轴实线
				// lineStyle:{
				//   color:"#ef2b20"
				// }
			},
			min:0,
			max:100,
			splitLine:{
				show:true
			}
		},
		series: [
			{
				data: [],
				type: "line",
				areaStyle: {
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: "rgba(239,43,32,0.10)", // 0% 处的颜色
							},
							{
								offset: 1,
								color: "rgba(239,43,32,0.00)", // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
				lineStyle: {
					color: "#ef2b20",
				},
			},
		],
	
	},
	title: {
		text: "暂无数据",
		textStyle: {
			fontSize: 14,
			fontWeight: "normal",
		},
		left: "center",
		top: "45%",
	},
	dataZoom:[
		// {
		// 	type: 'slider',
		// 	show: false,
		// 	start: 90,
		// 	end: 100,
		// 	handleSize: 8
		// },
		{
			type: 'inside',
			start:80,
			end: 100
		}
	],
}
/* 
空数据
// option = {
	  //   grid: {
	  //     top: "20",
	  //     left: "45",
	  //     // 其他属性配置
	  //   },
	  //   title: {
	  //     text: "暂无数据",
	  //     textStyle: {
	  //       fontSize: 14,
	  //       fontWeight: "normal",
	  //     },
	  //     left: "center",
	  //     top: "35%",
	  //   },
	  //   xAxis: {
	  //     axisLabel: {
	  //       show: true, // 显示 x 轴标签
	  //     },
	  //     type: "category",
	  //     data: ["1", 2, 3],
	  //   },
	  //   yAxis: {
	  //     splitLine: {
	  //       show: false,
	  //     },
	  //     axisLabel: {
	  //       show: true, // 显示 y 轴标签
	  //     },
	  //     min: 0,
	  //     max: 1000,
	  //   },
	  // };


*/