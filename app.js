const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
