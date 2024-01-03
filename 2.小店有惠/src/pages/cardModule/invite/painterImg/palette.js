export default function({ codeUrl }) {
    return {
        "width": "628px",
        "height": "1280px",
        "background": "#FFE7D1",
        "views": [{
                "type": "image",
                "url": "https://file.y1b.cn/store/1-0/231227/658bf648c64fb.png",
                "css": {
                    "width": "628px",
                    "height": "1220px",
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
                "type": "qrcode",
                "content": codeUrl,
                "css": {
                    "background": "#ffffff",
                    "width": "158.5px",
                    "height": "158.5px",
                    "top": "965.5px",
                    "left": "224px",
                    "rotate": "0",
                    "borderRadius": ""
                }
            }
        ]
    }
}
