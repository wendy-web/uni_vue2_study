export default function(program_icon) {
		return {
			"width": "636px",
			"height": "1000px",
			"background": "#f8f8f8",
			"views": [{
					"type": "image",
					"url": "/pages/user/static/team_share_bg.png",
					"css": {
						"width": "636px",
						"height": "1000px",
						"top": "0px",
						"left": "0px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "0",
						"shadow": "",
						"mode": "aspectFill"
					}
				},
				{
					"type": "image",
					"url": program_icon,
					"css": {
						"width": "256px",
						"height": "256px",
						"top": "732px",
						"left": "290px",
						"rotate": "0",
						"borderRadius": "50px",
						"borderWidth": "",
						"borderColor": "0",
						"shadow": "",
						"mode": "scaleToFill"
					}
				}
			]
		}
	}

