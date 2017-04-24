const koa = require('koa');
const router = require('koa-router');
const cors = require('koa2-cors');
const pug = require('koa-pug');
const moment = require('moment');
const app = new koa();
const Router = new router();
const Pug = new pug({
  viewPath: './views',
  basedir: './views',
  app: app
});

Router.get('/',home);
Router.get('/not_found',errorMessage);

async function errorHandling (ctx,next) {
    try {
      await next;
  } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.createError('error', err, ctx);
  }
}

async function home (ctx,next) {
  ctx.render('home');
  //ctx.body = srv('./views','home.pug');
  await next;
}

async function errorMessage (ctx) {
    ctx.status = 404;
    ctx.body = `<h1> ${ctx.status} </h1> <p>Page not found.</p>`;
}

async function redirect (ctx) {
   if (404 != ctx.status) return;
   ctx.redirect('/not_found');
}

Router.get('/:par',async (ctx,next) => {
   const time = ctx.params.par;
   ctx.response.body = calculate(time);
   ctx.body = ctx.response.body;
});

function calculate (time) {
  let finalOutput = {
    unix: null,
    natural: null
  };

  //let date;
  //let nix;
  if (!isNaN(parseInt(time))){
  	finalOutput.natural = moment.unix(parseInt(time)).format("MMMM D, YYYY");
    finalOutput.unix = parseInt(time);
  	//date =  new Date(parseInt(time)).toString();
  	//finalOutput.natural = date;
  	//finalOutput.unix = time;
  }
  else {
  	finalOutput.unix = moment(time, "MMMM D, YYYY").format("X");
  	finalOutput.natural = time;
  	//nix = new Date(time).getTime()/1000;
  	//if (nix == null) finalOutput.natural = null;
  	//finalOutput.natural = new Date(time);
  	//finalOutput.unix = nix; 
  }
  /*
  if (date === 'Invalid Date') date = null;
  if (nix === 'Invalid Date') nix = null;
  finalOutput.natural = date;
  finalOutput.unix = nix;
  */
  return finalOutput;
}

app.use(cors());
app.use(Router.routes());
app.use(redirect);
app.use(errorHandling);

app.listen(process.env.PORT,() => {
	console.log(`listening ${process.env.PORT}`);
});