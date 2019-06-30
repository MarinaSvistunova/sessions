const [{ Server: h1 }, x] = [require('http'), require('express')];

const Router = x.Router();
const PORT = 4321;
const { log } = console;

const bodyParser	= require('body-parser');
const session	= require('express-session');
const {	u: User	}	= require('./models/User');

const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const app = x();

const checkAuth = (r, res, next) => {
  if (r.session.auth === 'ok') {
    next();
  } else {
    res.redirect('/login');
  }
};

Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));
app
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(x.static('.'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({	extended: true }))
  .use(session({	secret: 'mysecret',
                  resave: true,
                  saveUninitialized: true }))
  .use('/', Router)
  // .get('/password/:login',	async	r	=> {
  //   const {	login	}	= r.params;
  //   const result	= await	User.findOne({	login	});
  //   r.res.send(result	? result.password: 'Такого	логина	нет!');
  // })
  .post('/login/check/',	async	r	=> {
          const {	body: {	login	}	}	= r;
          const user	= await	User.findOne({	login	});
          if (user)	{
            if (user.password	=== r.body.pass)	{
              r.session.auth	= 'ok';
              r.session.login	= login;
              r.res.send('Вы	авторизованы.	Доступен	закрытый	маршрут!');
            }	else {
               r.res.send('Неверный	пароль!');}
          }	else {
           r.res.send('Нет	такого	пользователя!');}
  })
  .get('/profile', checkAuth, r => r.res.send(r.session.login))
  .get('/login',	r	=> r.res.render('login'))

  .get('/users', checkAuth, async	r	=> {
    const users	= await	User.find();
    let usersTab = '<table>';
    users.forEach(x => usersTab += `<tr><td>${x.login}</td><td>${x.password}</td></tr>`);
    usersTab += '</table>';
    r.res.send(usersTab);
  }) // r => r.res.render('users'))
  //  async	r	=> {
  // const users	= await	User.find();
  //     let usersTab = [];
  //     await users.forEach(x => usersTab.push([x.login, x.password]));
  //     r.res.render('users', usersTab);
  //  })
  .get('/logout', r => {r.session.auth = 'not'; r.res.render('login')})
  .use(({ res: r }) => r.status(404).end('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).end(`Ошибка: ${e}`))
  .set('view engine', 'pug')
  .set('x-powered-by', false);
const s = h1(app)
  .listen(process.env.PORT || PORT, () => log(process.pid));
