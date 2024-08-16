export default function({
    productImg,
    codeUrl,
    price,
    goods_name,
    after_pay,
    painterHeight,
    sale_num,
    lx_type,
}) {

    // 拼接上 - 拼多多的先用后付的标识
    let goodsTitle = after_pay ? `                  ${goods_name}` : goods_name;
    const createObj = {
        width: "640px",
        height: `${painterHeight}px`, // 950px
        background: "#fff",
        views: [{
                "type": "image",
                "url": productImg,
                "css": {
                    "width": "640px",
                    "height": "640px",
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
                "type": "text",
                "text": "￥",
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "24px",
                    "height": "27.119999999999997px",
                    "top": "678.26px",
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
                    "lineHeight": "26.64px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": `${price}`,
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "116.00003051757814px",
                    "height": "45.199999999999996px",
                    "top": "664px",
                    "left": "44px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "40px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "44.400000000000006px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },

            {
                "type": "text",
                "text": "长按识别 领取福利",
                "css": {
                    "color": "#bbb",
                    "background": "rgba(0,0,0,0)",
                    "width": "396px",
                    "height": "31.639999999999997px",
                    "top": "886px",
                    "left": "20px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "28px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "31.080000000000002px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "qrcode",
                "content": codeUrl,
                "css": {
                    "color": "#000000",
                    "background": "#ffffff",
                    "width": "180px",
                    "height": "180px",
                    "top": "730px",
                    "left": "440px",
                    "rotate": "0",
                    "borderRadius": "5px"
                }
            },
            {
                "type": "text",
                "text": goodsTitle,
                "css": {
                    "color": "#333333",
                    "background": "rgba(0,0,0,0)",
                    "width": "396px",
                    "height": "85.952px",
                    "top": "730px",
                    "left": "20px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "32px",
                    "fontWeight": "bold",
                    "maxLines": "2",
                    "lineHeight": "42.624px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            }
        ]
    }
    if (after_pay) {
        createObj.views.push({
            "type": "image",
            "url": "https://file.y1b.cn/store/1-0/2466/6661227faa137.png",
            "css": {
                "width": "144px",
                "height": "36px",
                "top": "730px",
                "left": "20px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
            }
        })
    }
    if (sale_num) {
        createObj.views.push({
            "type": "text",
            "text": `${(lx_type == 2) ? '月售' : '已售'}${sale_num}`,
            "css": {
                "color": "#aaa",
                "width": "180px",
                "height": "22.599999999999998px",
                "top": "678px",
                "left": '440px',
                "fontSize": "24px",
                "fontWeight": "normal",
                "maxLines": "1",
                "lineHeight": "22.200000000000003px",
                "textAlign": "right"
            }
        })
    }
    return createObj;
}
