import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// function to type out text one character at a time
const typeText = (element, text) => {
  let index = 0;
  // set an interval to add a character to the element's innerHTML every 20 milliseconds
  let interval = setInterval(() => {
    // if all characters have been typed out, clear the interval
    if (index >= text.length) clearInterval(interval);
    // otherwise, add the next character to the element's innerHTML and increment the index
    else element.innerHTML += text.charAt(index++);
  }, 20);
};

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
const generateUniqueId = () => `id-${Date.now()}-${Math.random().toString(16)}`; // // function that generates a unique ID by combining the current timestamp and a random hexadecimal string

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
  // prevent default form submission
  e.preventDefault();

  // retrieve form data
  const data = new FormData(form);

  // add user's chatstripe to chat container
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // clear textarea input
  form.reset();

  // generate unique ID for bot's chatstripe
  const uniqueId = generateUniqueId();

  // add bot's chatstripe to chat container
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // scroll to the bottom of chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // retrieve specific message div
  const messageDiv = document.getElementById(uniqueId);

  // display loading indicator in message div
  loader(messageDiv);

  // send POST request to server
  const response = await fetch("https://codex-im0y.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  // clear loading indicator
  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  // if request was successful, display bot's response in message div
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trim any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
  } else {
    // if request failed, display error message and alert user
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  // if user presses enter key
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
