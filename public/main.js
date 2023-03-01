const socket = io();
const clientsTotal = document.getElementById("clients-count");
const messageBox = document.getElementById("message-box");
const nameInput = document.getElementById("name-input");
const messageEnter = document.getElementById("message-enter");
const messageInput = document.getElementById("message-input");

messageEnter.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});
socket.on("clients-count", (data) => {
  clientsTotal.innerText = "Total Clients:" + data;
});
function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}
socket.on("chat-message", (data) => {
  console.log(data);
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">
      ${data.message}
        <span>${data.name} on ${moment(data.dateTime).format(
    "MMM Do YYYY, h:mm a"
  )}</span>
      </p>
    </li>
  `;
  messageBox.innerHTML += element;
  scrollToBottom();
}
function scrollToBottom() {
  messageBox.scrollTo(0, messageBox.scrollHeight);
}
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`;
  messageBox.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
