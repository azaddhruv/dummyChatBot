const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({
  keyFilename: './indigo-griffin-383512-176c2bfe5a90.json',
});
const fs = require('fs');

const getSentece = async () => {
  const filename = './uploads/recording.wav';
  const file = fs.readFileSync(filename);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  const config = {
    languageCode: 'en-US',
    alternativeLanguageCodes: ['es-ES', 'en-US', 'en-IN', 'hi-IN'],
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript) // Corrected typo
    .join('\n');
  console.log(`Transcription: ${transcription}
  `);
  return transcription;
};

module.exports = getSentece;
