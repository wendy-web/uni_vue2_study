export default function({image,name,time,cert_content}) {
		return {
			"width": "626px",
			"height": "870px",
			"background": "#f8f8f8",
			"views": [
				{
					"type": "image",
					"url": "https://file.y1b.cn/public/img/dlzg/honor_bg0224.png",
					"css": {
						"width": "626px",
						"height": "870px",
						"top": "0px",
						"left": "0px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"mode": "scaleToFill"
					}
				},
				{
					"type": "image",
					"url": image,//头像
					"css": {
						"width": "65px",
						"height": "65px",
						"top": "290px",
						"left": "184px",
						"rotate": "0",
						"borderRadius": "50px",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"mode": "scaleToFill"
					}
				},
				{
					"type": "text",
					"text": cert_content[1],
					"css": {
						"color": "#FF6F00",
						"background": "rgba(0,0,0,0)",
						"width": "502.9999999999999px",
						"height": "35.74999999999999px",
						"top": "425px",
						"left": "61px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "25px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "36.07500000000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				},
				{
					"type": "text",
					"text": cert_content[2],
					"css": {
						"color": "#6B3813",
						"background": "rgba(0,0,0,0)",
						"width": "503px",
						"height": "35.74999999999999px",
						"top": "476px",
						"left": "61px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "25px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "36.07500000000001px",
						"textStyle": "fill",
						"textDecoration": "center",
						"fontFamily": "",
						"textAlign": "center"
					}
				},
				{
					"type": "text",
					"text": cert_content[0],
					"css": {
						"color": "#6B3813",
						"background": "rgba(0,0,0,0)",
						"width": "500.99999999999994px",
						"height": "35.74999999999999px",
						"top": "373px",
						"left": "63.00000000000003px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "25px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "36.07500000000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				},
				{
					"type": "text",
					"text": name,
					"css": {
						"color": "#000000",
						"background": "rgba(0,0,0,0)",
						"width": "281px",
						"height": "37.18000000000001px",
						"top": "304px",
						"left": "270px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "26px",
						"fontWeight": "bold",
						"maxLines": "1",
						"lineHeight": "37.51800000000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": cert_content[3],
					"css": {
						"color": "#6B3813",
						"background": "rgba(0,0,0,0)",
						"width": "502px",
						"height": "35.74999999999999px",
						"top": "523px",
						"left": "61px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "25px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "36.07500000000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				},
				{
					"type": "text",
					"text": "特颁此证",
					"css": {
						"color": "#6B3813",
						"background": "rgba(0,0,0,0)",
						"width": "501px",
						"height": "35.74999999999999px",
						"top": "618px",
						"left": "62px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "25px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "36.07500000000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				}
			]
		}
	}