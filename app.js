// const Koa = require('koa');
const Koa = require('./myKoa/application')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(5)
});


app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(4)
});


app.use(async ctx => {
  console.log(3)
  // ctx.response.status = '123'
  ctx.body = 'sheriff'
});

app.on('error',err => {
  console.log('错误已发生', err.stack)
})

app.listen(3000);