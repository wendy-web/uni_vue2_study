module.exports = {
    lintOnSave: true, // eslint-loader 是否在保存的时候检查
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'assets',
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    // 把px单位换算成rem单位
                    require("postcss-pxtorem")({
                        // 换算的基数 375的设计稿，换算基数就是37.5
                        rootValue: 37.5,
                        selectorBlackList: [".van"], // 要忽略的选择器并保留为px。
                        propList: ["*"], //可以从px更改为rem的属性。
                        minPixelValue: 1 // 设置要替换的最小像素值。
                    })
                ]
            }
        }
    },
    devServer: {
        open: false,
        https: false,
        proxy: {
            "/dev": {
                target: "https://new-test.y1b.cn", //请求的server域名
                changeOrigin: true,
                pathRewrite: {
                    '/dev': ''
                }
            },

        }
    },
}
