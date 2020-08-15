const EventEmitter = require('events')
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application extends EventEmitter {
  constructor(){
    super()
    // 中间件的集合
    this.middlewares = []
    // 上下文
    this.context = context
    this.request = request
    this.response = response
  }
  use(middleware){
    this.middlewares.push(middleware)
  }
  compose(){
    return async ctx => {
      function createNext(currentMiddleWare,oldNext){
        return async () => {
          currentMiddleWare(ctx,oldNext)
        }
      }
      // next本身是一个函数，如果没有next的处理结果，那么执行next()要返回一个Promise.resove()
      let next = async () => {
        return Promise.resolve()
      }
      // 从后往前执行
      let len = this.middlewares.length
      for(let i = len - 1; i >= 0; i --){
        // 最后一个middleware
        let currentMiddleWare = this.middlewares[i]
        next = createNext(currentMiddleWare,next)
      }
      await next()
    }
  }
  createContext(req,res){
    // let ctx = this.context
    let ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.res = ctx.response.res = res
    ctx.req = ctx.request.req = req
    return ctx
  }
  callback(){
    return (req,res) => { // 必须返回一个fn
      let ctx = this.createContext(req,res)
      let respond = () => this.responseBody(ctx)
      let onerror = err => this.onerror(err,ctx)
      let fn = this.compose() // 返回的是一个promise
      return fn(ctx).then(respond).catch(onerror)
    }
  }
  responseBody(ctx){
    let context = ctx.body
    if(typeof context == 'string'){
      ctx.res.end(context)
    }else if(typeof context == 'object'){
      ctx.res.end(JSON.stringify(context))
    }
  }
  onerror(err,ctx){
    if(err.code == 'ENOENT'){
      ctx.status = 404
    }else{
      ctx.status = 500
    }
    let msg = err.message || '❌服务器异常'
    ctx.res.end(msg)
    this.$emit('error',err)
  }
  listen(...args){
    var server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = Application