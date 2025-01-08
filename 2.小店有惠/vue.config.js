const path = require('path')

module.exports = {
    configureWebpack: {
        module: {
            rules: [{
                test: /\.vue$/,
                use: {
                    loader: path.resolve(__dirname, "./node_modules/vue-inset-loader")
                },
            }]
        },
    }
}