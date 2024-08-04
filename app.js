const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const ssl_port = 3443;

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/yellowtail.tplinkdns.com/chain.pem', 'utf8');

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
  res.send("Proficiencies received");
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


/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 */