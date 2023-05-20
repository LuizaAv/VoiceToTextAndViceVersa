const recButton = document.getElementById("recBtn");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let record = false;
let recognition;
let result

function converter(){
    recognition = new SpeechRecognition()
    recButton.classList.add("record")
    recognition.start()
    recognition.onresult = (event) => {
        result = event.results[0][0].transcript;
        console.log(result)
        postData(result)
    }
}

function stopRecording(){
    recognition.stop()
    recButton.classList.remove("record")
    record = false
}



async function postData(data) {
  try {
    const response = await axios.post(`http://localhost:3000/question`, { message: data });
    if (response.status === 200) {
      clientId = response.data.clientId;
      console.log("Data posted");
      getChatGPTResponse(result); 
    } else {
      console.log("Error: " + response.status);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getChatGPTResponse(data) {
  try {
    const response = await axios.get(`http://localhost:3000/question?clientId=${clientId}`);
    
    if (response.status === 200) {
      const audioFilePath = response.data.filePath;
    } else {
      console.log('Error:', response.status);
    }
  } catch (error) {
    console.log(error);
  }
}

recButton.addEventListener("mousedown", () => {
    if(!record){
        converter()
        record = true
    }else{
        stopRecording()
    }
})
