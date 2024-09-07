const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { timeStamp } = require('console');
const app = express();
const port = 3001;
const ssl_port = 3443;
const { Pool } = require('pg');
const admin = require('firebase-admin');
//const serviceAccount = require('./path/to/firebase-service-account.json'); //need to change once firebase is set up

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/chain.pem', 'utf8');

const pool = new Pool({
  user: 'postgres',
  host: 'yellowtail.tplinkdns.com',
  database: 'immai',
  password: 'jerfy_truenas_db', //Some kind of password
  port: '9543',
})

/* const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
}; */

const corsOptions = {
  origin: /^http:\/\/localhost:\d+$/, // Allow any port on localhost
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

let proficiencies = {};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/languages', async (req, res) => {
  // console.log('Received a POST request on /languages');
  // const { learningLanguage, nativeLanguage } = req.body;
  // console.log('Learning Language: ', learningLanguage);
  // console.log('Native Language: ', nativeLanguage);
  // res.send("Languages received");

  const { lang_id = 1} = req.body;

  try {
    const query = `SELECT * FROM language_data.languages WHERE lang_id = $1`;
    const result = await pool.query(query, [lang_id]);
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from the database: ' + err.message);
  }
});

app.post('/proficiencies', (req, res) => {
  // console.log('Received a POST request on /proficiencies');
  // const { selectedLanguage, currentProficiency, targetFluency} = req.body;
  // console.log('selected Language: ', selectedLanguage);
  // console.log('Current Proficiency: ', currentProficiency);
  // console.log('Target Fluency: ', targetFluency);
  // res.send("Proficiencies received and stored");
})

app.get('/proficiencies/:languages', (req, res) => {
  const language = req.params.language;
  const proficiency = proficiencies[language];

  if(proficiency){
    res.json(proficiency);
  }
  else{
    res.status(404).send("Proficiency not found for the specified language");
  }
})

// Getting all the user data from the user table
app.get('/api/users', async (req, res) => {
  try {
    const query = `SELECT * FROM user_data.users`;  // Specify the schema and table directly
    const result = await pool.query(query);
    console.log(result.rows);  // Log the fetched data to the command prompt
    res.json(result.rows);     // Send the data to the client
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from the database: ' + err.message);
  }
});


// Getting only the usernames
app.get('/api/users/username', async(req, res) => {
  try{
    const query = 'SELECT username FROM user_data.users';
    const result = await pool.query(query);
    console.log(result.rows);
    res.json(result.rows);
  }catch(err){
    console.error(err);
    res.status(500).send('Error retrieving data from the database: ' + err.message);
  }
})
//Need to discuss about the firebase authentication

// Inserting User Data
app.post('/api/register', async(req, res) => {
  const {firebaseId, firstName, lastName, username} = req.body;
  try{
    const query = 'INSERT INTO user_data.users (id, first_name, last_name, username) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [firebaseId, firstName, lastName, username];
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).send('Error inserting user data into the database: ' + err.message);
  }
})

//Endpoint to handle user login for user data
app.post('/api/login', async(req, res) => {
  const{username, password} = req.body;

  try{
    const user = await admin.auth().getUserByEmail(username);
    if(user){
      const firebaseId = user.uid;

      const query = 'SELECT * FROM user_data.users WHERE id = $1';
      const values = [firebaseId];
      const result = await pool.query(query, values);

      if(result.rows.length > 0){
        res.json(result.rows[0]);
      }
      else{
        res.status(404).send('User not found in the database');
      }
    }
    else{
      res.status(401).send('Authentication failed');
    }
  }catch(err){
    console.error(err);
    res.status(500).send('Error logging in: '+ err.message);
  }
})



// Starting both http & https servers
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
	console.log(`HTTP Server running on port ${port}`);
});

/* httpsServer.listen(ssl_port, () => {
	console.log(`HTTPS Server running on port ${ssl_port}`);
}); */

process.on('exit', ()=> {
  pool.end();
})

/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 */