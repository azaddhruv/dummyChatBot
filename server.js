const express = require('express');
const multer = require('multer');
const fs = require('fs');
const speech = require('@google-cloud/speech');
const app = express();
const port = 3000;
const getSentece = require('./utils/getSentence');

const cors = require('cors');
const path = require('path');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
const client = new speech.SpeechClient({
  keyFilename: './indigo-griffin-383512-176c2bfe5a90.json',
});

app.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;
    const targetPath = `uploads/${audioFile.originalname}`;
    fs.renameSync(audioFile.path, targetPath);
    console.log('Audio saved:', targetPath);
    const sentence = await getSentece();
    res.json({ status: 'success', data: sentence });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).send('Error uploading audio');
  }
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
