const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');     // 为了单独打包css
const HtmlWebpackPlugin = require('html-webpack-plugin');             // 生成html
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin')
const CompressionPlugin = require("compression-webpack-plugin");
// const SentryPlugin = require('webpack-sentry-plugin');

// const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

// process.env.RELEASE_VERSION = gitSha;

module.exports = {
    mode: 'production',
    entry: {
        app: ["babel-polyfill", path.resolve(__dirname, 'src', 'index')],
    },
    output: {
        path: path.resolve(__dirname, 'build/dist'),    // 将文件打包到此目录下
        publicPath: 'dist/',                           // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js',
    },
    module: {
        rules: [
            {   // .js .jsx用babel解析
                test: /\.js?$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader',
            },
            {   // .css 解析
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                        },
                    },
                    'postcss-loader',
                ],
            },
            {   // .less 解析
                test: /\.less$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                        },
                    },
                    'postcss-loader',
                    'less-loader',
                ],
                include: path.resolve(__dirname, "src"),
            },
            {   // .less 解析 (用于解析antd的LESS文件)
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', `less-loader`],
                include: path.resolve(__dirname, "node_modules"),
            },
            {   // .scss 解析
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {   // 文件解析
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                loader: 'file-loader?name=assets/[name].[ext]',
            },
            {   // 图片解析
                test: /\.(png|jpg|gif|jpeg)$/,
                include: path.resolve(__dirname, "src"),
                loader: 'url-loader?limit=8192&name=assets/[name].[ext]',
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: "vendors",
            minChunks: 1,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    minChunks: 1,
                },
            },
        },
    },
    performance: {
        hints: false,
    },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                ie8: false,
                mangle: true,
                output: { comments: false },
                compress: {
                  warnings: false,
                  drop_console: true,
                  drop_debugger: true,
                  unused: false,
                 },
              },
            sourceMap: true,
            cache: true,
          }),
          new CompressionPlugin({
            asset: '[path].gz[query]', // 目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip',// 算法
            test: new RegExp(
                 '\\.(js|css)$'    // 压缩 js 与 css
            ),
            threshold: 10240,// 只处理比这个值大的资源。按字节计算
            minRatio: 0.8,// 只有压缩率比这个值小的资源才会被处理
          }),
          new ManifestPlugin({
            fileName: 'asset-manifest.json',
          }),
        // https://doc.webpack-china.org/plugins/define-plugin/
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'), // 定义生产环境
            },
        }),

        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin({
            filename:'[name].[hash:6].css', // 生成的文件名
            allChunks: true,                // 从所有chunk中提取
        }),

        // new SentryPlugin({
        //     include: './build',
        //     release: gitSha,
        //     configFile: 'sentry.properties',
        //   }),
    //       new SentryPlugin({
    //         release: process.env.RELEASE_VERSION,
    //         deleteAfterCompile: true,
    //         suppressErrors: true,
    //         organization: 'sentry', 
    // project: 'react',
    // apiKey: '787b0eb98fea486283cf7d3ada7bdcf014ad925736e749529f90431ae262dd0d',
    //         /** filenameTransform: function (filename) {
    //           var pub = config.build.assetsPublicPath
    //           if (/^\/\//.test(pub)) pub = 'http:' + pub
    //           var urlObj = require('url').parse(pub)
    //           return '~' + urlObj.pathname.replace(/\/+$/, '') + '/' + filename
    //         } */
    //       }),

        // // 作用域提升，优化打包
        new webpack.optimize.ModuleConcatenationPlugin(),

        // 此插件详细教程 http://www.cnblogs.com/haogj/p/5160821.html
        new HtmlWebpackPlugin({                     // 根据模板插入css/js等生成最终HTML
            filename: '../index.html',              // 生成的html存放路径，相对于 output.path
            template: './src/index.html',           // html模板路径
            favicon: 'favicon.ico',                 // 自动把根目录下的favicon.ico图片加入html
            inject: true,                           // 是否将js放在body的末尾
        }),
    ],
    // 解析器， webpack提供的各种方便的工具函数
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss'], // 后缀名自动补全
    },
};