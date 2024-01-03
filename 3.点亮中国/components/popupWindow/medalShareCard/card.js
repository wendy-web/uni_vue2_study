export default function({ avatar, name, medalIcon, date, province, cityAllNum, rate, next_num, nextTarge }) {
    let config = {
        "width": "604px",
        "height": "802px",
        "background": "#212224",
        "views": [{
                "type": "image",
                "url": "/pages/user/static/medal_share_bg.png",
                "css": {
                    "width": "604px",
                    "height": "802px",
                    "top": "0px",
                    "left": "0px",
                    "rotate": "0",
                    "borderRadius": "0",
                    // "borderRadius": "10px",
                    "borderWidth": "",
                    "borderColor": "",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "image",
                "url": avatar,
                "css": {
                    "width": "96px",
                    "height": "96px",
                    "top": "52px",
                    "left": "32px",
                    "rotate": "0",
                    "borderRadius": "50px",
                    "borderWidth": "2px",
                    "borderColor": "#FFE0B9",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "text",
                "text": name,
                "css": {
                    "color": "#ffffff",
                    "background": "rgba(0,0,0,0)",
                    "width": "395.99999999999994px",
                    "height": "40.04px",
                    "top": "68px",
                    "left": "160.00000000000003px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "28px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "40.40400000000001px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": date + " 获得",
                "css": {
                    "color": "#A3A2A8",
                    "background": "rgba(0,0,0,0)",
                    "width": "200px",
                    "height": "34.32px",
                    "top": "108px",
                    "left": "160px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "image",
                "url": medalIcon,
                "css": {
                    "width": "291px",
                    "height": "291px",
                    "top": "245px",
                    "left": "160px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "text",
                "text": "我已点亮",
                "css": {
                    "color": "#F2F2F2",
                    "background": "rgba(0,0,0,0)",
                    "width": "237px",
                    "height": "34.32px",
                    "top": "644px",
                    "left": "30px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": "【" + province + "】",
                "css": {
                    "color": "#FFDB5B",
                    "background": "rgba(0,0,0,0)",
                    "width": "125px",
                    "height": "34.32px",
                    "top": "644px",
                    "left": "119px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "center"
                }
            },
            {
                "type": "text",
                "text": cityAllNum == 0 ? "勋章" : "全部" + cityAllNum + "座城市",
                "css": {
                    "color": "#F2F2F2",
                    "background": "rgba(0,0,0,0)",
                    "width": "188px",
                    "height": "34.32px",
                    "top": "644px",
                    "left": "236px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": "超越",
                "css": {
                    "color": "#F2F2F2",
                    "background": "rgba(0,0,0,0)",
                    "width": "53.99999999999999px",
                    "height": "34.32px",
                    "top": "686px",
                    "left": "30.000000000000004px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": next_num || rate,
                "css": {
                    "color": "#FFD747",
                    "background": "rgba(0,0,0,0)",
                    "width": "75px",
                    "height": "34.32px",
                    "top": "686px",
                    "left": "79px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "center"
                }
            },
            {
                "type": "text",
                "text": "的" + province + "用户",
                "css": {
                    "color": "#F2f2f2",
                    "background": "rgba(0,0,0,0)",
                    "width": "257px",
                    "height": "34.32px",
                    "top": "686px",
                    "left": "155px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": nextTarge,
                "css": {
                    "color": "#3BB1FF",
                    "background": "rgba(0,0,0,0)",
                    "width": "106px",
                    "height": "34.32px",
                    "top": "738px",
                    "left": "177px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#ffffff",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "34.632000000000005px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            // {
            // 	"type": "text",
            // 	"text": "下一个目标：",
            // 	"css": {
            // 		"color": "#FFffff",
            // 		"background": "rgba(0,0,0,0)",
            // 		"width": "155.00000000000003px",
            // 		"height": "34.32px",
            // 		"top": "738px",
            // 		"left": "30px",
            // 		"rotate": "0",
            // 		"borderRadius": "",
            // 		"borderWidth": "",
            // 		"borderColor": "#ffffff",
            // 		"shadow": "",
            // 		"padding": "0px",
            // 		"fontSize": "24px",
            // 		"fontWeight": "normal",
            // 		"maxLines": "1",
            // 		"lineHeight": "34.632000000000005px",
            // 		"textStyle": "fill",
            // 		"textDecoration": "none",
            // 		"fontFamily": "",
            // 		"textAlign": "left"
            // 	}
            // },
            {
                "type": "image",
                "url": "https://file.y1b.cn/public/img/dlzg/program_icon_0221.png",
                "css": {
                    "width": "120px",
                    "height": "120px",
                    "top": "650px",
                    "left": "456px",
                    "rotate": "0",
                    "borderRadius": "60px",
                    "borderWidth": "",
                    "borderColor": "",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            }
        ]
    };

    if (nextTarge) {
        config.views.push({
            "type": "text",
            "text": "下一个目标：",
            "css": {
                "color": "#FFffff",
                "background": "rgba(0,0,0,0)",
                "width": "155.00000000000003px",
                "height": "34.32px",
                "top": "738px",
                "left": "30px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#ffffff",
                "shadow": "",
                "padding": "0px",
                "fontSize": "24px",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "34.632000000000005px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
            }
        })
    }

    return config
}