export default function({
    avatar,
    cityImage,
    name,
    date,
    cityName,
    context,
    closeShowScanImg
}) {
    const closeScanImg = closeShowScanImg || false;
    const config = {
        "width": "604px",
        "height": "724px",
        "background": "#eee",
        "views": [{
                "type": "image",
                "url": cityImage,
                "css": {
                    "width": "604px",
                    "height": "540px",
                    "top": "0px",
                    "left": "0px",
                    "rotate": "0",
                    "borderRadius": "20px",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "text",
                "text": context || "泱泱华夏，每一寸土地都值得热爱",
                "css": {
                    "color": "#4e4d52",
                    "background": "rgba(0,0,0,0)",
                    "width": "573px",
                    "height": "34.32px",
                    "top": "561px",
                    "left": "20px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
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
                "url": avatar,
                "css": {
                    "width": "64px",
                    "height": "64px",
                    "top": "621px",
                    "left": "24px",
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
                "text": name,
                "css": {
                    "color": "#000018",
                    "background": "rgba(0,0,0,0)",
                    "width": "200px",
                    "height": "40.04px",
                    "top": "618px",
                    "left": "103px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
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
                "text": date + "点亮",
                "css": {
                    "color": "#4e4d52",
                    "background": "rgba(0,0,0,0)",
                    "width": "221px",
                    "height": "34.32px",
                    "top": "659.03px",
                    "left": "105px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
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
                "text": cityName,
                "css": {
                    "color": "#017BFF",
                    "background": "rgba(0,0,0,0)",
                    "width": "200px",
                    "height": "34.32px",
                    "top": "659px",
                    "left": "300px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
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
            }
        ]
    }
    if (!closeScanImg) {
        config.views.push({
            "type": "image",
            "url": "https://file.y1b.cn/public/img/dlzg/program_icon_0221.png",
            "css": {
                "width": "112px",
                "height": "112px",
                "top": "591px",
                "left": "454px",
                "rotate": "0",
                "borderRadius": "56px",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
            }
        })
    }
    return config;
}