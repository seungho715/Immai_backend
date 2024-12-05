const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('util/config');
const { userInfoMiddleware } = require('util/middleware/user_info')

const app = express();
const port = config.server_port;
//const serviceAccount = require('./path/to/firebase-service-account.json'); //need to change once firebase is set up

const userstateRoute = require('api/users/userstate');
const usersRoute = require('api/users/users');
const googleAuthRoute = require('api/auth/googleoauth');
const passwordRoute = require('api/auth/passwordlogin');
const logoutRoute = require('api/auth/logout');
const languagesRoute = require('api/languages/languages');
const proficienciesRoute = require('api/proficiencies/proficiencies');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })




const corsOptions = {
  origin: 'https://immai.experiments.moe', // Allow any port on localhost
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(userInfoMiddleware);
app.use(express.static('./static'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/languages', languagesRoute);
app.use('/proficiencies', proficienciesRoute);
app.use('/api/auth', googleAuthRoute);
app.use('/api/auth', passwordRoute);
app.use('/api/auth', logoutRoute);
app.use('/api/userdata', userstateRoute);
app.use('/api/user', usersRoute);


// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
	console.log(`HTTP Server running on port ${port}`);
});

process.on('exit', ()=> {
  pool.end();
})

/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); */
