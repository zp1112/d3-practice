

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { routerMiddleware } from 'react-router-redux';

// 引入renderToString
import { renderToString } from 'react-dom/server'

// 服务端是没有BrowserRouter 所以用StaticRouter
import { StaticRouter } from 'react-router-dom'
// 引入静态资源配置
import assethook from 'asset-require-hook'
import buildPath from '../build/dist/asset-manifest.json'

// 处理图片
import reducer from "../src/a_reducer"
import history from '../src/util/history';

const middlewareHistory = routerMiddleware(history)

assethook({
  extensions: ['png', 'jpg', 'jpeg', 'gif'],
})
const hook = require('css-modules-require-hook');
//  预处理.scss文件
hook({
  extensions: ['.scss'],
  preprocessCss: (data, filename) =>
    require('node-sass').renderSync({
      data,
      file: filename,
    }).css,
  camelCase: true,
  generateScopedName: '[name]__[local]__[hash:base64:8]',
})

const lessParser = require('postcss-less').parse;

hook({
  extensions: '.less',
  processorOpts: {parser: lessParser},
});

//  要引在css-modules-require-hook之后

const store = createStore(reducer, compose(
  applyMiddleware(thunk)
))
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const path = require('path')
const Routers = require('./../src/router').default

module.exports = function startServer () {
  app.use(bodyParser.json())

  app.use('/build', express.static('build'))
  // 映射到build后的路径，发布上线时使用
  app.use((req, res, next) => {
    if (req.url.startsWith('/dist/')) {
      return next()
    }

    //  编译jsx
    const context = {}
    const frontComponents = renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <Routers />
        </StaticRouter>
      </Provider>
    )

    //  搭建页面骨架
    const _frontHtml = `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>d3例子集合</title>
          </head>
          <body>
            <noscript>
              You need to enable JavaScript to run this app.
            </noscript>
            <div id="app-root">
              ${frontComponents}
            </div>
            <script src="/build/${buildPath['app.js']}"></script>
            <script src="/build/${buildPath['vendors.js']}"></script>
          </body>
        </html>
    `
    res.send(_frontHtml)

    // return res.sendFile(path.resolve('build/index.html'))
  })

  app.listen('9089', () => {
    console.log('open Browser http://localhost:9089')
  })
}
