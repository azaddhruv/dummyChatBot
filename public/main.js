const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const audioPlayer = document.getElementById('audioPlayer');
let mediaRecorder;
let recordedChunks = [];

const recBits = [
  'Yeah Sure',
  'I did not get you',
  'Can you please elaborate?',
  'Ok but first tell me How does a induction motor start?',
  'Maybe you can start trading now.',
  'Prefer another sequqence.',
];

// stopButton.style.opacity = 0.3;
// stopButton.style.transform = 'scale(0.8)';
stopButton.setAttribute('class', 'btn__small');

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      event.preventDefault();
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = (event) => {
      event.preventDefault();
      const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      // audioPlayer.src = audioUrl;
      sendAudioToServer(audioBlob); // Send audio to server
    };
  })
  .catch((error) => {
    console.error('Error accessing microphone:', error);
  });

startButton.addEventListener('click', (event) => {
  event.preventDefault();
  recordedChunks = [];
  mediaRecorder.start();
  startButton.disabled = true;
  stopButton.disabled = false;
  stopButton.setAttribute('class', 'btn__normal');
  startButton.setAttribute('class', 'btn__small');
});

stopButton.addEventListener('click', (event) => {
  event.preventDefault();
  mediaRecorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
  stopButton.setAttribute('class', 'btn__small');
  startButton.setAttribute('class', 'btn__normal');
  return false;
});

async function sendAudioToServer(audioBlob) {
  // Create a FormData object and append the audioBlob
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  console.log('sendeddddddddddddddddddddding');
  const data = formData;

  const res = await axios.post('http://localhost:3000/upload-audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the content type
    },
  });

  const main = document.querySelector('.main');
  let para = document.createElement('p');

  if (res?.data?.data && res?.data?.data.length > 0) {
    para.innerText = `${res.data.data}`;
    para.setAttribute('class', 'send');
    main.appendChild(para);

    if (
      res.data.data.toLowerCase() == 'bunny i love you' ||
      res.data.data == 'बनी आई लव यू'
    ) {
      const recPara = recBits[Math.floor(Math.random() * recBits.length)];
      let newPara = document.createElement('p');
      newPara.innerText = 'I Love you too Pan Pan';
      newPara.setAttribute('class', 'rec');
      main.appendChild(newPara);
      return;
    }

    if (
      Math.floor(Math.random() * 3) === 0 ||
      Math.floor(Math.random() * 3) === 1
    ) {
      const recPara = recBits[Math.floor(Math.random() * recBits.length)];
      let newPara = document.createElement('p');
      newPara.innerText = recPara;
      newPara.setAttribute('class', 'rec');
      main.appendChild(newPara);
    }
  } else {
    para.innerText = `Sorry, Did not get you.`;
    para.setAttribute('class', 'rec');
    main.appendChild(para);
  }
  return false;
}
