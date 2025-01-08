export default function({
    discountImg,
    rebateMoney,
    price
}) {
    const createObj = {
        width: "904px",
        height: "732px",
        background: "#EF2B20",
        type: 'shareImg',
        "views": [{
                "type": "image",
                "url": "https://file.y1b.cn/store/1-0/24620/667402493ff85.png",
                "css": {
                    "width": "370px",
                    "height": "98px",
                    "top": "27px",
                    "left": "268px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "rect",
                "css": {
                    "background": "#ffffff",
                    "width": "840px",
                    "height": "388px",
                    "top": "146.9999893270719px",
                    "left": "34.000034569181594px",
                    "rotate": "0",
                    "borderRadius": "16px",
                    "shadow": "",
                    "color": "#ffffff"
                }
            },
            {
                "type": "text",
                "text": `${price}`,
                "css": {
                    "color": "#FF6B00",
                    "background": "rgba(0,0,0,0)",
                    "width": "200px",
                    "height": "74.58px",
                    "top": "259.00030951491533px",
                    "left": "612.0002074150896px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "66px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "73.26px",
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
                    "color": "#FF6B00",
                    "background": "rgba(0,0,0,0)",
                    "width": "54.99916083311724px",
                    "height": "36.16px",
                    "top": "290px",
                    "left": "579.0105012531328px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "32px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "35.52px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            },
            {
                "type": "image",
                "url": "https://file.y1b.cn/store/1-0/24620/6673f4ab5da7f.png",
                "css": {
                    "width": "362px",
                    "height": "110px",
                    "top": "348px",
                    "left": "474px",
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
                "text": `赚¥${rebateMoney}`,
                "css": {
                    "color": "#fff",
                    "background": "rgba(0,0,0,0)",
                    "width": "319.0041215106732px",
                    "height": "54.239999999999995px",
                    "top": "381px",
                    "left": "498.01px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "48px",
                    "fontWeight": "normal",
                    "maxLines": "1",
                    "lineHeight": "53.28px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "center"
                }
            },
            {
                "type": "rect",
                "css": {
                    "background": "#FEC281",
                    "width": "840px",
                    "height": "122px",
                    "top": "568px",
                    "left": "32px",
                    "rotate": "0",
                    "borderRadius": "62px",
                    "shadow": "",
                    "color": "#FEC281"
                }
            },
            {
                "type": "text",
                "text": "立即卖货",
                "css": {
                    "color": "#F43039",
                    "background": "rgba(0,0,0,0)",
                    "width": "832.0143807795353px",
                    "height": "72.32px",
                    "top": "591.46px",
                    "left": "36px",
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "64px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "71.04px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "center"
                }
            },
            {
                "type": "image",
                "url": "https://file.y1b.cn/store/1-0/24620/667401cdc542a.png",
                "css": {
                    "width": "108px",
                    "height": "108px",
                    "top": "598px",
                    "left": "594px",
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
                "url": discountImg,
                "css": {
                    "width": "364px",
                    "height": "364px",
                    "top": "158px",
                    "left": "43px",
                    "rotate": "0",
                    "borderRadius": "16px",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "mode": "aspectFill"
                }
            }
        ]
    }
    return createObj;
}
