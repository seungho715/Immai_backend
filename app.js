const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { timeStamp } = require('console');
const app = express();
const port = 3001;
const ssl_port = 3443;
const {pool} = require('pg');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/chain.pem', 'utf8');

const pool = new Pool({
  user: 'postgres',
  host: 'yellowtail.tplinkdns.com',
  database: 'immai',
  password: 'jerfy_truenas_db', //Some kind of password
  port: '9543',
  ssl: {
    rejectUnauthorized: false
  }
})

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

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

app.post('/languages', (req, res) => {
  console.log('Received a POST request on /languages');
  const { learningLanguage, nativeLanguage } = req.body;
  console.log('Learning Language: ', learningLanguage);
  console.log('Native Language: ', nativeLanguage);
  res.send("Languages received");
});

app.post('/proficiencies', (req, res) => {
  console.log('Received a POST request on /proficiencies');
  const { selectedLanguage, currentProficiency, targetFluency} = req.body;
  console.log('selected Language: ', selectedLanguage);
  console.log('Current Proficiency: ', currentProficiency);
  console.log('Target Fluency: ', targetFluency);
  res.send("Proficiencies received and stored");
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

// End Point to send data to frontend
app.get('/api/:schema/:table', async (req, res) => {
  const {schema, table} = req.params;
  try{
    const query = 'SELECT * FROM ${schema}.${table}';
    const result = await pool.query(query)
  }catch(err){
    res.status(500).send('Error retrieving data from the database');
  }
});

// Mid point to send data to database
app.post('/api/:schema/:table', async (req, res) => {
  const {schema, table} = req.params;
  const {column1, column2, column3} = req.body;

  try{
    const query = 'INSERT INTO ${schema}.${table} (column1, column2, column 3) VALUES {$1, $2, $3) RETURNING *';
    const values = [column1, column2, column3];
    const result = await pool.query(query, values);
    res.join(result.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).send('Error inserting data into the database');
  }
})



// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
	console.log(`HTTP Server running on port ${port}`);
});

httpsServer.listen(ssl_port, () => {
	console.log(`HTTPS Server running on port ${ssl_port}`);
});

process.on('exit', ()=> {
  pool.end();
})

/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 */