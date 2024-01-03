export default function({avatar_url,nick_name,team_bg,program_icon}) {

		return {

				"width": "314px",

				"height": "354px",

				"background": "#f8f8f8",

				"views": [

					{

						"type": "image",

						"url": team_bg,

						"css": {

							"width": "314px",

							"height": "249px",

							"top": "0px",

							"left": "0px",

							"rotate": "0",

							"borderRadius": "10px",

							"borderWidth": "",

							"borderColor": "#000000",

							"shadow": "",

							"mode": "scaleToFill"

						}

					},
					{

						"type": "image",

						"url": avatar_url,

						"css": {

							"width": "50px",

							"height": "50px",

							"top": "274px",

							"left": "16px",

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

						"text": nick_name,

						"css": {

							"color": "#FF7409",

							"background": "rgba(0,0,0,0)",

							"width": "146.0033129882812px",

							"height": "22.88px",

							"top": "278px",

							"left": "75.57999999999998px",

							"rotate": "0",

							"borderRadius": "",

							"borderWidth": "",

							"borderColor": "#000000",

							"shadow": "",

							"padding": "0px",

							"fontSize": "16px",

							"fontWeight": "normal",

							"maxLines": "1",

							"lineHeight": "23.088000000000005px",

							"textStyle": "fill",

							"textDecoration": "none",

							"fontFamily": "",

							"textAlign": "left"

						}

					},

					{

						"type": "image",

						"url": program_icon,

						"css": {

							"width": "64px",

							"height": "64px",

							"top": "267px",

							"left": "229px",

							"rotate": "0",

							"borderRadius": "32px",

							"borderWidth": "",

							"borderColor": "#000000",

							"shadow": "",

							"mode": "scaleToFill"

						}

					},

					{

						"type": "text",

						"text": "邀请你加入挑战",

						"css": {

							"color": "#000000",

							"background": "rgba(0,0,0,0)",

							"width": "150.25px",

							"height": "20.02px",

							"top": "302.03px",

							"left": "76px",

							"rotate": "0",

							"borderRadius": "",

							"borderWidth": "",

							"borderColor": "#000000",

							"shadow": "",

							"padding": "0px",

							"fontSize": "14px",

							"fontWeight": "normal",

							"maxLines": "1",

							"lineHeight": "20.202000000000005px",

							"textStyle": "fill",

							"textDecoration": "none",

							"fontFamily": "",

							"textAlign": "left"

						}

					}

				]

			}
	}


