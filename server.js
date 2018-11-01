const V = require('./view')
const M = require('./model')
const logger = require('koa-logger')
const router = require('koa-router')()
const koaBody = require('koa-body')

const Koa = require('koa')
const app = (module.exports = new Koa())

const login = false

app.use(logger())
app.use(koaBody())

router
  .get('/', list)
  .get('/:user/post/new', add)
  .get('/:user/posts', listpost)
  .get('/:user/post/:id', show)
  .post('/:user/post', create)

app.use(router.routes())

async function list (ctx) {
  const blog = M.list()
  ctx.body = await V.list(blog, login)
}

async function add (ctx) {
  ctx.body = await V.new(login)
}

async function listpost (ctx) {
  const posts = M.listpost(ctx.params.user)
  ctx.body = await V.listpost(posts, login)
}

async function show (ctx) {
  const id = ctx.params.id
  const user = ctx.params.user
  const post = M.get(id, user)
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await V.show(post)
}

async function create (ctx) {
  const post = ctx.request.body
  const user = ctx.params.user
  M.add(post, user)
  ctx.redirect('/')
}

if (!module.parent) {
  app.listen(3000)
  console.log('Server run at http://localhost:3000')
}
