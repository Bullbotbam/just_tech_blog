const path = require('path');

const express = require('express');
const routes = require('./controllers');

const exphbs = require('express-handlebars');

const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });
const session = require('express-session');

// let sequelize;

// if (process.env.JAWSDB_URL) {
// 	sequelize = new Sequelize(process.env.JAWSDB_URL);
// } else {
// 	sequelize = new Sequelize(
// 		process.env.DB_NAME,
// 		process.env.DB_USER,
// 		process.env.DB_PW,
// 		{
// 			host: 'localhost',
// 			dialect: 'mysql',
// 			port: 3306,
// 		}
// 	);
// }

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
	secret: process.env.PSST_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// turn on routes
app.use(require('./controllers/'));

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});
