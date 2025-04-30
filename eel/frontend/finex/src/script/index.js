import '/eel.js'


async function healthCheck() {
  const result = await eel.health_check()();
  document.getElementById('status').innerText = result;
}


async function uploadData() {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) return;

  const filepath = fileInput.files[0].path;
  let data = await eel.load_data(filepath)();
  
  let summary = await eel.get_summary(data)();
  document.getElementById('summary').innerText = JSON.stringify(summary, null, 2);

  let imgSrc = await eel.plot_data(data, 'line')();
  document.getElementById('chart').src = imgSrc;
}


document.getElementById('uploadButton').addEventListener('click', uploadData);

healthCheck()
.then(() => {
  console.log('Health check passed');
})
.catch((error) => {
  console.error('Health check failed:', error);
});
