export default {
				    // backgroundColor: '#232839',
				    backgroundColor: '#90cccc',
					tooltip: {
						trigger: 'item',
						formatter: '{num|{c}}\n热力值',
                        padding:[5, 10],
						textStyle:{
							color:'#FF0055'
						},
                        borderColor:'#fff'
					},
					rich:{
						num: {
						  fontSize: 10,
						  color: '#FF0055'
						}
					},
					visualMap: {
						min: 0,
						max: 10,
						left: 'left',
                        itemWidth:5,
                        itemHeight:100,
						top: 'bottom',
						left:'5%',
						text: ['高', '低'], // 文本，默认为数值文本
						textStyle:{
							color:'#fff'
						},
						color:['#FF5255','#FFCECE'],
						calculable: false
					},
					series: [{
						type: 'map',
						mapType: 'china',
						zoom:1.25,
						top:'20%',
						label: {
                            show: false,
							color:'#fff'
						},
						emphasis:{//高亮样式
							itemStyle:{
							   areaColor:'#FF0055'
							},
							label:{
								color:'#fff'
							}
						},
                        select:{//选中样式
						   disabled:true
						},
						animation: true,

						data: []

					}]
				}