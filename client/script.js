import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval
let speechRecognition = null;


function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

function micControl(isRecording){

    if(isRecording){
        document.querySelector("#micOn").style.display = "none";
        document.querySelector("#micOff").style.display = "inline";
    }else{

        document.querySelector("#micOn").style.display = "inline";
        document.querySelector("#micOff").style.display = "none";
    }
    speechRecognition.stop(); 
   
}

function speechText(){
    if ("webkitSpeechRecognition" in window) {
        // Initialize webkitSpeechRecognition
         speechRecognition = new webkitSpeechRecognition();
      
        // String for the Final Transcript
        let final_transcript = "";
      
        // Set the properties for the Speech Recognition object
        speechRecognition.continuous = false;
        speechRecognition.interimResults = true;
      
        // Callback Function for the onStart Event
        speechRecognition.onstart = () => {
          // Show the Status Element
          micControl(true);
        };
        speechRecognition.onerror = () => {
          // Hide the Status Element
          micControl(false);
        };
        speechRecognition.onend = () => {
          // Hide the Status Element
          micControl(false);
        };
      
        speechRecognition.onresult = (event) => {
          // Create the interim transcript string locally because we don't want it to persist like final transcript
          let interim_transcript = "";
      
          // Loop through the results from the speech recognition object.
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
      
          // Set the Final transcript and Interim transcript.
        document.querySelector("#prompt").innerHTML = final_transcript+''+interim_transcript;
         // var interim = document.querySelector("#interim").innerHTML = interim_transcript;
         speechRecognition.stop();
        };
      
      } else {
        console.log("Speech Recognition Not Available");
      }
}

 // Set the onClick property of the start button
 document.querySelector("#micOn").onclick = () => {
   
    speechText();
    // Start the Speech Recognition
    speechRecognition.start();
  };
  // Set the onClick property of the stop button
  document.querySelector("#micOff").onclick = () => {
    // Stop the Speech Recognition
    speechText();
    speechRecognition.stop();
  };

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()
    document.querySelector("#prompt").value= '';
    micControl(false);

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
  
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }

    speechRecognition.abort();
    speechRecognition.stop();
}



form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
    speechRecognition.abort();
})