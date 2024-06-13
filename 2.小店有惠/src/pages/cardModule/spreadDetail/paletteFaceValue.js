export default function({
    productImg,
    codeUrl,
    price,
    originalPrice,
    face_value,
    coupon_start_time,
    coupon_end_time,
    goods_name,
    after_pay,
    painterHeight
}) {
    let goodsTitle = after_pay ? `                  ${goods_name}` : goods_name;
    const createObj = {
        width: "640px",
        height: `${painterHeight}px`, // 1080px
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
                "text": "券后",
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "56px",
                    "height": "27.119999999999997px",
                    "top": "676px",
                    "left": "20px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "bold",
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
                "text": "￥",
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "24px",
                    "height": "27.119999999999997px",
                    "top": "678.26px",
                    "left": "70px",
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
                "text": price,
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "116.00003051757814px",
                    "height": "45.199999999999996px",
                    "top": "664px",
                    "left": "88px",
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
                "text": `¥${originalPrice}`,
                "css": {
                    "color": "#aaa",
                    "background": "rgba(0,0,0,0)",
                    "width": "106.00003051757814px",
                    "height": "22.599999999999998px",
                    "top": "678px",
                    "left": "190px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "22.200000000000003px",
                    "textStyle": "fill",
                    "textDecoration": "line-through",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "image",
                "url": "https://file.y1b.cn/store/1-0/24528/66558004b3c29.png",
                "css": {
                    "width": "600px",
                    "height": "98px",
                    "top": "737px",
                    "left": "21px",
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
                "text": "¥",
                "css": {
                    "color": "#fff",
                    "background": "rgba(0,0,0,0)",
                    "width": "16.000030517578125px",
                    "height": "27.119999999999997px",
                    "top": "774px",
                    "left": "39px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "24px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "26.64px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": face_value,
                "css": {
                    "color": "#fff",
                    "background": "rgba(0,0,0,0)",
                    "width": "100px",
                    "height": "45.199999999999996px",
                    "top": "761px",
                    "left": "59px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "40px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "44.400000000000006px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": `${face_value}元优惠券`,
                "css": {
                    "color": "#EF2B20",
                    "background": "rgba(0,0,0,0)",
                    "width": "443.9999694824219px",
                    "height": "31.639999999999997px",
                    "top": "755px",
                    "left": "168px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "28px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "31.080000000000002px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "text",
                "text": `使用期限：${coupon_start_time} - ${coupon_end_time}`,
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": "445.9999694824218px",
                    "height": "22.599999999999998px",
                    "top": "796px",
                    "left": "168.00000000000003px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "20px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "22.200000000000003px",
                    "textStyle": "fill",
                    "textDecoration": "linehrough",
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
                    "top": "1016.9999999999999px",
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
                    "top": "860px",
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
                    "top": "860px",
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
                "top": "860px",
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
    return createObj;
}
