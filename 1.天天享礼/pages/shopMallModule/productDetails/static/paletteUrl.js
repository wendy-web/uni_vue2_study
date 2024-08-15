export default function({
    firstImg,
    face_value,
    price
}) {
    const shopImg = face_value ? 'https://file.y1b.cn/store/1-0/24712/6690908640b12.png' : 'https://file.y1b.cn/store/1-0/24712/6690a53a7af4a.png'
    const createObj = {
        "width": "904px",
        "height": "732px",
        "background": "#F84842",
        views: [{
                "type": "image",
                "url": shopImg,
                "css": {
                    "width": "904px",
                    "height": "732px",
                    "top": "0px",
                    "left": "0px",
                    "rotate": "0",
                    "borderRadius": "12px",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "mode": "scaleToFill"
                }
            },
            {
                "type": "image",
                "url": firstImg,
                "css": {
                    "width": "432px",
                    "height": "432px",
                    "top": "242px",
                    "left": "56px",
                    "borderRadius": "12px",
                    "mode": "scaleToFill"
                }
            }
        ]
    }
    if (face_value) {
        const faceValueWidth = face_value.toString().length * 70;
        const faceValueWidthLeft = ((314 - faceValueWidth) / 2) + 517;
        createObj.views = createObj.views.concat([{
                "type": "text",
                "text": `${face_value}`,
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": `${faceValueWidth}px`,
                    "height": "117.03999999999999px",
                    "top": "364px",
                    "left": `${faceValueWidthLeft}px`,
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "88px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "117.21600000000001px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "center"
                }
            },
            {
                "type": "text",
                "text": "元",
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": "54.99999999999999px",
                    "height": "62.919999999999995px",
                    "top": "398px",
                    "left": `${faceValueWidth + faceValueWidthLeft}px`,
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "44px",
                    "fontWeight": "normal",
                    "maxLines": "2",
                    "lineHeight": "63.49200000000001px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            }
        ]);
    } else {
        const priceString = Number(price).toString();
        let splitPrice = priceString.split(".");
        const splitPriceWidth = splitPrice[0].length * 65;
        const splitPriceWidthLeft = ((314 - splitPriceWidth) / 2) + 517;
        createObj.views = createObj.views.concat([{
                "type": "text",
                "text": `${splitPrice[0]}`,
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": `${ splitPriceWidth }px`,
                    "height": "99.44px",
                    "top": "320px",
                    "left": `${ splitPriceWidthLeft }px`,
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "88px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "97.68px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "right"
                }
            },
            {
                "type": "text",
                "text": "¥",
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": "32px",
                    "height": "49.72px",
                    "top": "362px",
                    "left": `${splitPriceWidthLeft - 20 }px`,
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "44px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "48.84px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            }
        ])
        if (splitPrice.length > 1) {
            createObj.views = createObj.views.concat([{
                "type": "text",
                "text": `. ${splitPrice[1]}`,
                "css": {
                    "color": "#F84842",
                    "background": "rgba(0,0,0,0)",
                    "width": `${(splitPrice[1].length * 35) + 35}px`,
                    "height": "49.72px",
                    "top": "362px",
                    "left": `${ splitPriceWidth + splitPriceWidthLeft }px`,
                    "rotate": "0",
                    "borderRadius": "",
                    "borderWidth": "",
                    "borderColor": "#000000",
                    "shadow": "",
                    "padding": "0px",
                    "fontSize": "44px",
                    "fontWeight": "bold",
                    "maxLines": "1",
                    "lineHeight": "48.84px",
                    "textStyle": "fill",
                    "textDecoration": "none",
                    "fontFamily": "",
                    "textAlign": "left"
                }
            }, ]);
        }
    }
    return createObj;
}
