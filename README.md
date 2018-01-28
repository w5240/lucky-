
# 前端项目


##目录结构 - Structure

```
|---/app        // koa server
|---|---/dist   // 前端代码输出目录
|---/src        // 前端代码和资源, 将会被打包到/app/dist
|---|---/common     // 公用代码
|---|---/[modules]  // 业务模块
|---|---app.js          // webpack总入口
|---|---store.js        // 全局状态树
|---|---routes.js       // 路由表
|---|---template.html   // 单页面的模板

|---README.MD       // 项目介绍
|---package.json    // npm 配置
|---yarn.lock       // 依赖库版本锁，!!切勿手动更改
|---**              // 其他配置文件
```

## 开发 - Develop

1. 安装环境

> [node.js](https://nodejs.org/en/)
  
> [yarn](https://yarnpkg.com/zh-Hans/docs/install)

2. 安装依赖:

``` javascript
$ yarn
```
3. 开发: 

```
yarn run koa-dev
```
## 测试 - testing 
```
yarn run test
```
    
## 发布 - Release
```
$ yarn run release 
```

>All rights reserved &copy;QDUM \
>青岛优米信息技术有限公司 - 前端

